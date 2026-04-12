import { Navbar } from "@/components/sections/Navbar"
import { Cart } from "@/components/sections/Cart"
import { Footer } from "@/components/sections/Footer"

export const metadata = {
  title: "Tu carrito — asdspecials",
}

export default function CarritoPage() {
  return (
    <main className="relative">
      <Navbar />
      <Cart />
      <Footer />
    </main>
  )
}
