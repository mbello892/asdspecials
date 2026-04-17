"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCartStore, selectCount } from "@/lib/cart-store"

export function CartNavButton() {
  const count = useCartStore(selectCount)
  const hydrated = useCartStore((s) => s.hydrated)
  const lastAddedAt = useCartStore((s) => s.lastAddedAt)
  const show = hydrated && count > 0

  const [bump, setBump] = useState(false)

  useEffect(() => {
    if (!lastAddedAt) return
    setBump(true)
    const t = setTimeout(() => setBump(false), 650)
    return () => clearTimeout(t)
  }, [lastAddedAt])

  return (
    <Link
      href="/carrito"
      aria-label={count > 0 ? `Carrito — ${count} productos` : "Carrito"}
      className="relative inline-flex items-center justify-center rounded-full p-2 text-ink-soft transition-colors hover:text-ink"
    >
      <span className={`relative inline-flex ${bump ? "cart-bump" : ""}`}>
        <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
        {bump && <span className="cart-ring pointer-events-none absolute inset-0 rounded-full" />}
      </span>
      {show && (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[10px] font-semibold leading-none text-bg">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  )
}
