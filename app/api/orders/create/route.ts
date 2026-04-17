import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { TAG_PRODUCTS } from "@/lib/woocommerce"
import { createPreference } from "@/lib/mercadopago"

/**
 * POST /api/orders/create
 * Body: { items, billing, paymentMethod: "bacs" | "mp" }
 *
 * Crea una orden WC y, si el pago es MP, crea ademas una preference y devuelve el id.
 * - bacs: status on-hold, esperando transferencia
 * - mp:   status pending, preference creada; el front redirige a /checkout/pago/:id
 */

type IncomingItem = { productId: number; quantity: number }

type IncomingBilling = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2?: string
  city: string
  state: string
  postcode: string
  notes?: string
}

type PaymentMethod = "bacs" | "mp"

type CreateOrderBody = {
  items: IncomingItem[]
  billing: IncomingBilling
  paymentMethod: PaymentMethod
}

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function validate(body: unknown): { ok: true; data: CreateOrderBody } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Body inválido" }
  const b = body as Partial<CreateOrderBody>

  if (!Array.isArray(b.items) || b.items.length === 0) {
    return { ok: false, error: "El carrito está vacío" }
  }
  for (const item of b.items) {
    if (!item || typeof item.productId !== "number" || typeof item.quantity !== "number") {
      return { ok: false, error: "Item inválido en el carrito" }
    }
    if (item.quantity < 1) {
      return { ok: false, error: "Cantidad inválida" }
    }
  }

  const billing = b.billing
  if (!billing || typeof billing !== "object") {
    return { ok: false, error: "Datos de envío faltantes" }
  }
  const required: (keyof IncomingBilling)[] = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "address1",
    "city",
    "state",
    "postcode",
  ]
  for (const key of required) {
    if (!isNonEmpty((billing as Record<string, unknown>)[key])) {
      return { ok: false, error: `Falta completar: ${key}` }
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billing.email!)) {
    return { ok: false, error: "Email inválido" }
  }

  if (b.paymentMethod !== "bacs" && b.paymentMethod !== "mp") {
    return { ok: false, error: "Método de pago no soportado" }
  }

  return { ok: true, data: b as CreateOrderBody }
}

type WCOrderLineItem = {
  id: number
  product_id: number
  name: string
  quantity: number
  price: string | number
  image?: { src?: string } | null
}

type WCOrderResponse = {
  id: number
  number: string
  total: string
  status: string
  line_items: WCOrderLineItem[]
}

export async function POST(req: Request) {
  const { WC_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET, NEXT_PUBLIC_APP_URL } = process.env
  if (!WC_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return NextResponse.json(
      { error: "Servidor sin credenciales WC" },
      { status: 500 },
    )
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const result = validate(json)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  const { items, billing, paymentMethod } = result.data
  const isMp = paymentMethod === "mp"

  const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")
  const paymentTitle = isMp ? "Mercado Pago" : "Transferencia bancaria"
  const orderPayload = {
    payment_method: isMp ? "mercadopago" : "bacs",
    payment_method_title: paymentTitle,
    set_paid: false,
    status: isMp ? "pending" : "on-hold",
    billing: {
      first_name: billing.firstName,
      last_name: billing.lastName,
      email: billing.email,
      phone: billing.phone,
      address_1: billing.address1,
      address_2: billing.address2 ?? "",
      city: billing.city,
      state: billing.state,
      postcode: billing.postcode,
      country: "AR",
    },
    shipping: {
      first_name: billing.firstName,
      last_name: billing.lastName,
      address_1: billing.address1,
      address_2: billing.address2 ?? "",
      city: billing.city,
      state: billing.state,
      postcode: billing.postcode,
      country: "AR",
    },
    line_items: items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    })),
    customer_note: billing.notes ?? "",
  }

  const res = await fetch(`${WC_URL.replace(/\/$/, "")}/wp-json/wc/v3/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(orderPayload),
    cache: "no-store",
  })

  const text = await res.text()
  let payload: unknown
  try {
    payload = JSON.parse(text)
  } catch {
    payload = { raw: text }
  }

  if (!res.ok) {
    const msg =
      (payload as { message?: string }).message ||
      `Error creando la orden (${res.status})`
    return NextResponse.json({ error: msg }, { status: res.status })
  }

  const order = payload as WCOrderResponse

  // Stock reservado → invalidamos cache del catalogo
  revalidateTag(TAG_PRODUCTS, "default")

  if (!isMp) {
    return NextResponse.json({
      id: order.id,
      number: order.number,
      total: order.total,
      status: order.status,
      paymentMethod: "bacs",
    })
  }

  // MP: creamos preference usando los line_items tal como los guardo WC
  // (con nombres y precios ya resueltos, para evitar mismatch).
  try {
    const appUrl = NEXT_PUBLIC_APP_URL || new URL(req.url).origin
    const mpItems = order.line_items.map((li) => ({
      id: String(li.product_id),
      title: li.name,
      quantity: li.quantity,
      unit_price: Number(li.price),
      picture_url: li.image?.src ?? null,
    }))
    const preference = await createPreference({
      orderId: order.id,
      items: mpItems,
      payer: {
        name: billing.firstName,
        surname: billing.lastName,
        email: billing.email,
        phone: billing.phone,
      },
      appUrl,
    })

    return NextResponse.json({
      id: order.id,
      number: order.number,
      total: order.total,
      status: order.status,
      paymentMethod: "mp",
      preferenceId: preference.id,
    })
  } catch (err) {
    // Si falla MP, la orden WC ya existe — la dejamos pending y mostramos error
    const msg = err instanceof Error ? err.message : "Error creando pago MP"
    return NextResponse.json(
      {
        error: `La orden se creó pero no pudimos iniciar el pago: ${msg}`,
        orderId: order.id,
      },
      { status: 502 },
    )
  }
}
