"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Check, Minus, Plus } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import type { Product } from "@/types/shop"

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const items = useCartStore((s) => s.items)
  const hydrated = useCartStore((s) => s.hydrated)

  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const soldOut = product.stock === 0

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
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
  }

  if (soldOut) {
    return (
      <button
        type="button"
        disabled
        className="h-14 w-full cursor-not-allowed rounded-full border border-line text-[11px] font-medium uppercase tracking-[0.22em] text-ink-dim"
      >
        Agotado
      </button>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quantity — labeled row, minimal icons */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.24em] text-ink-dim">
          Cantidad
        </span>
        <div className="inline-flex items-center gap-6">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Disminuir"
            className="text-ink-soft transition-colors hover:text-ink disabled:cursor-not-allowed disabled:text-ink-dim/50"
          >
            <Minus className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <span className="min-w-[2ch] text-center font-display text-base leading-none tabular-nums text-ink">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(max - (inCart?.quantity ?? 0), q + 1))}
            disabled={qty + (inCart?.quantity ?? 0) >= max}
            aria-label="Aumentar"
            className="text-ink-soft transition-colors hover:text-ink disabled:cursor-not-allowed disabled:text-ink-dim/50"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Full-width CTA */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={!canAdd || justAdded}
        aria-live="polite"
        className={`group flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full text-[11px] font-medium uppercase tracking-[0.22em] transition-all duration-300 disabled:cursor-not-allowed ${
          justAdded
            ? "bg-moss text-bg"
            : "bg-ink text-bg hover:-translate-y-[1px] disabled:opacity-40"
        }`}
      >
        <span
          key={justAdded ? "done" : "idle"}
          className="inline-flex items-center gap-3 animate-[fade-in_220ms_ease-out]"
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2} />
              Añadido
            </>
          ) : (
            <>
              {inCart ? "Sumar al carrito" : "Agregar al carrito"}
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
            </>
          )}
        </span>
      </button>

      {/* Cart status — single ephemeral line */}
      {inCart && (
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-ink-dim">
          <Check className="h-3 w-3 text-moss" strokeWidth={2.2} />
          <span>En el carrito · {inCart.quantity}</span>
          <span className="text-line">/</span>
          <Link href="/carrito" className="transition-colors hover:text-ink">
            Ver carrito
          </Link>
          <span className="text-line">/</span>
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            className="transition-colors hover:text-ink"
          >
            Quitar
          </button>
        </div>
      )}
    </div>
  )
}
