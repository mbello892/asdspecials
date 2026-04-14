import "server-only"
import type { Category, Product, ProductStatus } from "@/types/shop"

/**
 * WooCommerce REST client.
 * Reads credentials from env vars (see .env.local / Vercel):
 *   WC_URL                — base URL of the WP site (no trailing slash)
 *   WC_CONSUMER_KEY       — ck_...
 *   WC_CONSUMER_SECRET    — cs_...
 *
 * Use only from Server Components / server actions / route handlers.
 */

const WC_URL = process.env.WC_URL
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET

function assertEnv() {
  if (!WC_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    throw new Error(
      "WooCommerce env vars missing. Need WC_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET.",
    )
  }
}

const REVALIDATE_SECONDS = 60
const TAG_PRODUCTS = "wc:products"
const TAG_CATEGORIES = "wc:categories"

async function wcFetch<T>(path: string, tags: string[]): Promise<T> {
  assertEnv()
  const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")
  const url = `${WC_URL!.replace(/\/$/, "")}/wp-json/wc/v3${path}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
    next: { revalidate: REVALIDATE_SECONDS, tags },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`WC GET ${path} → ${res.status}: ${body.slice(0, 200)}`)
  }
  return res.json() as Promise<T>
}

// ——— raw WC types (only the fields we actually read)

type WCImage = {
  id: number
  src: string
  alt?: string
}

type WCCategoryRef = {
  id: number
  name: string
  slug: string
}

type WCCategoryFull = {
  id: number
  name: string
  slug: string
  description?: string
  image?: { src: string; alt?: string } | null
}

type WCAttribute = {
  id: number
  name: string
  slug?: string
  options: string[]
}

type WCProductRaw = {
  id: number
  name: string
  slug: string
  status: "publish" | "draft" | "pending" | "private" | "trash"
  featured: boolean
  description: string
  short_description: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  stock_quantity: number | null
  stock_status: "instock" | "outofstock" | "onbackorder"
  categories: WCCategoryRef[]
  images: WCImage[]
  attributes: WCAttribute[]
}

// ——— adapters

function stripHtml(html: string | null | undefined): string | null {
  if (!html) return null
  const text = html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim()
  return text || null
}

function mapStatus(wcStatus: WCProductRaw["status"]): ProductStatus {
  if (wcStatus === "publish") return "active"
  if (wcStatus === "private") return "hidden"
  return "draft"
}

function toCategory(wc: WCCategoryFull | WCCategoryRef): Category {
  const full = wc as WCCategoryFull
  return {
    id: wc.id,
    name: wc.name,
    slug: wc.slug,
    description: full.description ? stripHtml(full.description) : null,
    image: full.image?.src ? { url: full.image.src, alt: full.image.alt ?? null } : null,
  }
}

function attrValue(attrs: WCAttribute[], ...names: string[]): string | null {
  for (const a of attrs ?? []) {
    const n = (a.name ?? "").toLowerCase()
    const s = (a.slug ?? "").toLowerCase()
    if (names.some((needle) => n === needle || s === needle)) {
      return a.options?.[0] ?? null
    }
  }
  return null
}

function numAttr(attrs: WCAttribute[], ...names: string[]): number | null {
  const v = attrValue(attrs, ...names)
  if (!v) return null
  const n = Number(v.replace(/[^\d.]/g, ""))
  return Number.isFinite(n) ? n : null
}

function adaptProduct(wc: WCProductRaw): Product {
  const sale = Number.parseFloat(wc.sale_price || "") || 0
  const regular = Number.parseFloat(wc.regular_price || "") || 0
  const current = Number.parseFloat(wc.price || "") || regular || sale || 0
  const hasSale = wc.on_sale && sale > 0 && regular > sale
  const categoryRef = wc.categories?.[0]
  const category = categoryRef ? toCategory(categoryRef) : null

  const plantCare = {
    light: attrValue(wc.attributes, "luz", "light"),
    water: attrValue(wc.attributes, "riego", "water"),
    size: attrValue(wc.attributes, "tamano", "tamaño", "size"),
  }
  const potSpecs = {
    material: attrValue(wc.attributes, "material"),
    diameter: numAttr(wc.attributes, "diametro", "diámetro", "diameter"),
    height: numAttr(wc.attributes, "altura", "height"),
    withStand: null,
  }
  const hasPlantCare = Boolean(plantCare.light || plantCare.water || plantCare.size)
  const hasPotSpecs = Boolean(potSpecs.material || potSpecs.diameter || potSpecs.height)

  return {
    id: wc.id,
    name: wc.name,
    slug: wc.slug,
    shortDescription: stripHtml(wc.short_description),
    description: wc.description || null,
    price: current,
    compareAtPrice: hasSale ? regular : null,
    stock: wc.stock_quantity ?? 0,
    status: mapStatus(wc.status),
    featured: Boolean(wc.featured),
    category,
    images: (wc.images ?? []).map((img) => ({
      id: img.id,
      image: { url: img.src, alt: img.alt ?? null },
    })),
    plantCare: hasPlantCare ? plantCare : null,
    potSpecs: hasPotSpecs ? potSpecs : null,
  }
}

// ——— public API

export async function getCategories(): Promise<Category[]> {
  const raw = await wcFetch<WCCategoryFull[]>(
    "/products/categories?per_page=100&hide_empty=false&orderby=name&order=asc",
    [TAG_CATEGORIES],
  )
  return raw
    .filter((c) => c.slug !== "uncategorized")
    .map((c) => toCategory(c))
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const raw = await wcFetch<WCCategoryFull[]>(
    `/products/categories?slug=${encodeURIComponent(slug)}`,
    [TAG_CATEGORIES, `wc:category:${slug}`],
  )
  return raw[0] ? toCategory(raw[0]) : null
}

export async function getProducts(opts?: { categorySlug?: string }): Promise<Product[]> {
  let path = "/products?per_page=100&status=publish&orderby=date&order=desc"
  if (opts?.categorySlug) {
    const cat = await getCategoryBySlug(opts.categorySlug)
    if (!cat) return []
    path += `&category=${cat.id}`
  }
  const raw = await wcFetch<WCProductRaw[]>(path, [TAG_PRODUCTS])
  return raw.map(adaptProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const raw = await wcFetch<WCProductRaw[]>(
    `/products?slug=${encodeURIComponent(slug)}&status=any`,
    [TAG_PRODUCTS, `wc:product:${slug}`],
  )
  const product = raw[0]
  if (!product) return null
  return adaptProduct(product)
}

export async function getFeaturedProduct(): Promise<Product | null> {
  const raw = await wcFetch<WCProductRaw[]>(
    "/products?featured=true&status=publish&per_page=1",
    [TAG_PRODUCTS, "wc:products:featured"],
  )
  return raw[0] ? adaptProduct(raw[0]) : null
}
