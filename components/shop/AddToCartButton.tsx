"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Check, Minus, Plus } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import type { Product } from "@/types/shop"

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)
  const hydrated = useCartStore((s) => s.hydrated)

  const [qty, setQty] = useState(1)
  const soldOut = product.stock === 0

  // Client render guard: mientras Zustand no hidrató, hacemos render
  // conservador (como si no hubiera items en el carrito) para evitar
  // mismatch de hydration.
  const inCart = hydrated
    ? items.find((i) => i.productId === product.id) ?? null
    : null

  const max = product.stock || 1
  const canAdd = !soldOut && (inCart ? inCart.quantity + qty <= max : qty <= max)

  function handleAdd() {
    if (!canAdd) return
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0]?.image?.url ?? null,
        stock: product.stock,
      },
      qty,
    )
    setQty(1)
  }

  if (soldOut) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-ink/40 px-6 py-3.5 text-sm font-medium text-bg"
      >
        Agotado
      </button>
    )
  }

  return (
    <div className="flex flex-col items-end gap-3">
      {/* Qty stepper + boton */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Disminuir"
            className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-bg-deep disabled:cursor-not-allowed disabled:text-ink-dim"
          >
            <Minus className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
          <span className="min-w-6 text-center text-sm font-medium tabular-nums text-ink">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(max - (inCart?.quantity ?? 0), q + 1))}
            disabled={qty + (inCart?.quantity ?? 0) >= max}
            aria-label="Aumentar"
            className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-bg-deep disabled:cursor-not-allowed disabled:text-ink-dim"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-bg transition-transform hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {inCart ? "Sumar al carrito" : "Agregar al carrito"}
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* Estado "en el carrito" */}
      {inCart && (
        <Link
          href="/carrito"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-moss transition-colors hover:text-ink"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2} />
          En el carrito ({inCart.quantity}) — ver
        </Link>
      )}
    </div>
  )
}
