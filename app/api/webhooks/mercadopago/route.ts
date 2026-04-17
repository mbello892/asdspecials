import { NextResponse } from "next/server"
import crypto from "node:crypto"
import { MercadoPagoConfig, Payment } from "mercadopago"

/**
 * POST /api/webhooks/mercadopago
 *
 * MP llama con { type: "payment", data: { id } } cuando un pago cambia de estado.
 * Nosotros: fetch del pago → leer external_reference (order id WC) → update status WC.
 *
 * Firma: opcionalmente verificamos x-signature con MP_WEBHOOK_SECRET (seteado en panel MP).
 * Si no hay secret configurado, logueamos warning y procesamos (solo para dev).
 */

type MPPaymentStatus =
  | "approved"
  | "authorized"
  | "in_process"
  | "in_mediation"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "charged_back"
  | "pending"

function verifySignature(req: Request, rawBody: string, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) {
    console.warn("[mp-webhook] MP_WEBHOOK_SECRET no configurado, skip signature check")
    return true
  }
  const sig = req.headers.get("x-signature")
  const reqId = req.headers.get("x-request-id")
  if (!sig || !reqId) return false

  const parts = Object.fromEntries(
    sig.split(",").map((p) => {
      const [k, v] = p.split("=")
      return [k.trim(), v?.trim() ?? ""]
    }),
  )
  const ts = parts.ts
  const v1 = parts.v1
  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${reqId};ts:${ts};`
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex")
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))
  } catch {
    return false
  }
}

function mapPaymentToWCStatus(status: MPPaymentStatus): string | null {
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

async function updateWCOrderStatus(orderId: string, status: string, paymentId: string) {
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

export async function POST(req: Request) {
  const token = process.env.MP_ACCESS_TOKEN
  if (!token) {
    return NextResponse.json({ error: "MP no configurado" }, { status: 500 })
  }

  const rawBody = await req.text()
  let body: unknown
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const b = body as { type?: string; data?: { id?: string | number } }
  if (b.type !== "payment" || !b.data?.id) {
    // MP manda varios tipos de notificaciones; solo nos importa payment
    return NextResponse.json({ ok: true, skipped: b.type ?? "unknown" })
  }
  const paymentId = String(b.data.id)

  if (!verifySignature(req, rawBody, paymentId)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 })
  }

  try {
    const client = new MercadoPagoConfig({ accessToken: token })
    const payment = new Payment(client)
    const p = await payment.get({ id: paymentId })

    const status = p.status as MPPaymentStatus | undefined
    const externalRef = p.external_reference
    if (!status || !externalRef) {
      return NextResponse.json({ ok: true, note: "sin status o external_reference" })
    }
    const wcStatus = mapPaymentToWCStatus(status)
    if (!wcStatus) {
      return NextResponse.json({ ok: true, note: `status MP no mapeado: ${status}` })
    }
    await updateWCOrderStatus(externalRef, wcStatus, paymentId)
    return NextResponse.json({ ok: true, orderId: externalRef, wcStatus })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "error procesando webhook"
    console.error("[mp-webhook] error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
