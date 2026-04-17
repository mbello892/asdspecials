import { NextResponse } from "next/server"
import {
  processCardPayment,
  mapPaymentToWCStatus,
  updateWCOrderStatus,
} from "@/lib/mercadopago"

type Body = {
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
}

export async function POST(req: Request) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const { orderId, token, installments, paymentMethodId, issuerId, transactionAmount, payer } = body
  if (!orderId || !token || !transactionAmount || !payer?.email) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
  }

  try {
    const result = await processCardPayment({
      orderId,
      token,
      installments,
      paymentMethodId,
      issuerId,
      transactionAmount,
      payer,
    })

    const wcStatus = mapPaymentToWCStatus(result.status)
    if (wcStatus && result.id) {
      await updateWCOrderStatus(orderId, wcStatus, String(result.id))
    }

    return NextResponse.json({
      id: result.id,
      status: result.status,
      statusDetail: result.statusDetail,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error procesando pago"
    console.error("[payments/mp] error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
