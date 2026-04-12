import { ArrowRight } from "lucide-react"

export function Newsletter() {
  return (
    <section id="newsletter" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-ink-dim">
          — Lista de aviso
        </p>
        <h2 className="reveal font-display text-[clamp(2rem,1rem+3vw,4rem)] leading-[0.98] tracking-tightest text-ink">
          Las variegadas se van rápido.
          <br />
          <span className="italic text-moss">Avisamos primero</span>.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-ink-soft">
          Suscribite y recibí un mail cuando entra stock nuevo — plantas, macetas, velas y las
          mesas de aluminio cuando lleguen. Sin spam, sin relleno.
        </p>

        <form className="mx-auto mt-10 flex max-w-md items-center gap-2 rounded-full border border-line bg-surface p-1.5 pl-5 shadow-[0_1px_0_oklch(100%_0_0)]">
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
            Avisame
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
