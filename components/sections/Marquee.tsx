type MarqueeItem = { label?: string | null; id?: string | null }

const DEFAULTS: { label: string }[] = [
  { label: "Monstera Variegada" },
  { label: "Aluminio cepillado" },
  { label: "Plantas sanas garantizadas" },
  { label: "Envío cuidado" },
  { label: "Series limitadas" },
  { label: "Velas de autor" },
  { label: "Próximamente · Mesas de living" },
]

export function Marquee({ items }: { items?: MarqueeItem[] | null }) {
  const list =
    items && items.length > 0
      ? items.map((it) => ({ label: it.label || "" })).filter((it) => it.label)
      : DEFAULTS

  return (
    <section className="border-y border-line-soft bg-bg-deep py-7">
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-14">
          {[...list, ...list].map((item, i) => (
            <div key={i} className="flex items-center gap-14">
              <span className="whitespace-nowrap font-display text-2xl italic text-ink-soft">
                {item.label}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-moss/70" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
