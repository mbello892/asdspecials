"use client"

import { useState } from "react"
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
  Tag,
} from "lucide-react"

type Item = {
  id: string
  kind: string
  name: string
  variant: string
  price: number
  qty: number
  image: string
}

const INITIAL: Item[] = [
  {
    id: "monstera-variegada",
    kind: "Planta",
    name: "Monstera Deliciosa Variegada",
    variant: "Ejemplar adulto · Maceta aluminio Ø 22 cm",
    price: 8900,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80&auto=format&fit=crop",
  },
  {
    id: "ficus-lyrata",
    kind: "Planta",
    name: "Ficus Lyrata",
    variant: "Tamaño mediano · Maceta aluminio Ø 18 cm",
    price: 6500,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=500&q=80&auto=format&fit=crop",
  },
  {
    id: "vela-musgo",
    kind: "Vela",
    name: "Vela Musgo",
    variant: "Cera vegetal · 200 g",
    price: 1200,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1602874801006-e26512155ee2?w=500&q=80&auto=format&fit=crop",
  },
]

const fmt = (n: number) => `$ ${new Intl.NumberFormat("es-AR").format(n)}`

export function Cart() {
  const [items, setItems] = useState<Item[]>(INITIAL)

  const setQty = (id: string, delta: number) =>
    setItems((xs) =>
      xs.map((x) =>
        x.id === id ? { ...x, qty: Math.max(1, x.qty + delta) } : x,
      ),
    )
  const remove = (id: string) => setItems((xs) => xs.filter((x) => x.id !== id))

  const subtotal = items.reduce((s, x) => s + x.price * x.qty, 0)
  const shipping = items.length === 0 ? 0 : 490
  const total = subtotal + shipping
  const count = items.reduce((s, x) => s + x.qty, 0)

  return (
    <section className="relative px-6 pb-28 pt-36 md:pt-44">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
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
            <p className="text-sm text-ink-soft">
              {count} {count === 1 ? "producto" : "productos"} · Total estimado{" "}
              <span className="text-ink">{fmt(total)}</span>
            </p>
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
              </div>
            ) : (
              <ul className="space-y-7">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-5 border-b border-line-soft pb-7"
                  >
                    <div className="h-32 w-28 shrink-0 overflow-hidden rounded-[var(--r)] bg-bg-deep">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-ink-dim">
                            {item.kind}
                          </p>
                          <h3 className="mt-1 truncate font-display text-xl leading-tight text-ink">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-ink-soft">{item.variant}</p>
                        </div>
                        <button
                          onClick={() => remove(item.id)}
                          aria-label={`Quitar ${item.name}`}
                          className="rounded-full p-2 text-ink-dim transition-colors hover:bg-bg-deep hover:text-leather"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.6} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-end justify-between pt-4">
                        <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1">
                          <button
                            onClick={() => setQty(item.id, -1)}
                            disabled={item.qty <= 1}
                            aria-label="Disminuir"
                            className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-bg-deep disabled:cursor-not-allowed disabled:text-ink-dim"
                          >
                            <Minus className="h-3.5 w-3.5" strokeWidth={1.8} />
                          </button>
                          <span className="min-w-6 text-center text-sm font-medium tabular-nums text-ink">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => setQty(item.id, 1)}
                            aria-label="Aumentar"
                            className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-bg-deep"
                          >
                            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
                          </button>
                        </div>

                        <div className="text-right">
                          {item.qty > 1 && (
                            <p className="text-[11px] text-ink-dim">
                              {fmt(item.price)} c/u
                            </p>
                          )}
                          <p className="font-display text-xl text-ink">
                            {fmt(item.price * item.qty)}
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
              <div className="rounded-[var(--r-lg)] border border-line bg-surface p-7 shadow-[0_1px_0_oklch(100%_0_0)]">
                <h2 className="font-display text-2xl text-ink">Resumen del pedido</h2>

                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Subtotal</dt>
                    <dd className="tabular-nums text-ink">{fmt(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">
                      Envío{" "}
                      <span className="text-ink-dim">· estimado</span>
                    </dt>
                    <dd className="tabular-nums text-ink">{fmt(shipping)}</dd>
                  </div>
                  <button className="flex w-full items-center justify-between text-left text-ink-soft transition-colors hover:text-ink">
                    <span className="inline-flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5" strokeWidth={1.8} />
                      Agregar cupón
                    </span>
                    <span className="text-ink-dim">—</span>
                  </button>
                </dl>

                <div className="mt-6 flex items-baseline justify-between border-t border-line-soft pt-5">
                  <span className="text-sm uppercase tracking-[0.14em] text-ink-soft">
                    Total
                  </span>
                  <span className="font-display text-3xl tabular-nums text-ink">
                    {fmt(total)}
                  </span>
                </div>
                <p className="mt-1 text-right text-[11px] text-ink-dim">
                  Precio final en ARS · hasta 6 cuotas sin interés
                </p>

                <button
                  disabled={items.length === 0}
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-medium text-bg transition-transform hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continuar al pago
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </button>
                <Link
                  href="/"
                  className="mt-3 block text-center text-xs text-ink-soft transition-colors hover:text-ink"
                >
                  o seguir comprando
                </Link>

                {/* Trust row */}
                <ul className="mt-8 grid grid-cols-2 gap-4 border-t border-line-soft pt-6 text-[11px] text-ink-soft">
                  <li className="flex items-start gap-2">
                    <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-moss" strokeWidth={1.8} />
                    Envíos a toda Argentina*
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-moss" strokeWidth={1.8} />
                    Garantía 30 días
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-moss" strokeWidth={1.8} />
                    Pago seguro · MercadoPago
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border border-moss text-[8px] font-bold text-moss">
                      ✓
                    </span>
                    Sin cuenta obligatoria
                  </li>
                </ul>
                <p className="mt-3 text-[10px] text-ink-dim">
                  *Excepto Tierra del Fuego. Coordinamos envío por Correo Argentino, Andreani u OCA.
                </p>
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
