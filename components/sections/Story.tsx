type Pillar = {
  number?: string | null
  title?: string | null
  body?: string | null
  id?: string | null
}

const DEFAULT_PILLARS: { number: string; title: string; body: string }[] = [
  {
    number: "01",
    title: "Selección honesta",
    body: "Visitamos cada vivero y elegimos ejemplar por ejemplar. Si la planta no está sana y aclimatada, no va al catálogo.",
  },
  {
    number: "02",
    title: "Aluminio para siempre",
    body: "Nuestras macetas se fabrican localmente en aluminio cepillado: no se oxida, no se rompe, no amarillea. Durables de verdad.",
  },
  {
    number: "03",
    title: "Envío cuidado",
    body: "Embalaje diseñado planta por planta, coordinado con vos. Si algo no llega bien, lo reponemos sin discusión.",
  },
]

export function Story({ pillars }: { pillars?: Pillar[] | null }) {
  const list =
    pillars && pillars.length > 0
      ? pillars.map((p) => ({
          number: p.number || "",
          title: p.title || "",
          body: p.body || "",
        }))
      : DEFAULT_PILLARS

  return (
    <section id="cuidados" className="relative bg-bg-deep px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="reveal grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-ink-dim">
              — Cómo trabajamos
            </p>
            <h2 className="font-display text-[clamp(2rem,1rem+2.6vw,3.5rem)] leading-[0.98] tracking-tightest text-ink">
              Una planta no es un{" "}
              <span className="italic text-moss">adorno</span>.<br />
              Es un compromiso.
            </h2>
            <p className="mt-7 max-w-md text-base leading-7 text-ink-soft">
              Por eso nos tomamos en serio cada parte del proceso — desde qué ejemplar elegimos
              hasta cómo llega a tu casa. Hacemos series cortas porque preferimos conocer bien
              lo que vendemos antes que tener catálogo infinito.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-7">
            {list.map((p, i) => (
              <div
                key={i}
                className="group relative rounded-[var(--r-lg)] border border-line-soft bg-bg p-6 transition-colors hover:border-line"
              >
                <span className="font-display text-3xl italic text-moss">{p.number}</span>
                <h3 className="mt-6 font-display text-xl text-ink">{p.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
