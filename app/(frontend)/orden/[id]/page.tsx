import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CircleCheck, Mail, Banknote } from "lucide-react"
import { Navbar } from "@/components/sections/Navbar"
import { Footer } from "@/components/sections/Footer"
import { getOrder, type Order } from "@/lib/woocommerce"
import { getSiteContent } from "@/lib/payload"
import { formatPrice } from "@/lib/format"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Gracias por tu pedido — ASD Specials",
}

type Params = { params: Promise<{ id: string }> }

const STATUS_LABELS: Record<string, { label: string; tone: "neutral" | "ok" | "warn" | "bad" }> = {
  pending: { label: "Pendiente de pago", tone: "warn" },
  "on-hold": { label: "Pendiente de pago", tone: "warn" },
  processing: { label: "En proceso", tone: "ok" },
  completed: { label: "Completado", tone: "ok" },
  cancelled: { label: "Cancelado", tone: "bad" },
  refunded: { label: "Reembolsado", tone: "neutral" },
  failed: { label: "Fallido", tone: "bad" },
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABELS[status] ?? { label: status, tone: "neutral" as const }
  const classes =
    s.tone === "ok"
      ? "border-moss bg-moss/10 text-moss"
      : s.tone === "warn"
        ? "border-wood-deep bg-wood-deep/10 text-wood-deep"
        : s.tone === "bad"
          ? "border-leather bg-leather/10 text-leather"
          : "border-line bg-bg-deep text-ink-soft"
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${classes}`}>
      {s.label}
    </span>
  )
}

export default async function OrderPage({ params }: Params) {
  const { id } = await params
  const orderId = Number(id)
  if (!Number.isFinite(orderId)) notFound()

  const [order, content] = await Promise.all([getOrder(orderId), getSiteContent()])
  if (!order) notFound()

  const bank = content.bankTransfer ?? {}
  const isBacs = order.paymentMethod === "bacs"
  const paidStatuses = ["processing", "completed"]
  const isPaid = paidStatuses.includes(order.status)
  const isFailed = ["failed", "cancelled"].includes(order.status)

  const intro = isBacs ? (
    <>
      Recibimos tu pedido y lo guardamos como{" "}
      <span className="text-ink">pendiente de pago</span>. En breve vas a recibir un
      mail a <span className="text-ink">{order.billing.email}</span> con los datos
      bancarios y los próximos pasos.
    </>
  ) : isPaid ? (
    <>
      Tu pago se acreditó vía <span className="text-ink">Mercado Pago</span>. Te
      mandamos un mail de confirmación a{" "}
      <span className="text-ink">{order.billing.email}</span> y te avisamos cuando
      despachemos el pedido.
    </>
  ) : isFailed ? (
    <>
      El pago no se pudo completar. Podés reintentar desde tu carrito o escribirnos
      y lo resolvemos.
    </>
  ) : (
    <>
      Estamos confirmando tu pago con{" "}
      <span className="text-ink">Mercado Pago</span>. En cuanto tengamos novedades te
      avisamos por mail a <span className="text-ink">{order.billing.email}</span>.
    </>
  )

  return (
    <main className="relative">
      <Navbar />
      <section className="relative px-6 pb-28 pt-36 md:pt-44">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/catalogo"
            className="group mb-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={1.8}
            />
            Seguir explorando
          </Link>

          <div className="mb-10 rounded-[var(--r-lg)] border border-line bg-surface-concrete p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-moss/15 text-moss">
                <CircleCheck className="h-7 w-7" strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-[0.22em] text-ink-dim">
                  Pedido #{order.number}
                </p>
                <h1 className="mt-1 font-display text-[clamp(2rem,1rem+2.4vw,3rem)] leading-[0.96] tracking-tightest text-ink">
                  Gracias por tu <span className="italic text-moss">pedido</span>
                </h1>
                <div className="mt-3">
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-4 text-sm leading-6 text-ink-soft">{intro}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              {/* Items */}
              <div className="rounded-[var(--r-lg)] border border-line bg-surface-concrete p-6">
                <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-ink-dim">
                  — Productos
                </p>
                <ul className="space-y-5">
                  {order.lineItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-4 border-b border-line-soft pb-5 last:border-0 last:pb-0"
                    >
                      <div className="h-16 w-14 shrink-0 overflow-hidden rounded-[var(--r-sm)] bg-bg-deep">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">{item.name}</p>
                        <p className="mt-0.5 text-[11px] text-ink-dim">× {item.quantity}</p>
                      </div>
                      <p className="shrink-0 text-sm tabular-nums text-ink">
                        {formatPrice(Number(item.total))}
                      </p>
                    </li>
                  ))}
                </ul>

                <dl className="mt-6 space-y-2 border-t border-line-soft pt-5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Subtotal</dt>
                    <dd className="tabular-nums text-ink">
                      {formatPrice(Number(order.subtotal))}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 flex items-baseline justify-between border-t border-line-soft pt-4">
                  <span className="text-sm uppercase tracking-[0.14em] text-ink-soft">
                    Total
                  </span>
                  <span className="font-display text-3xl tabular-nums text-ink">
                    {formatPrice(Number(order.total))}
                  </span>
                </div>
              </div>

              {/* Shipping */}
              <div className="mt-6 rounded-[var(--r-lg)] border border-line bg-surface-concrete p-6">
                <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-ink-dim">
                  — Envío a
                </p>
                <div className="text-sm leading-6 text-ink">
                  <p className="font-medium">
                    {order.billing.firstName} {order.billing.lastName}
                  </p>
                  <p className="text-ink-soft">{order.billing.address1}</p>
                  {order.billing.address2 && (
                    <p className="text-ink-soft">{order.billing.address2}</p>
                  )}
                  <p className="text-ink-soft">
                    {order.billing.city}, {order.billing.state} {order.billing.postcode}
                  </p>
                  <p className="mt-2 text-ink-soft">{order.billing.phone}</p>
                  <p className="text-ink-soft">{order.billing.email}</p>
                </div>
              </div>
            </div>

            {/* Sidebar: payment info */}
            <aside className="md:col-span-5">
              {isBacs && (bank.bankName || bank.cbu || bank.alias) && (
                <div className="rounded-[var(--r-lg)] border border-line bg-bg-deep p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-ink" strokeWidth={1.8} />
                    <p className="text-[11px] uppercase tracking-[0.18em] text-ink-dim">
                      Transferí a
                    </p>
                  </div>
                  <dl className="space-y-3 text-sm">
                    {bank.bankName && <Row dt="Banco" dd={bank.bankName} />}
                    {bank.accountHolder && <Row dt="Titular" dd={bank.accountHolder} />}
                    {bank.cuit && <Row dt="CUIT" dd={bank.cuit} />}
                    {bank.cbu && <Row dt="CBU" dd={bank.cbu} mono />}
                    {bank.alias && <Row dt="Alias" dd={bank.alias} mono />}
                  </dl>
                  <p className="mt-5 border-t border-line-soft pt-4 text-[11px] leading-5 text-ink-dim">
                    Indicá el número de pedido <span className="text-ink">#{order.number}</span>{" "}
                    en el concepto. Cuando recibamos la transferencia te confirmamos por mail.
                  </p>
                </div>
              )}

              <div className="mt-4 rounded-[var(--r-lg)] border border-line-soft bg-surface-concrete p-5 text-sm text-ink-soft">
                <div className="mb-2 flex items-center gap-2 text-ink">
                  <Mail className="h-4 w-4" strokeWidth={1.8} />
                  <p className="text-[11px] uppercase tracking-[0.18em]">Mails</p>
                </div>
                <p className="leading-6">
                  Te mandamos un mail de confirmación y otro cuando acreditamos el pago.
                  Revisá la carpeta de spam si no lo ves.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

function Row({ dt, dd, mono }: { dt: string; dd: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[11px] uppercase tracking-[0.14em] text-ink-dim">{dt}</dt>
      <dd className={`text-sm text-ink ${mono ? "font-mono" : ""}`}>{dd}</dd>
    </div>
  )
}
