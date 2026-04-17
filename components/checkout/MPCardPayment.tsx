"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CardPayment } from "@mercadopago/sdk-react"
import { ensureMPInit } from "@/lib/mpInit"

type CardFormData = {
  token: string
  installments: number
  payment_method_id: string
  issuer_id?: string
  payer: {
    email: string
    identification?: { type: string; number: string }
  }
  transaction_amount: number
}

export function MPCardPayment({
  publicKey,
  orderId,
  amount,
  payerEmail,
}: {
  publicKey: string
  orderId: number
  amount: number
  payerEmail: string
}) {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [brickReady, setBrickReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    ensureMPInit(publicKey)
    setReady(true)
  }, [publicKey])

  if (!ready) {
    return <Skeleton />
  }

  const handleSubmit = async (formData: CardFormData) => {
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/payments/mp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          token: formData.token,
          installments: formData.installments,
          paymentMethodId: formData.payment_method_id,
          issuerId: formData.issuer_id,
          transactionAmount: Number(formData.transaction_amount),
          payer: formData.payer,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "No pudimos procesar tu pago. Probá de nuevo.")
        setSubmitting(false)
        return
      }
      if (data.status === "approved") {
        router.push(`/orden/${orderId}?mp=success`)
      } else if (data.status === "pending" || data.status === "in_process") {
        router.push(`/orden/${orderId}?mp=pending`)
      } else if (data.status === "rejected") {
        setError(
          messageForDetail(data.statusDetail) ??
            "Tu tarjeta fue rechazada. Probá con otra o usá otro método.",
        )
        setSubmitting(false)
      } else {
        setError("Estado de pago inesperado. Contactanos si el cargo apareció.")
        setSubmitting(false)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de red procesando el pago"
      setError(msg)
      setSubmitting(false)
    }
  }

  return (
    <div className="relative">
      {!brickReady && <Skeleton />}
      <div className={brickReady ? "block" : "hidden"}>
        <CardPayment
          initialization={{
            amount,
            payer: { email: payerEmail },
          }}
          onSubmit={async (data) => {
            await handleSubmit(data as unknown as CardFormData)
          }}
          onReady={() => setBrickReady(true)}
          onError={(err) => {
            console.warn("[mp-card] brick error:", err)
          }}
          customization={{
            visual: {
              style: {
                theme: "dark",
                customVariables: {
                  baseColor: "#6a9474",
                  errorColor: "#a74e3a",
                  successColor: "#6a9474",
                  textPrimaryColor: "#e8e1d3",
                  textSecondaryColor: "#a89c8c",
                  inputBackgroundColor: "#0e0b08",
                  formBackgroundColor: "transparent",
                  formBorderColor: "#2c241e",
                  outlinePrimaryColor: "#6a9474",
                  borderRadiusSmall: "10px",
                  borderRadiusMedium: "12px",
                  borderRadiusLarge: "16px",
                  formInputsTextTransform: "none",
                  inputVerticalPadding: "14px",
                  fontSizeSmall: "12px",
                  fontSizeMedium: "14px",
                  fontWeightNormal: "400",
                  fontWeightSemiBold: "500",
                },
              },
            },
            paymentMethods: {
              maxInstallments: 12,
              minInstallments: 1,
            },
          }}
          locale="es-AR"
        />
      </div>

      {submitting && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-[var(--r-md)] bg-bg/60 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-full bg-surface px-5 py-3 text-sm text-ink shadow-lg">
            <span className="h-2 w-2 animate-pulse rounded-full bg-moss" />
            Procesando pago…
          </div>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-[var(--r-sm)] border border-leather/40 bg-leather/10 px-4 py-3 text-sm leading-6 text-ink"
        >
          {error}
        </p>
      )}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="h-14 animate-pulse rounded-[var(--r-sm)] bg-bg-deep" />
      <div className="h-14 animate-pulse rounded-[var(--r-sm)] bg-bg-deep" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-14 animate-pulse rounded-[var(--r-sm)] bg-bg-deep" />
        <div className="h-14 animate-pulse rounded-[var(--r-sm)] bg-bg-deep" />
      </div>
      <div className="h-12 animate-pulse rounded-full bg-bg-deep" />
    </div>
  )
}

// MP status_detail comunes traducidos a copy nuestro
function messageForDetail(detail?: string): string | null {
  if (!detail) return null
  const map: Record<string, string> = {
    cc_rejected_insufficient_amount: "Fondos insuficientes en la tarjeta.",
    cc_rejected_bad_filled_security_code: "El código de seguridad es incorrecto.",
    cc_rejected_bad_filled_date: "La fecha de vencimiento es incorrecta.",
    cc_rejected_bad_filled_other: "Revisá los datos de la tarjeta.",
    cc_rejected_high_risk: "El pago fue rechazado por riesgo. Probá con otra tarjeta.",
    cc_rejected_call_for_authorize:
      "Tu banco requiere autorización. Llamá al banco y reintentá.",
    cc_rejected_card_disabled: "La tarjeta está inhabilitada. Contactá al banco.",
    cc_rejected_duplicated_payment:
      "Ya procesamos un pago igual. Revisá antes de reintentar.",
    cc_rejected_max_attempts:
      "Llegaste al límite de intentos. Probá con otra tarjeta.",
  }
  return map[detail] ?? null
}
