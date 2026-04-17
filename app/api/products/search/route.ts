import { NextResponse } from "next/server"
import { getProducts } from "@/lib/woocommerce"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") ?? "").trim()

  if (q.length < 2) {
    return NextResponse.json({ items: [] })
  }

  const products = await getProducts({ search: q })
  const items = products.slice(0, 8).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    image: p.images[0]?.image?.url ?? null,
    stock: p.stock,
  }))

  return NextResponse.json({ items })
}
