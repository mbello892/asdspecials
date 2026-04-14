"use client"

import { useState } from "react"
import { ArrowUpRight, Check } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import type { Product } from "@/types/shop"

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const [justAdded, setJustAdded] = useState(false)
  const soldOut = product.stock === 0

  const handleClick = () => {
    if (soldOut) return
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0]?.image?.url ?? null,
      stock: product.stock,
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={soldOut}
      className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-bg transition-transform hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {soldOut ? (
        "Agotado"
      ) : justAdded ? (
        <>
          Agregado
          <Check className="h-4 w-4" strokeWidth={2} />
        </>
      ) : (
        <>
          Agregar al carrito
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.8}
          />
        </>
      )}
    </button>
  )
}
