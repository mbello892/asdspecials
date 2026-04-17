import type { Metadata } from "next"
import { Inter, Special_Elite } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const specialElite = Special_Elite({
  subsets: ["latin"],
  variable: "--font-special-elite",
  weight: "400",
  display: "swap",
})

export const metadata: Metadata = {
  title: "asd specials — Plantas y macetas de aluminio",
  description:
    "Plantas de interior seleccionadas a mano y macetas de aluminio cepillado hechas para durar. Envío cuidado a todo el país.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${specialElite.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
