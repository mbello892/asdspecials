import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { TAG_CATEGORIES, TAG_PRODUCTS } from "@/lib/woocommerce"

/**
 * POST /api/wc/revalidate
 *
 * Webhook endpoint para que WC nos avise cuando algo cambia
 * (producto editado, orden cancelada, stock ajustado, etc).
 * Al recibir un hit válido, invalidamos los tags del cache de
 * fetch para que el catálogo/producto se refresquen en la próxima
 * request sin esperar el TTL de 30s.
 *
 * Auth: requiere que el header X-WC-Webhook-Secret o el query param
 * ?secret= coincidan con WC_WEBHOOK_SECRET (configurable via env var).
 * En dev/prod configurar:
 *   1. vercel env add WC_WEBHOOK_SECRET
 *   2. wp-admin sandbox → WC → Settings → Advanced → Webhooks → Add
 *      Topic: "Order updated" (y "Product updated")
 *      Delivery URL: https://asdspecials.vercel.app/api/wc/revalidate?secret=<el mismo>
 *      Secret: podés dejar vacío o usar el HMAC nativo de WC — hoy
 *      aceptamos ?secret= para simpleza del demo.
 */

function isAuthorized(req: Request, expected: string): boolean {
  const url = new URL(req.url)
  if (url.searchParams.get("secret") === expected) return true
  if (req.headers.get("x-wc-webhook-secret") === expected) return true
  return false
}

export async function POST(req: Request) {
  const expected = process.env.WC_WEBHOOK_SECRET
  if (!expected) {
    return NextResponse.json(
      { error: "WC_WEBHOOK_SECRET no configurado en el servidor" },
      { status: 500 },
    )
  }
  if (!isAuthorized(req, expected)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const topic = req.headers.get("x-wc-webhook-topic") ?? "unknown"

  // Invalidamos ambos tags por simplicidad. La mayoría de topics de WC
  // (product.updated, product.created, product.deleted, order.*) afectan
  // al catálogo, y categorías es muy barato.
  revalidateTag(TAG_PRODUCTS, "default")
  revalidateTag(TAG_CATEGORIES, "default")

  return NextResponse.json({ ok: true, topic })
}

// Algunos hooks de test de WC mandan GET primero — responder OK para no
// bloquear el registro del webhook en wp-admin.
export async function GET() {
  return NextResponse.json({ ok: true, method: "GET" })
}
