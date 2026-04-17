import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react"
import { PaymentPanel } from "@/components/checkout/PaymentPanel"
import { formatPrice } from "@/lib/format"

type WCOrder = {
  id: number
  number: string
  status: string
  total: string
  line_items: Array<{
    id: number
    name: string
    quantity: number
    total: string
    image?: { src?: string } | null
  }>
  billing: { first_name?: string; last_name?: string; email?: string }
}

async function fetchOrder(orderId: string): Promise<WCOrder | null> {
  const { WC_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env
  if (!WC_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) return null
  const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString("base64")
  const res = await fetch(
    `${WC_URL.replace(/\/$/, "")}/wp-json/wc/v3/orders/${orderId}`,
    {
      headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
      cache: "no-store",
    },
  )
  if (!res.ok) return null
  return (await res.json()) as WCOrder
}

export default async function PagoPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>
  searchParams: Promise<{ pref?: string }>
}) {
  const [{ orderId }, { pref }] = await Promise.all([params, searchParams])

  if (!pref) notFound()

  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
  if (!publicKey) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20">
        <p className="text-ink">Falta configurar Mercado Pago.</p>
      </div>
    )
  }

  const order = await fetchOrder(orderId)
  if (!order) notFound()

  const subtotal = order.line_items.reduce((acc, li) => acc + Number(li.total), 0)

  return (
    <main className="mx-auto max-w-4xl px-6 py-14 md:py-20">
      <Link
        href="/checkout"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ink-dim transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3 w-3" strokeWidth={1.8} />
        Volver al checkout
      </Link>

      <div className="mt-6 border-b border-line-soft pb-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink-dim">
          Pedido #{order.number}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,1rem+2.5vw,3rem)] leading-[0.96] tracking-tightest text-ink">
          Completá tu pago
        </h1>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <div className="rounded-[var(--r-lg)] border border-line bg-surface-concrete p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-moss/40 bg-moss/10 text-moss">
                <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-display text-lg text-ink">Elegí cómo querés pagar</p>
                <p className="mt-1 text-sm leading-6 text-ink-soft">
                  Ingresá la tarjeta en el sitio o pagá con tu cuenta de Mercado Pago.
                  Tus datos viajan cifrados y nunca se guardan en nuestros servidores.
                </p>
              </div>
            </div>

            <PaymentPanel
              publicKey={publicKey}
              preferenceId={pref}
              orderId={order.id}
              amount={Number(order.total)}
              payerEmail={order.billing.email ?? ""}
            />

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-dim">
                <Lock className="h-3 w-3" strokeWidth={2} />
                Pago cifrado — SSL
              </div>
              <p className="text-[11px] tracking-[0.12em] text-ink-dim">
                Visa · Mastercard · Amex · Naranja · Cabal
              </p>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-5">
          <div className="rounded-[var(--r-lg)] border border-line bg-surface-concrete p-7">
            <h2 className="font-display text-2xl text-ink">Tu pedido</h2>
            <ul className="mt-5 space-y-4">
              {order.line_items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 border-b border-line-soft pb-4 last:border-0 last:pb-0"
                >
                  <div className="h-16 w-14 shrink-0 overflow-hidden rounded-[var(--r-sm)] bg-bg-deep">
                    {item.image?.src && (
                      <img
                        src={item.image.src}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                    <p className="mt-0.5 text-[11px] text-ink-dim">× {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-sm tabular-nums text-ink">
                    {formatPrice(Number(item.total))}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-baseline justify-between border-t border-line-soft pt-4">
              <span className="text-sm uppercase tracking-[0.14em] text-ink-soft">Total</span>
              <span className="font-display text-3xl tabular-nums text-ink">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
