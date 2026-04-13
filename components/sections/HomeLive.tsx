"use client"

import { useLivePreview } from "@payloadcms/live-preview-react"
import type { SiteContent } from "@payload-types"

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
  serverURL,
}: {
  initialContent: SiteContent
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
      <Collections />
      <FeaturedProduct />
      <Story pillars={data.pillars} />
      <Newsletter />
      <Footer data={data.footer} />
    </main>
  )
}
