"use client"

import { useLivePreview } from "@payloadcms/live-preview-react"
import type { Category, Product, SiteContent } from "@payload-types"

import { Navbar } from "./Navbar"
import { Hero } from "./Hero"
import { Marquee } from "./Marquee"
import { Collections } from "./Collections"
import { FeaturedProduct } from "./FeaturedProduct"
import { Story } from "./Story"
import { Newsletter } from "./Newsletter"
import { Footer } from "./Footer"

export function HomeLive({
  initialContent,
  categories,
  featuredProduct,
  productCounts,
  serverURL,
}: {
  initialContent: SiteContent
  categories: Category[]
  featuredProduct: Product | null
  productCounts: Record<string, number>
  serverURL: string
}) {
  const { data } = useLivePreview<SiteContent>({
    initialData: initialContent,
    serverURL,
    depth: 2,
  })

  return (
    <main className="relative">
      <Navbar />
      <Hero data={data.hero} />
      <Marquee items={data.marquee} />
      <Collections categories={categories} productCounts={productCounts} />
      <FeaturedProduct product={featuredProduct} />
      <Story pillars={data.pillars} />
      <Newsletter />
      <Footer data={data.footer} />
    </main>
  )
}
