import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { TAG_PRODUCTS } from "@/lib/woocommerce"

/**
 * POST /api/orders/create
 * Body: { items: [{productId, quantity}], billing: {...}, paymentMethod: "bacs" }
 *
 * Creates a WooCommerce order server-side using the admin REST API
 * with consumer key/secret (kept in Vercel env vars, never exposed).
 * For S2 we only support "bacs" (bank transfer) → order status = on-hold.
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

type CreateOrderBody = {
  items: IncomingItem[]
  billing: IncomingBilling
  paymentMethod: "bacs"
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

  if (b.paymentMethod !== "bacs") {
    return { ok: false, error: "Método de pago no soportado (por ahora)" }
  }

  return { ok: true, data: b as CreateOrderBody }
}

export async function POST(req: Request) {
  const { WC_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env
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

  const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")
  const paymentTitle =
    paymentMethod === "bacs" ? "Transferencia bancaria" : paymentMethod
  const orderPayload = {
    payment_method: paymentMethod,
    payment_method_title: paymentTitle,
    set_paid: false,
    status: "on-hold",
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

  const order = payload as { id: number; number: string; total: string; status: string }

  // Al crear una orden WC reserva stock (cambia stock_quantity de los productos).
  // Invalidamos el cache del catalogo para que la proxima pagina muestre el stock
  // actualizado en vez del cacheado de hasta 30s atras.
  revalidateTag(TAG_PRODUCTS)

  return NextResponse.json({
    id: order.id,
    number: order.number,
    total: order.total,
    status: order.status,
  })
}
