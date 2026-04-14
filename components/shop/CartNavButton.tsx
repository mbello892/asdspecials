"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCartStore, selectCount } from "@/lib/cart-store"

export function CartNavButton() {
  const count = useCartStore(selectCount)
  const hydrated = useCartStore((s) => s.hydrated)
  // Mostramos el badge solo despues de hidratar, si no el SSR render
  // (count=0) no coincide con el primer render del cliente.
  const show = hydrated && count > 0

  return (
    <Link
      href="/carrito"
      aria-label={count > 0 ? `Carrito — ${count} productos` : "Carrito"}
      className="relative rounded-full p-2 text-ink-soft transition-colors hover:text-ink"
    >
      <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
      {show && (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[10px] font-semibold leading-none text-bg">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  )
}
