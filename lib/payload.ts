import "server-only"
import { getPayload, type Where } from "payload"
import config from "@payload-config"
import type { Category, Product, SiteContent } from "@payload-types"

/**
 * Server-side access to Payload via local API.
 * Only import from Server Components, API routes, or server actions.
 * Marked `server-only` so any accidental client import fails loudly.
 */

async function payload() {
  return getPayload({ config })
}

export async function getSiteContent(): Promise<SiteContent> {
  const p = await payload()
  return p.findGlobal({ slug: "site-content", depth: 2 })
}

export async function getCategories(): Promise<Category[]> {
  const p = await payload()
  const { docs } = await p.find({
    collection: "categories",
    limit: 100,
    depth: 1,
    sort: "name",
  })
  return docs
}

export async function getFeaturedProduct(): Promise<Product | null> {
  const p = await payload()
  const { docs } = await p.find({
    collection: "products",
    where: {
      and: [{ featured: { equals: true } }, { status: { equals: "active" } }],
    },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

export async function getProducts(opts?: {
  categorySlug?: string
}): Promise<Product[]> {
  const p = await payload()
  const where: Where = {
    status: { equals: "active" },
  }
  if (opts?.categorySlug) {
    const { docs: cats } = await p.find({
      collection: "categories",
      where: { slug: { equals: opts.categorySlug } },
      limit: 1,
    })
    if (cats[0]) {
      where.category = { equals: cats[0].id }
    }
  }
  const { docs } = await p.find({
    collection: "products",
    where,
    depth: 2,
    limit: 200,
    sort: "-createdAt",
  })
  return docs
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = await payload()
  const { docs } = await p.find({
    collection: "products",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

