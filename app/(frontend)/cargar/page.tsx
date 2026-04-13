import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getPayload } from "payload"
import config from "@payload-config"
import { QuickAddForm } from "./QuickAddForm"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Carga rápida — asdspecials",
}

export default async function CargarPage() {
  const payload = await getPayload({ config })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect("/admin/login?redirect=/cargar")
  }

  const { docs: categories } = await payload.find({
    collection: "categories",
    limit: 100,
    sort: "name",
    depth: 0,
  })

  return (
    <main className="min-h-screen bg-bg pb-24">
      <header className="sticky top-0 z-20 glass border-b border-line-soft">
        <div className="mx-auto flex max-w-xl items-center justify-between px-5 py-4">
          <Link
            href="/admin/collections/products"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
            Volver al admin
          </Link>
          <p className="text-[11px] uppercase tracking-[0.16em] text-ink-dim">
            Hola, {user.name || user.email}
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-xl px-5 pt-8">
        <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-ink-dim">
          — Carga rápida
        </p>
        <h1 className="font-display text-[clamp(2rem,1rem+3vw,3rem)] leading-[0.98] tracking-tightest text-ink">
          Nuevo <span className="italic text-moss">producto</span>
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          Subí fotos desde la cámara o la galería, completá los datos básicos y
          publicá. Tiempo promedio: menos de un minuto.
        </p>

        <QuickAddForm categories={categories} />
      </section>
    </main>
  )
}
