"use client"

import { useEffect, useState } from "react"
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
}: {
  initialContent: SiteContent
  categories: Category[]
  featuredProduct: Product | null
  productCounts: Record<string, number>
}) {
  // Origen se setea DESPUÉS del mount para evitar hydration mismatch
  // (server render no tiene window, client render sí → distinto HTML).
  // Durante el primer paint ambos lados usan "" y recién al hidratar
  // useEffect lo actualiza con el origen real, re-registrando el
  // listener de postMessage del live preview.
  const [origin, setOrigin] = useState<string>("")
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const { data } = useLivePreview<SiteContent>({
    initialData: initialContent,
    serverURL: origin,
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
