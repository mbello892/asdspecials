import "server-only"
import { MercadoPagoConfig, Preference } from "mercadopago"

/**
 * Lazy MP client — construimos en cada request en vez de top-level para
 * que Next.js no explote si la env var falta en build time.
 */
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
