"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Banknote, CircleCheck, ArrowRight } from "lucide-react"
import { useCartStore, selectSubtotal } from "@/lib/cart-store"
import { formatPrice } from "@/lib/format"

export type BankTransferDetails = {
  bankName: string
  accountHolder: string
  cbu: string
  alias: string
  cuit: string
  discountLabel: string
}

type BillingForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  postcode: string
  notes: string
}

const INITIAL_BILLING: BillingForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postcode: "",
  notes: "",
}

export function CheckoutForm({ bankTransfer }: { bankTransfer: BankTransferDetails }) {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const hydrated = useCartStore((s) => s.hydrated)
  const clear = useCartStore((s) => s.clear)
  const subtotal = useCartStore(selectSubtotal)

  const [billing, setBilling] = useState<BillingForm>(INITIAL_BILLING)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof BillingForm>(key: K, value: BillingForm[K]) {
    setBilling((prev) => ({ ...prev, [key]: value }))
  }

  if (!hydrated) {
    return <div className="h-32 animate-pulse rounded bg-bg-deep" />
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--r-lg)] border border-line-soft bg-surface p-10 text-center">
        <p className="font-display text-2xl text-ink">Tu carrito está vacío</p>
        <p className="mt-2 text-sm text-ink-soft">
          No podés finalizar una compra sin productos.
        </p>
        <Link
          href="/catalogo"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-transform hover:-translate-y-[1px]"
        >
          Ver catálogo
          <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
        </Link>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          billing,
          paymentMethod: "bacs",
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "No pudimos crear la orden. Intentá de nuevo.")
        setSubmitting(false)
        return
      }
      clear()
      router.push(`/orden/${data.id}`)
    } catch (err) {
      setError("Error de red. Revisá tu conexión e intentá de nuevo.")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      {/* Left column: billing + payment */}
      <div className="space-y-10 lg:col-span-7">
        {/* Billing */}
        <fieldset className="space-y-5" disabled={submitting}>
          <legend className="mb-4 text-[11px] uppercase tracking-[0.22em] text-ink-dim">
            — Datos de contacto y envío
          </legend>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Nombre" required>
              <input
                required
                value={billing.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Apellido" required>
              <input
                required
                value={billing.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Email" required>
              <input
                required
                type="email"
                value={billing.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputCls}
                placeholder="nombre@ejemplo.com"
              />
            </Field>
            <Field label="Teléfono" required>
              <input
                required
                type="tel"
                value={billing.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputCls}
                placeholder="11 1234 5678"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <Field label="Dirección" required>
                <input
                  required
                  value={billing.address1}
                  onChange={(e) => update("address1", e.target.value)}
                  className={inputCls}
                  placeholder="Calle y número"
                />
              </Field>
            </div>
            <Field label="Piso/Depto (opcional)">
              <input
                value={billing.address2}
                onChange={(e) => update("address2", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Ciudad" required>
              <input
                required
                value={billing.city}
                onChange={(e) => update("city", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Provincia" required>
              <input
                required
                value={billing.state}
                onChange={(e) => update("state", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Código postal" required>
              <input
                required
                value={billing.postcode}
                onChange={(e) => update("postcode", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Notas para el pedido (opcional)">
            <textarea
              value={billing.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              className={`${inputCls} min-h-20 resize-y`}
              placeholder="Horario de entrega preferido, referencias, etc."
            />
          </Field>
        </fieldset>

        {/* Payment method */}
        <fieldset className="space-y-4" disabled={submitting}>
          <legend className="mb-4 text-[11px] uppercase tracking-[0.22em] text-ink-dim">
            — Método de pago
          </legend>
          <div className="rounded-[var(--r-lg)] border-2 border-ink bg-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bg-deep text-ink">
                  <Banknote className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg text-ink">Transferencia bancaria</p>
                    {bankTransfer.discountLabel && (
                      <span className="rounded-full border border-moss bg-moss/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-moss">
                        {bankTransfer.discountLabel}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">
                    Creamos el pedido como pendiente. Te mandamos los datos bancarios por
                    mail y cuando recibimos la transferencia lo confirmamos y te avisamos.
                  </p>
                </div>
              </div>
              <CircleCheck className="h-5 w-5 shrink-0 text-moss" strokeWidth={2} />
            </div>

            {(bankTransfer.bankName || bankTransfer.cbu || bankTransfer.alias) && (
              <dl className="mt-5 grid grid-cols-1 gap-3 rounded-[var(--r)] bg-bg-deep p-4 text-sm md:grid-cols-2">
                {bankTransfer.bankName && (
                  <Row dt="Banco" dd={bankTransfer.bankName} />
                )}
                {bankTransfer.accountHolder && (
                  <Row dt="Titular" dd={bankTransfer.accountHolder} />
                )}
                {bankTransfer.cuit && <Row dt="CUIT" dd={bankTransfer.cuit} />}
                {bankTransfer.cbu && <Row dt="CBU" dd={bankTransfer.cbu} mono />}
                {bankTransfer.alias && <Row dt="Alias" dd={bankTransfer.alias} mono />}
              </dl>
            )}
          </div>
        </fieldset>

        {error && (
          <div className="rounded-[var(--r)] border border-leather bg-leather/5 p-4 text-sm text-leather">
            {error}
          </div>
        )}
      </div>

      {/* Right column: summary sticky */}
      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <div className="rounded-[var(--r-lg)] border border-line bg-surface p-7">
            <h2 className="font-display text-2xl text-ink">Tu pedido</h2>
            <ul className="mt-5 space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 border-b border-line-soft pb-4 last:border-0 last:pb-0">
                  <div className="h-16 w-14 shrink-0 overflow-hidden rounded-[var(--r-sm)] bg-bg-deep">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                    <p className="mt-0.5 text-[11px] text-ink-dim">× {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-sm tabular-nums text-ink">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2 border-t border-line-soft pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="tabular-nums text-ink">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Envío</dt>
                <dd className="tabular-nums text-ink-dim">a coordinar</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-line-soft pt-4">
              <span className="text-sm uppercase tracking-[0.14em] text-ink-soft">Total</span>
              <span className="font-display text-3xl tabular-nums text-ink">
                {formatPrice(subtotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-medium text-bg transition-transform hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                  Creando pedido…
                </>
              ) : (
                <>
                  Confirmar pedido
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </>
              )}
            </button>
            <p className="mt-3 text-center text-[11px] text-ink-dim">
              Al confirmar, se crea el pedido en estado pendiente. Podés pagarlo con los
              datos que te vamos a mandar por mail.
            </p>
          </div>
        </div>
      </aside>
    </form>
  )
}

const inputCls =
  "w-full rounded-[var(--r-sm)] border border-line bg-bg px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink"

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink-dim">
        {label}
        {required && <span className="ml-0.5 text-leather">*</span>}
      </span>
      {children}
    </label>
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
