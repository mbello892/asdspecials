"use client"

import { useEffect, useState } from "react"
import { useLivePreview } from "@payloadcms/live-preview-react"
import type { SiteContent } from "@payload-types"
import type { Category, Product } from "@/types/shop"

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
  // Origen se setea DESPUÉS del mount para evitar hydration mismatch.
  // Fallback a "*" (wildcard de postMessage) hasta que useEffect corra —
  // pasar "" rompe con "Invalid target origin" porque postMessage no
  // acepta string vacío, pero sí acepta "*" que significa "cualquier
  // origen". Una vez hidratado, useEffect lo reemplaza por el origen
  // real y el hook re-registra su listener.
  const [origin, setOrigin] = useState<string | null>(null)
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const { data } = useLivePreview<SiteContent>({
    initialData: initialContent,
    serverURL: origin ?? "*",
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
