import { NextResponse } from "next/server"

/**
 * POST /api/cart/validate
 * Body: { items: [{productId, quantity}] }
 *
 * Para cada item consulta el estado real del producto en WC y devuelve:
 *   { productId, exists, stock, price, name, slug, image, salePrice? }
 *
 * Lo usa CheckoutForm al montarse para:
 * - Eliminar del carrito productos borrados en WC
 * - Clampear cantidades si el stock bajó
 * - Actualizar precios si cambiaron
 * - Bloquear submit si algo sigue inválido
 */

type IncomingItem = { productId: number; quantity: number }

type WCProductLite = {
  id: number
  name: string
  slug: string
  status: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  stock_quantity: number | null
  stock_status: "instock" | "outofstock" | "onbackorder"
  images: Array<{ src: string }>
}

type ValidatedItem = {
  productId: number
  exists: boolean
  stock: number
  price: number
  name: string | null
  slug: string | null
  image: string | null
}

export async function POST(req: Request) {
  const { WC_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env
  if (!WC_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return NextResponse.json({ error: "Servidor sin credenciales WC" }, { status: 500 })
  }

  let parsed: { items?: IncomingItem[] }
  try {
    parsed = (await req.json()) as { items?: IncomingItem[] }
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const items: IncomingItem[] = Array.isArray(parsed.items) ? parsed.items : []
  if (items.length === 0) {
    return NextResponse.json({ items: [] })
  }

  const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")
  const ids = items.map((i) => i.productId).filter((n) => Number.isFinite(n))
  if (ids.length === 0) {
    return NextResponse.json({ items: [] })
  }

  // WC /products soporta ?include=1,2,3 — fetch batch una sola request.
  const url = `${WC_URL.replace(/\/$/, "")}/wp-json/wc/v3/products?per_page=${ids.length}&include=${ids.join(",")}&status=any`
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    return NextResponse.json(
      { error: `WC respondió ${res.status}: ${text.slice(0, 200)}` },
      { status: 500 },
    )
  }

  const raw = (await res.json()) as WCProductLite[]
  const byId = new Map(raw.map((p) => [p.id, p]))

  const out: ValidatedItem[] = items.map((item) => {
    const wc = byId.get(item.productId)
    if (!wc) {
      return {
        productId: item.productId,
        exists: false,
        stock: 0,
        price: 0,
        name: null,
        slug: null,
        image: null,
      }
    }
    const available = wc.status === "publish" && wc.stock_status !== "outofstock"
    const stock = available ? wc.stock_quantity ?? 0 : 0
    const currentPrice =
      Number.parseFloat(wc.price || "") ||
      Number.parseFloat(wc.sale_price || "") ||
      Number.parseFloat(wc.regular_price || "") ||
      0
    return {
      productId: wc.id,
      exists: true,
      stock,
      price: currentPrice,
      name: wc.name,
      slug: wc.slug,
      image: wc.images?.[0]?.src ?? null,
    }
  })

  return NextResponse.json({ items: out })
}
