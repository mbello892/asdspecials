import { ArrowRight } from "lucide-react"
import { formatHeadline } from "@/lib/format-headline"

type NewsletterData = {
  eyebrow?: string | null
  title?: string | null
  body?: string | null
  ctaLabel?: string | null
}

const DEFAULTS = {
  eyebrow: "— Lista de aviso",
  title: "Las variegadas se van rápido.\n*Avisamos primero*.",
  body: "Suscribite y recibí un mail cuando entra stock nuevo — plantas, macetas, velas y las mesas de aluminio cuando lleguen. Sin spam, sin relleno.",
  ctaLabel: "Avisame",
} as const

export function Newsletter({ data }: { data?: NewsletterData | null }) {
  const eyebrow = data?.eyebrow || DEFAULTS.eyebrow
  const title = data?.title || DEFAULTS.title
  const body = data?.body || DEFAULTS.body
  const ctaLabel = data?.ctaLabel || DEFAULTS.ctaLabel

  return (
    <section id="newsletter" className="concrete-section relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-ink-dim">{eyebrow}</p>
        <h2 className="reveal font-display text-[clamp(2rem,1rem+3vw,4rem)] leading-[0.98] tracking-tightest text-ink">
          {formatHeadline(title)}
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-ink-soft">{body}</p>

        <form className="mx-auto mt-10 flex max-w-md items-center gap-2 rounded-full border border-line bg-surface p-1.5 pl-5 shadow-[0_1px_0_oklch(22%_0.015_50)]">
          <input
            type="email"
            required
            placeholder="tu@correo.com"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-dim focus:outline-none"
          />
          <button
            type="submit"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-[1px]"
          >
            {ctaLabel}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </button>
        </form>
      </div>
    </section>
  )
}
