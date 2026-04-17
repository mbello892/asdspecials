import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/sections/Navbar"
import { Footer } from "@/components/sections/Footer"
import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import { getSiteContent } from "@/lib/payload"

export const metadata = {
  title: "Finalizar compra — ASD Specials",
}

export const dynamic = "force-dynamic"

export default async function CheckoutPage() {
  const content = await getSiteContent()
  const bank = content.bankTransfer ?? {}

  return (
    <main className="relative">
      <Navbar />
      <section className="relative px-6 pb-24 pt-36 md:pt-44">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/carrito"
            className="group mb-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={1.8}
            />
            Volver al carrito
          </Link>

          <div className="mb-10 border-b border-line-soft pb-8">
            <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-ink-dim">
              — Finalizar compra
            </p>
            <h1 className="font-display text-[clamp(2.25rem,1rem+3vw,3.75rem)] leading-[0.96] tracking-tightest text-ink">
              Pago y <span className="italic text-moss">envío</span>
            </h1>
          </div>

          <CheckoutForm
            bankTransfer={{
              bankName: bank.bankName ?? "",
              accountHolder: bank.accountHolder ?? "",
              cbu: bank.cbu ?? "",
              alias: bank.alias ?? "",
              cuit: bank.cuit ?? "",
              discountLabel: bank.discountLabel ?? "",
            }}
          />
        </div>
      </section>
      <Footer />
    </main>
  )
}
