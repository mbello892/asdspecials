#!/usr/bin/env node
/**
 * Seeds the InstaWP WooCommerce demo with categories + products similar
 * to asdspecials (plants, aluminum pots, soy candles, mesas ratonas).
 *
 * Usage: node scripts/seed-wc-demo.mjs
 * Reads WC_URL / WC_CONSUMER_KEY / WC_CONSUMER_SECRET from .env.local.
 * Idempotent: skips existing categories/products matching by slug.
 */

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, "..", ".env.local")
const envText = readFileSync(envPath, "utf8")
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "")
}

const { WC_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET, WP_USER, WP_APP_PASSWORD } = process.env
if (!WC_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  console.error("Missing WC_URL / WC_CONSUMER_KEY / WC_CONSUMER_SECRET in .env.local")
  process.exit(1)
}
if (!WP_USER || !WP_APP_PASSWORD) {
  console.error("Missing WP_USER / WP_APP_PASSWORD in .env.local (needed for media upload)")
  process.exit(1)
}

const AUTH = "Basic " + Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")
const WP_AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64")
const BASE = WC_URL.replace(/\/$/, "")
const API = `${BASE}/wp-json/wc/v3`
const WP_API = `${BASE}/wp-json/wp/v2`

async function wc(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: AUTH,
      ...(init.headers ?? {}),
    },
  })
  const text = await res.text()
  let body
  try {
    body = JSON.parse(text)
  } catch {
    body = text
  }
  if (!res.ok) {
    throw new Error(`WC ${init.method ?? "GET"} ${path} → ${res.status}: ${text}`)
  }
  return body
}

async function uploadImage(url, filename) {
  const imgRes = await fetch(url)
  if (!imgRes.ok) throw new Error(`fetch image ${url} → ${imgRes.status}`)
  const buf = Buffer.from(await imgRes.arrayBuffer())
  const res = await fetch(`${WP_API}/media`, {
    method: "POST",
    headers: {
      Authorization: WP_AUTH,
      "Content-Type": "image/jpeg",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
    body: buf,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`media upload ${filename} → ${res.status}: ${text}`)
  return JSON.parse(text)
}

async function findMediaBySlug(slug) {
  const res = await fetch(`${WP_API}/media?slug=${encodeURIComponent(slug)}`, {
    headers: { Authorization: WP_AUTH },
  })
  if (!res.ok) return null
  const arr = await res.json()
  return Array.isArray(arr) && arr.length > 0 ? arr[0] : null
}

const CATEGORIES = [
  {
    slug: "plantas",
    name: "Plantas",
    description: "Plantas de interior seleccionadas a mano. Stock limitado, una unidad por planta.",
  },
  {
    slug: "macetas-aluminio",
    name: "Macetas de aluminio",
    description: "Macetas de aluminio cepillado, hechas para durar. Varios tamaños.",
  },
  {
    slug: "velas-soja",
    name: "Velas de soja",
    description: "Velas artesanales de cera de soja, aromas naturales, 100% vegetales.",
  },
  {
    slug: "mesas-ratonas",
    name: "Mesas ratonas",
    description: "Mesas ratonas de diseño minimalista. Próximamente disponibles.",
  },
]

const PRODUCTS = [
  {
    slug: "monstera-deliciosa",
    name: "Monstera Deliciosa",
    categorySlug: "plantas",
    regular_price: "18500",
    sale_price: "16900",
    stock_quantity: 1,
    short_description: "Monstera deliciosa adulta, hojas grandes y perfectas. Única unidad.",
    description:
      "Planta Monstera Deliciosa adulta, cuidada en invernadero durante meses. Hojas perfectas sin manchas, ideal para livings luminosos. Unica unidad disponible.",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=1200&q=80",
  },
  {
    slug: "calathea-orbifolia",
    name: "Calathea Orbifolia",
    categorySlug: "plantas",
    regular_price: "14200",
    stock_quantity: 1,
    short_description: "Calathea orbifolia de hojas amplias con vetas plateadas.",
    description:
      "Calathea Orbifolia en maceta de vivero. Hojas grandes, redondas, con vetas plateadas espectaculares. Requiere alta humedad, ideal para banos luminosos.",
    image: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=1200&q=80",
  },
  {
    slug: "pothos-dorado",
    name: "Pothos Dorado",
    categorySlug: "plantas",
    regular_price: "6800",
    stock_quantity: 3,
    short_description: "Pothos dorado, resistente y de rapido crecimiento.",
    description:
      "Pothos Dorado listo para colgar. Muy resistente, tolera baja luz. Ideal para principiantes.",
    image: "https://loremflickr.com/1200/1200/pothos,plant?lock=1",
  },
  {
    slug: "ficus-lyrata",
    name: "Ficus Lyrata",
    categorySlug: "plantas",
    regular_price: "22000",
    stock_quantity: 1,
    short_description: "Ficus Lyrata de 1m, forma impecable.",
    description:
      "Ficus Lyrata adulto, tronco unico, copa bien formada. Pieza central para ambientes amplios.",
    image: "https://loremflickr.com/1200/1200/ficus,plant?lock=2",
  },
  {
    slug: "sansevieria-trifasciata",
    name: "Sansevieria Trifasciata",
    categorySlug: "plantas",
    regular_price: "9500",
    stock_quantity: 0,
    short_description: "Sansevieria (lengua de suegra), super resistente.",
    description:
      "Sansevieria Trifasciata, tambien llamada lengua de suegra. Extremadamente resistente, perfecta si viajas seguido.",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=1200&q=80",
  },
  {
    slug: "maceta-alu-18",
    name: "Maceta aluminio 18cm",
    categorySlug: "macetas-aluminio",
    regular_price: "8900",
    stock_quantity: 12,
    short_description: "Maceta de aluminio cepillado, diametro 18cm.",
    description:
      "Maceta de aluminio cepillado, diametro 18cm, altura 16cm. Incluye plato interior. Hecha para durar.",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80",
  },
  {
    slug: "maceta-alu-22",
    name: "Maceta aluminio 22cm",
    categorySlug: "macetas-aluminio",
    regular_price: "11500",
    sale_price: "9900",
    stock_quantity: 8,
    short_description: "Maceta de aluminio cepillado, diametro 22cm.",
    description:
      "Maceta de aluminio cepillado, diametro 22cm, altura 20cm. Incluye plato. Tamano medio, ideal para plantas jovenes.",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=1200&q=80",
  },
  {
    slug: "maceta-alu-26",
    name: "Maceta aluminio 26cm",
    categorySlug: "macetas-aluminio",
    regular_price: "14900",
    stock_quantity: 5,
    short_description: "Maceta de aluminio cepillado, diametro 26cm.",
    description:
      "Maceta de aluminio cepillado, diametro 26cm, altura 23cm. Incluye plato grande. Para plantas de tamano medio/grande.",
    image: "https://images.unsplash.com/photo-1509223197845-458d87318791?w=1200&q=80",
  },
  {
    slug: "vela-soja-lavanda",
    name: "Vela de soja — Lavanda",
    categorySlug: "velas-soja",
    regular_price: "5400",
    stock_quantity: 15,
    short_description: "Vela 100% cera de soja con aroma a lavanda.",
    description:
      "Vela artesanal de cera de soja pura, aroma lavanda. Aprox 40 horas de duracion. Mecha de algodon.",
    image: "https://loremflickr.com/1200/1200/candle,lavender?lock=3",
  },
  {
    slug: "vela-soja-eucalipto",
    name: "Vela de soja — Eucalipto",
    categorySlug: "velas-soja",
    regular_price: "5400",
    sale_price: "4800",
    stock_quantity: 10,
    short_description: "Vela 100% cera de soja con aroma a eucalipto.",
    description:
      "Vela artesanal de cera de soja pura, aroma eucalipto. Aprox 40 horas. Mecha de algodon.",
    image: "https://loremflickr.com/1200/1200/candle,eucalyptus?lock=4",
  },
  {
    slug: "mesa-ratona-nogal",
    name: "Mesa ratona Nogal",
    categorySlug: "mesas-ratonas",
    regular_price: "95000",
    stock_quantity: 0,
    status: "draft",
    short_description: "Mesa ratona en madera de nogal — proximamente.",
    description: "Mesa ratona rectangular de nogal macizo, patas de acero. Proximamente disponible.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
  },
  {
    slug: "mesa-ratona-roble",
    name: "Mesa ratona Roble",
    categorySlug: "mesas-ratonas",
    regular_price: "88000",
    stock_quantity: 0,
    status: "draft",
    short_description: "Mesa ratona circular en roble — proximamente.",
    description: "Mesa ratona circular de roble americano, base conica. Proximamente disponible.",
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=1200&q=80",
  },
]

async function ensureCategory(cat) {
  const existing = await wc(`/products/categories?slug=${encodeURIComponent(cat.slug)}`)
  if (Array.isArray(existing) && existing.length > 0) {
    console.log(`  ↺ category "${cat.slug}" already exists (id=${existing[0].id})`)
    return existing[0]
  }
  const created = await wc("/products/categories", {
    method: "POST",
    body: JSON.stringify({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
    }),
  })
  console.log(`  + category "${cat.slug}" created (id=${created.id})`)
  return created
}

async function ensureProductImage(product) {
  if (!product.image) return null
  const slug = `${product.slug}-img`
  const existing = await findMediaBySlug(slug)
  if (existing) {
    console.log(`    ↺ image "${slug}" already uploaded (id=${existing.id})`)
    return existing.id
  }
  try {
    const media = await uploadImage(product.image, `${product.slug}.jpg`)
    console.log(`    + image "${slug}" uploaded (id=${media.id})`)
    return media.id
  } catch (err) {
    console.warn(`    ! image "${slug}" failed: ${err.message.split("\n")[0]} — continuing without image`)
    return null
  }
}

async function ensureProduct(product, categoryIdBySlug) {
  const existing = await wc(`/products?slug=${encodeURIComponent(product.slug)}`)
  if (Array.isArray(existing) && existing.length > 0) {
    console.log(`  ↺ product "${product.slug}" already exists (id=${existing[0].id})`)
    return existing[0]
  }
  const imageId = await ensureProductImage(product)
  const body = {
    name: product.name,
    slug: product.slug,
    type: "simple",
    status: product.status ?? "publish",
    regular_price: product.regular_price,
    ...(product.sale_price ? { sale_price: product.sale_price } : {}),
    description: product.description,
    short_description: product.short_description,
    manage_stock: true,
    stock_quantity: product.stock_quantity,
    stock_status: product.stock_quantity > 0 ? "instock" : "outofstock",
    categories: [{ id: categoryIdBySlug[product.categorySlug] }],
    images: imageId ? [{ id: imageId, alt: product.name }] : [],
  }
  const created = await wc("/products", { method: "POST", body: JSON.stringify(body) })
  console.log(`  + product "${product.slug}" created (id=${created.id})`)
  return created
}

async function main() {
  console.log(`Seeding ${WC_URL}`)
  console.log("Categories:")
  const catIdBySlug = {}
  for (const cat of CATEGORIES) {
    const created = await ensureCategory(cat)
    catIdBySlug[cat.slug] = created.id
  }
  console.log("Products:")
  for (const product of PRODUCTS) {
    await ensureProduct(product, catIdBySlug)
  }
  console.log("✓ Seed complete.")
}

main().catch((err) => {
  console.error("✗ Seed failed:", err.message)
  process.exit(1)
})
