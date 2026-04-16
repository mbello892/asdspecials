import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Category } from "@/types/shop"
import { formatHeadline } from "@/lib/format-headline"

const DEFAULT_INTRO_TITLE =
  "Tres categorías. *Una obsesión*:\nque la pieza viva mucho tiempo."

type CategoryWithImage = Category

const SPANS = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
]

const FALLBACK_IMAGE: Record<string, string> = {
  plantas:
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80&auto=format&fit=crop",
  macetas:
    "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=900&q=80&auto=format&fit=crop",
  velas:
    "https://images.unsplash.com/photo-1602874801006-e26512155ee2?w=900&q=80&auto=format&fit=crop",
  default:
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80&auto=format&fit=crop",
}

function getImageUrl(cat: CategoryWithImage): string {
  return cat.image?.url || FALLBACK_IMAGE[cat.slug] || FALLBACK_IMAGE.default
}

export function Collections({
  categories,
  productCounts,
  introTitle,
}: {
  categories: Category[]
  productCounts?: Record<string, number>
  introTitle?: string | null
}) {
  const list = categories.slice(0, 3) as CategoryWithImage[]
  const title = introTitle || DEFAULT_INTRO_TITLE

  return (
    <section id="plantas" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="reveal mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-ink-dim">
              — Catálogo
            </p>
            <h2 className="font-display text-[clamp(2.25rem,1rem+3.2vw,4rem)] leading-[0.96] tracking-tightest text-ink">
              {formatHeadline(title)}
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="group hidden shrink-0 items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink md:inline-flex"
          >
            Ver todo
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.8}
            />
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="rounded-[var(--r-lg)] border border-dashed border-line bg-bg-deep p-10 text-center text-sm text-ink-soft">
            Aún no hay categorías cargadas. Creá la primera desde el admin en{" "}
            <span className="font-mono text-ink">/admin/collections/categories</span>.
          </div>
        ) : (
          <div className="grid auto-rows-[1fr] grid-cols-1 gap-5 md:grid-cols-12 md:grid-rows-2">
            {list.map((c, i) => {
              const count = productCounts?.[c.slug] ?? 0
              return (
                <Link
                  key={c.id}
                  href={`/catalogo?c=${c.slug}`}
                  className={`reveal group relative block min-h-[200px] overflow-hidden rounded-[var(--r-lg)] bg-bg-deep ${SPANS[i] ?? SPANS[2]}`}
                >
                  <img
                    src={getImageUrl(c)}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-[var(--dur-slow)] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-bg/75">
                        {count > 0
                          ? `${count} ${count === 1 ? "pieza" : "piezas"}`
                          : "Nueva categoría"}
                      </p>
                      <h3 className="mt-1 font-display text-2xl text-bg md:text-3xl">
                        {c.name}
                      </h3>
                      {c.description && (
                        <p className="mt-2 max-w-xs text-sm text-bg/80">{c.description}</p>
                      )}
                    </div>
                    <div className="glass grid h-11 w-11 shrink-0 place-items-center rounded-full">
                      <ArrowUpRight className="h-4 w-4 text-ink" strokeWidth={1.8} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div className="reveal mt-5 grid grid-cols-1 overflow-hidden rounded-[var(--r-lg)] border border-line-soft bg-surface md:grid-cols-12">
          <div className="flex flex-col justify-between gap-6 p-8 md:col-span-7 md:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-wood-deep" />
                Próximamente
              </div>
              <h3 className="mt-5 font-display text-3xl leading-[1.05] tracking-tightest text-ink md:text-4xl">
                Mesas de living en <span className="italic text-moss">aluminio</span>.
              </h3>
              <p className="mt-4 max-w-md text-sm leading-6 text-ink-soft">
                Misma obsesión por el aluminio cepillado que llevamos a las macetas, ahora en
                mobiliario. Primera tanda en preparación.
              </p>
            </div>
            <a
              href="#newsletter"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-moss"
            >
              Avisame cuando estén <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
            </a>
          </div>
          <div className="relative min-h-[220px] md:col-span-5">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=80&auto=format&fit=crop"
              alt="Adelanto mesas de aluminio"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, oklch(99% 0.002 150) 0%, transparent 45%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
