import { HomeLive } from "@/components/sections/HomeLive"
import { getSiteContent } from "@/lib/payload"
import {
  getCategories,
  getFeaturedProduct,
  getProducts,
} from "@/lib/woocommerce"

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
    const slug = product.category?.slug
    if (slug) productCounts[slug] = (productCounts[slug] ?? 0) + 1
  }

  return (
    <HomeLive
      initialContent={initialContent}
      categories={categories}
      featuredProduct={featuredProduct}
      productCounts={productCounts}
    />
  )
}
