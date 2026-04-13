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

// Usamos window.location.origin para que el merge del live preview
// acepte mensajes del admin sin importar desde qué host se abra
// (localhost, LAN IP, dominio real de producción).
const originForPreview =
  typeof window !== "undefined" ? window.location.origin : ""

export function HomeLive({
  initialContent,
  categories,
  featuredProduct,
  productCounts,
}: {
  initialContent: SiteContent
  categories: Category[]
  featuredProduct: Product | null
  productCounts: Record<string, number>
}) {
  const { data } = useLivePreview<SiteContent>({
    initialData: initialContent,
    serverURL: originForPreview,
    depth: 2,
  })

  return (
    <main className="relative">
      <Navbar />
      <Hero data={data.hero} />
      <Marquee items={data.marquee} />
      <Collections
        categories={categories}
        productCounts={productCounts}
        introTitle={data.collectionsIntro?.title}
      />
      <FeaturedProduct product={featuredProduct} />
      <Story pillars={data.pillars} intro={data.storyIntro} />
      <Newsletter data={data.newsletter} />
      <Footer data={data.footer} />
    </main>
  )
}
