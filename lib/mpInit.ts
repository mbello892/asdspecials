"use client"

import { initMercadoPago } from "@mercadopago/sdk-react"

let initialized = false

export function ensureMPInit(publicKey: string) {
  if (!initialized) {
    initMercadoPago(publicKey, { locale: "es-AR" })
    initialized = true
  }
}
