import { NextResponse } from "next/server"
import crypto from "node:crypto"
import { MercadoPagoConfig, Payment } from "mercadopago"
import {
  mapPaymentToWCStatus,
  updateWCOrderStatus,
  type MPPaymentStatus,
} from "@/lib/mercadopago"

/**
 * POST /api/webhooks/mercadopago
 *
 * MP llama con { type: "payment", data: { id } } cuando un pago cambia de estado.
 * Nosotros: fetch del pago → leer external_reference (order id WC) → update status WC.
 *
 * Firma: opcionalmente verificamos x-signature con MP_WEBHOOK_SECRET (seteado en panel MP).
 * Si no hay secret configurado, logueamos warning y procesamos (solo para dev).
 */

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
