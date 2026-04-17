"use client"

import { useState } from "react"
import { CreditCard, Wallet as WalletIcon } from "lucide-react"
import { MPCardPayment } from "./MPCardPayment"
import { MPBrick } from "./MPBrick"

type Method = "card" | "wallet"

export function PaymentPanel({
  publicKey,
  preferenceId,
  orderId,
  amount,
  payerEmail,
}: {
  publicKey: string
  preferenceId: string
  orderId: number
  amount: number
  payerEmail: string
}) {
  const [method, setMethod] = useState<Method>("card")

  return (
    <div>
      <div
        role="tablist"
        aria-label="Método de pago"
        className="grid grid-cols-2 gap-2 rounded-full border border-line bg-bg-deep p-1"
      >
        <MethodTab
          active={method === "card"}
          onClick={() => setMethod("card")}
          icon={<CreditCard className="h-4 w-4" strokeWidth={1.8} />}
          label="Tarjeta"
          sub="Crédito o débito"
        />
        <MethodTab
          active={method === "wallet"}
          onClick={() => setMethod("wallet")}
          icon={<WalletIcon className="h-4 w-4" strokeWidth={1.8} />}
          label="Mercado Pago"
          sub="Tu cuenta o saldo"
        />
      </div>

      <div className="mt-6">
        {method === "card" ? (
          <MPCardPayment
            publicKey={publicKey}
            orderId={orderId}
            amount={amount}
            payerEmail={payerEmail}
          />
        ) : (
          <div className="space-y-3">
            <p className="text-[11px] leading-5 text-ink-dim">
              Al continuar se abre Mercado Pago. Podés pagar con tarjetas guardadas,
              saldo en cuenta o efectivo.
            </p>
            <MPBrick publicKey={publicKey} preferenceId={preferenceId} />
          </div>
        )}
      </div>
    </div>
  )
}

function MethodTab({
  active,
  onClick,
  icon,
  label,
  sub,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  sub: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "group flex items-center gap-3 rounded-full px-4 py-3 text-left transition-colors",
        active
          ? "bg-surface-concrete text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          : "text-ink-soft hover:text-ink",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors",
          active
            ? "border-moss/40 bg-moss/10 text-moss"
            : "border-line bg-bg-deep text-ink-soft group-hover:text-ink",
        ].join(" ")}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium leading-tight">{label}</span>
        <span className="mt-0.5 block text-[11px] leading-tight text-ink-dim">{sub}</span>
      </span>
    </button>
  )
}
