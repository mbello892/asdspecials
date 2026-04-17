"use client"

import { useEffect, useState } from "react"
import { Wallet } from "@mercadopago/sdk-react"
import { ensureMPInit } from "@/lib/mpInit"

export function MPBrick({
  publicKey,
  preferenceId,
}: {
  publicKey: string
  preferenceId: string
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ensureMPInit(publicKey)
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
