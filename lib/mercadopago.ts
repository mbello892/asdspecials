import "server-only"
import { MercadoPagoConfig, Preference, Payment } from "mercadopago"

function getClient() {
  const token = process.env.MP_ACCESS_TOKEN
  if (!token) {
    throw new Error("MP_ACCESS_TOKEN no configurado")
  }
  return new MercadoPagoConfig({
    accessToken: token,
    options: { timeout: 10_000 },
  })
}

export type CreatePreferenceInput = {
  orderId: number
  items: Array<{
    id: string
    title: string
    quantity: number
    unit_price: number
    picture_url?: string | null
  }>
  payer: {
    name: string
    surname: string
    email: string
    phone?: string
  }
  appUrl: string
}

export async function createPreference(input: CreatePreferenceInput) {
  const client = getClient()
  const preference = new Preference(client)

  // MP rechaza notification_url y auto_return cuando el host no es publico (localhost).
  // En dev lo omitimos; en preview/prod se setean normal.
  const isPublic = /^https:\/\//.test(input.appUrl) && !input.appUrl.includes("localhost")

  const res = await preference.create({
    body: {
      items: input.items.map((it) => ({
        id: it.id,
        title: it.title,
        quantity: it.quantity,
        unit_price: it.unit_price,
        currency_id: "ARS",
        picture_url: it.picture_url ?? undefined,
      })),
      payer: {
        name: input.payer.name,
        surname: input.payer.surname,
        email: input.payer.email,
        phone: input.payer.phone
          ? { area_code: "", number: input.payer.phone }
          : undefined,
      },
      external_reference: String(input.orderId),
      back_urls: {
        success: `${input.appUrl}/orden/${input.orderId}?mp=success`,
        failure: `${input.appUrl}/orden/${input.orderId}?mp=failure`,
        pending: `${input.appUrl}/orden/${input.orderId}?mp=pending`,
      },
      ...(isPublic && {
        auto_return: "approved" as const,
        notification_url: `${input.appUrl}/api/webhooks/mercadopago`,
      }),
      statement_descriptor: "ASDSPECIALS",
    },
  })

  return {
    id: res.id!,
    initPoint: res.init_point!,
    sandboxInitPoint: res.sandbox_init_point!,
  }
}

export type ProcessCardPaymentInput = {
  orderId: number
  token: string
  installments: number
  paymentMethodId: string
  issuerId?: string
  transactionAmount: number
  payer: {
    email: string
    identification?: { type: string; number: string }
  }
  description?: string
}

export type MPPaymentStatus =
  | "approved"
  | "authorized"
  | "in_process"
  | "in_mediation"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "charged_back"
  | "pending"

export async function processCardPayment(input: ProcessCardPaymentInput) {
  const client = getClient()
  const payment = new Payment(client)

  const res = await payment.create({
    body: {
      transaction_amount: input.transactionAmount,
      token: input.token,
      description: input.description ?? `Pedido #${input.orderId}`,
      installments: input.installments,
      payment_method_id: input.paymentMethodId,
      issuer_id: input.issuerId ? Number(input.issuerId) : undefined,
      external_reference: String(input.orderId),
      statement_descriptor: "ASDSPECIALS",
      three_d_secure_mode: "optional",
      payer: {
        email: input.payer.email,
        identification: input.payer.identification,
      },
    },
  })

  return {
    id: res.id as number | undefined,
    status: res.status as MPPaymentStatus | undefined,
    statusDetail: res.status_detail as string | undefined,
  }
}

export function mapPaymentToWCStatus(status: MPPaymentStatus | undefined): string | null {
  switch (status) {
    case "approved":
    case "authorized":
      return "processing"
    case "pending":
    case "in_process":
    case "in_mediation":
      return "pending"
    case "rejected":
    case "cancelled":
      return "failed"
    case "refunded":
    case "charged_back":
      return "refunded"
    default:
      return null
  }
}

export async function updateWCOrderStatus(
  orderId: string | number,
  status: string,
  paymentId: string,
) {
  const { WC_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env
  if (!WC_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    throw new Error("WC env vars missing")
  }
  const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")
  const res = await fetch(
    `${WC_URL.replace(/\/$/, "")}/wp-json/wc/v3/orders/${orderId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        status,
        transaction_id: paymentId,
        meta_data: [{ key: "_mp_payment_id", value: paymentId }],
      }),
      cache: "no-store",
    },
  )
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`WC PUT order ${orderId} → ${res.status}: ${text.slice(0, 200)}`)
  }
}
