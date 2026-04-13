import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { formatHeadline } from "@/lib/format-headline"

type HeroData = {
  eyebrow?: string | null
  headline?: string | null
  subheadline?: string | null
  primaryCta?: { label?: string | null; href?: string | null } | null
  secondaryCta?: { label?: string | null; href?: string | null } | null
}

const DEFAULTS: Required<{
  eyebrow: string
  headline: string
  subheadline: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
}> = {
  eyebrow: "Nueva entrada · Monstera Variegada",
  headline: "Plantas elegidas.\nMacetas que las *sostienen*.",
  subheadline:
    "Seleccionamos cada planta a mano — sanas, aclimatadas, listas para entrar a tu casa — y las presentamos en macetas de aluminio cepillado hechas para durar toda la vida.",
  primaryCta: { label: "Ver plantas", href: "#plantas" },
  secondaryCta: { label: "Explorar macetas", href: "#macetas" },
}

export function Hero({ data }: { data?: HeroData | null }) {
  const eyebrow = data?.eyebrow || DEFAULTS.eyebrow
  const headline = data?.headline || DEFAULTS.headline
  const subheadline = data?.subheadline || DEFAULTS.subheadline
  const primary = {
    label: data?.primaryCta?.label || DEFAULTS.primaryCta.label,
    href: data?.primaryCta?.href || DEFAULTS.primaryCta.href,
  }
  const secondary = {
    label: data?.secondaryCta?.label || DEFAULTS.secondaryCta.label,
    href: data?.secondaryCta?.href || DEFAULTS.secondaryCta.href,
  }

  return (
    <section className="relative isolate grain overflow-hidden pb-24 pt-36 md:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(34% 0.055 150 / 0.18), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-20 h-[440px] w-[440px] rounded-full opacity-55 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(72% 0.060 70 / 0.40), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7 lg:pt-10">
          <div className="glass mb-7 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-moss" />
            {eyebrow}
          </div>

          <h1 className="font-display text-[clamp(3rem,1.5rem+5.2vw,6.5rem)] font-normal leading-[0.92] tracking-tightest text-ink">
            {formatHeadline(headline)}
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-ink-soft">
            {subheadline}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={primary.href}
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-bg transition-transform duration-[var(--dur-base)] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px]"
            >
              {primary.label}
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.8}
              />
            </Link>
            <Link
              href={secondary.href}
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-bg-deep"
            >
              {secondary.label}
            </Link>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-line-soft pt-8">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-ink-dim">Plantas</dt>
              <dd className="mt-1 font-display text-2xl text-ink">120+</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-ink-dim">Macetas</dt>
              <dd className="mt-1 font-display text-2xl text-ink">6 medidas</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-ink-dim">Envío</dt>
              <dd className="mt-1 font-display text-2xl text-ink">Todo el país</dd>
            </div>
          </dl>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[var(--r-xl)] bg-bg-deep shadow-[0_30px_80px_-30px_oklch(22%_0.015_150/0.25)]">
            <img
              src="https://images.unsplash.com/photo-1545241047-6083a3684587?w=900&q=80&auto=format&fit=crop"
              alt="Monstera Deliciosa Variegada en maceta de aluminio cepillado"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/45 via-ink/10 to-transparent p-6">
              <p className="font-display text-xl italic text-bg">Monstera Variegada</p>
              <p className="text-xs uppercase tracking-[0.18em] text-bg/80">Stock limitado</p>
            </div>
          </div>

          <div className="glass absolute -bottom-6 -left-4 hidden w-60 rounded-lg p-4 md:block">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-concrete/30">
                <img
                  src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&q=80&auto=format&fit=crop"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-ink-dim">Maceta</p>
                <p className="text-sm font-medium text-ink">Aluminio Ø22 cm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
