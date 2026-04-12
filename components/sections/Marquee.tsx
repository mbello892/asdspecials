const ITEMS = [
  "Monstera Variegada",
  "Aluminio cepillado",
  "Plantas sanas garantizadas",
  "Envío cuidado",
  "Series limitadas",
  "Velas de autor",
  "Próximamente · Mesas de living",
]

export function Marquee() {
  return (
    <section className="border-y border-line-soft bg-bg-deep py-7">
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-14">
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <div key={i} className="flex items-center gap-14">
              <span className="whitespace-nowrap font-display text-2xl italic text-ink-soft">
                {item}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-moss/70" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
