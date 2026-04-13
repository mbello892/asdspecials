import { HomeLive } from "@/components/sections/HomeLive"
import {
  getCategories,
  getFeaturedProduct,
  getProducts,
  getSiteContent,
} from "@/lib/payload"

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [initialContent, categories, featuredProduct, allProducts] = await Promise.all([
    getSiteContent(),
    getCategories(),
    getFeaturedProduct(),
    getProducts(),
  ])

  const productCounts: Record<string, number> = {}
  for (const product of allProducts) {
    const cat = product.category
    const slug = typeof cat === "object" ? cat.slug : null
    if (slug) productCounts[slug] = (productCounts[slug] ?? 0) + 1
  }

  return (
    <HomeLive
      initialContent={initialContent}
      categories={categories}
      featuredProduct={featuredProduct}
      productCounts={productCounts}
      serverURL={SITE_URL}
    />
  )
}
