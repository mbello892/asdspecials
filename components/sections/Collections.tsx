import { ArrowUpRight } from "lucide-react"

type Category = {
  id: string
  title: string
  subtitle: string
  count: string
  image: string
  span: string
  ratio: string
  soon?: boolean
}

const CATEGORIES: Category[] = [
  {
    id: "plantas",
    title: "Plantas",
    subtitle: "De interior, seleccionadas ejemplar por ejemplar.",
    count: "120+ en stock",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80&auto=format&fit=crop",
    span: "md:col-span-7 md:row-span-2",
    ratio: "aspect-[5/6]",
  },
  {
    id: "macetas",
    title: "Macetas",
    subtitle: "Aluminio cepillado, 6 medidas.",
    count: "Hechas en serie corta",
    image:
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=900&q=80&auto=format&fit=crop",
    span: "md:col-span-5",
    ratio: "aspect-[4/3]",
  },
  {
    id: "velas",
    title: "Velas",
    subtitle: "Cera vegetal, aromas de autor.",
    count: "Nueva entrada",
    image:
      "https://images.unsplash.com/photo-1602874801006-e26512155ee2?w=900&q=80&auto=format&fit=crop",
    span: "md:col-span-5",
    ratio: "aspect-[4/3]",
  },
]

export function Collections() {
  return (
    <section id="plantas" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="reveal mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-ink-dim">
              — Catálogo
            </p>
            <h2 className="font-display text-[clamp(2.25rem,1rem+3.2vw,4rem)] leading-[0.96] tracking-tightest text-ink">
              Tres categorías. <span className="italic text-moss">Una obsesión</span>:<br />
              que la pieza viva mucho tiempo.
            </h2>
          </div>
          <a
            href="#catalogo"
            className="group hidden shrink-0 items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink md:inline-flex"
          >
            Ver todo
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.8}
            />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              id={c.id}
              href={`#${c.id}`}
              className={`reveal group relative block overflow-hidden rounded-[var(--r-lg)] bg-bg-deep ${c.span} ${c.ratio}`}
            >
              <img
                src={c.image}
                alt={c.title}
                className="h-full w-full object-cover transition-transform duration-[var(--dur-slow)] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-bg/75">{c.count}</p>
                  <h3 className="mt-1 font-display text-2xl text-bg md:text-3xl">{c.title}</h3>
                  <p className="mt-2 max-w-xs text-sm text-bg/80">{c.subtitle}</p>
                </div>
                <div className="glass grid h-11 w-11 shrink-0 place-items-center rounded-full">
                  <ArrowUpRight className="h-4 w-4 text-ink" strokeWidth={1.8} />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Coming soon — mesas de aluminio */}
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
