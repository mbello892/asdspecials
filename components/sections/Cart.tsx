"use client"

import Link from "next/link"
import {
  ArrowRight,
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShieldCheck,
  Truck,
  Lock,
  MessageCircle,
} from "lucide-react"
import { useCartStore, selectSubtotal, selectCount } from "@/lib/cart-store"
import { formatPrice } from "@/lib/format"

export function Cart() {
  const items = useCartStore((s) => s.items)
  const hydrated = useCartStore((s) => s.hydrated)
  const updateQty = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const subtotal = useCartStore(selectSubtotal)
  const count = useCartStore(selectCount)

  // SSR guard: antes de hydration, Zustand persist no leyó localStorage,
  // así que renderizamos un placeholder neutral para evitar mismatch.
  if (!hydrated) {
    return (
      <section className="relative px-6 pb-28 pt-36 md:pt-44">
        <div className="mx-auto max-w-6xl">
          <div className="h-16 animate-pulse rounded bg-bg-deep" />
        </div>
      </section>
    )
  }

  return (
    <section className="relative px-6 pb-28 pt-36 md:pt-44">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/catalogo"
            className="group mb-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={1.8}
            />
            Seguir comprando
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line-soft pb-8">
            <h1 className="font-display text-[clamp(2.25rem,1rem+3vw,3.75rem)] leading-[0.96] tracking-tightest text-ink">
              Tu <span className="italic text-moss">carrito</span>
            </h1>
            {items.length > 0 && (
              <p className="text-sm text-ink-soft">
                {count} {count === 1 ? "producto" : "productos"} · Subtotal{" "}
                <span className="text-ink">{formatPrice(subtotal)}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Line items */}
          <div className="lg:col-span-7">
            {items.length === 0 ? (
              <div className="rounded-[var(--r-lg)] border border-line-soft bg-surface p-10 text-center">
                <p className="font-display text-2xl text-ink">Tu carrito está vacío</p>
                <p className="mt-2 text-sm text-ink-soft">
                  Volvé al catálogo y sumá algo que te guste.
                </p>
                <Link
                  href="/catalogo"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-transform hover:-translate-y-[1px]"
                >
                  Ver catálogo
                  <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                </Link>
              </div>
            ) : (
              <ul className="space-y-7">
                {items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex gap-5 border-b border-line-soft pb-7"
                  >
                    <Link
                      href={`/producto/${item.slug}`}
                      className="h-32 w-28 shrink-0 overflow-hidden rounded-[var(--r)] bg-bg-deep"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <Link
                            href={`/producto/${item.slug}`}
                            className="block"
                          >
                            <h3 className="truncate font-display text-xl leading-tight text-ink transition-colors hover:text-moss">
                              {item.name}
                            </h3>
                          </Link>
                          {item.stock > 0 && item.stock <= 5 && (
                            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-leather">
                              Quedan {item.stock}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Quitar ${item.name}`}
                          className="rounded-full p-2 text-ink-dim transition-colors hover:bg-bg-deep hover:text-leather"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.6} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-end justify-between pt-4">
                        <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1">
                          <button
                            onClick={() => updateQty(item.productId, -1)}
                            disabled={item.quantity <= 1}
                            aria-label="Disminuir"
                            className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-bg-deep disabled:cursor-not-allowed disabled:text-ink-dim"
                          >
                            <Minus className="h-3.5 w-3.5" strokeWidth={1.8} />
                          </button>
                          <span className="min-w-6 text-center text-sm font-medium tabular-nums text-ink">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.productId, 1)}
                            disabled={item.quantity >= item.stock}
                            aria-label="Aumentar"
                            className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-bg-deep disabled:cursor-not-allowed disabled:text-ink-dim"
                          >
                            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
                          </button>
                        </div>

                        <div className="text-right">
                          {item.quantity > 1 && (
                            <p className="text-[11px] text-ink-dim">
                              {formatPrice(item.price)} c/u
                            </p>
                          )}
                          <p className="font-display text-xl text-ink">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Summary */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-[var(--r-lg)] border border-line bg-surface p-7 shadow-[0_1px_0_oklch(24%_0.008_60)]">
                <h2 className="font-display text-2xl text-ink">Resumen del pedido</h2>

                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Subtotal</dt>
                    <dd className="tabular-nums text-ink">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">
                      Envío <span className="text-ink-dim">· se calcula al pagar</span>
                    </dt>
                    <dd className="tabular-nums text-ink-dim">—</dd>
                  </div>
                </dl>

                <div className="mt-6 flex items-baseline justify-between border-t border-line-soft pt-5">
                  <span className="text-sm uppercase tracking-[0.14em] text-ink-soft">
                    Subtotal
                  </span>
                  <span className="font-display text-3xl tabular-nums text-ink">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="mt-1 text-right text-[11px] text-ink-dim">
                  Precio final en ARS · envío a coordinar
                </p>

                <Link
                  href="/checkout"
                  aria-disabled={items.length === 0}
                  className={`group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-medium text-bg transition-transform hover:-translate-y-[1px] ${
                    items.length === 0 ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  Continuar al pago
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </Link>
                <Link
                  href="/catalogo"
                  className="mt-3 block text-center text-xs text-ink-soft transition-colors hover:text-ink"
                >
                  o seguir comprando
                </Link>

                {/* Trust row */}
                <ul className="mt-8 grid grid-cols-2 gap-4 border-t border-line-soft pt-6 text-[11px] text-ink-soft">
                  <li className="flex items-start gap-2">
                    <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-moss" strokeWidth={1.8} />
                    Envíos a toda Argentina
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-moss" strokeWidth={1.8} />
                    Garantía de cuidado
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-moss" strokeWidth={1.8} />
                    Pago seguro
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border border-moss text-[8px] font-bold text-moss">
                      ✓
                    </span>
                    Sin cuenta obligatoria
                  </li>
                </ul>
              </div>

              {/* WhatsApp escape hatch */}
              <a
                href="https://wa.me/59800000000"
                className="group mt-4 flex items-center justify-between rounded-[var(--r-lg)] border border-line-soft bg-bg-deep p-5 transition-colors hover:border-line"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-moss text-bg">
                    <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">¿Dudas antes de pagar?</p>
                    <p className="text-xs text-ink-soft">Escribinos por WhatsApp</p>
                  </div>
                </div>
                <ArrowRight
                  className="h-4 w-4 text-ink-soft transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.8}
                />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
