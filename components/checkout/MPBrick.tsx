"use client"

import { useEffect, useState } from "react"
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react"

let initialized = false

export function MPBrick({
  publicKey,
  preferenceId,
}: {
  publicKey: string
  preferenceId: string
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!initialized) {
      initMercadoPago(publicKey, { locale: "es-AR" })
      initialized = true
    }
    setReady(true)
  }, [publicKey])

  if (!ready) {
    return <div className="h-14 animate-pulse rounded-full bg-bg-deep" />
  }

  return (
    <Wallet
      initialization={{ preferenceId, redirectMode: "self" }}
    />
  )
}
