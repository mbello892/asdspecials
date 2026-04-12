import { Navbar } from "@/components/sections/Navbar"
import { Hero } from "@/components/sections/Hero"
import { Marquee } from "@/components/sections/Marquee"
import { Collections } from "@/components/sections/Collections"
import { FeaturedProduct } from "@/components/sections/FeaturedProduct"
import { Story } from "@/components/sections/Story"
import { Newsletter } from "@/components/sections/Newsletter"
import { Footer } from "@/components/sections/Footer"

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Marquee />
      <Collections />
      <FeaturedProduct />
      <Story />
      <Newsletter />
      <Footer />
    </main>
  )
}
