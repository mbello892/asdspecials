import { ArrowUpRight } from "lucide-react"

export function FeaturedProduct() {
  return (
    <section className="relative px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-12">
        <div className="reveal relative order-2 lg:order-1 lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--r-lg)] bg-bg-deep">
            <img
              src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=1100&q=80&auto=format&fit=crop"
              alt="Monstera Deliciosa Variegada, ejemplar adulto"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="glass absolute -right-3 top-6 hidden flex-col items-center rounded-full px-4 py-5 md:flex">
            <span className="text-[10px] uppercase tracking-[0.18em] text-ink-dim">Quedan</span>
            <span className="font-display text-xl text-ink">03</span>
          </div>
        </div>

        <div className="reveal-slow order-1 lg:order-2 lg:col-span-6 lg:pl-6">
          <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-ink-dim">
            — Planta del mes
          </p>
          <h2 className="font-display text-[clamp(2rem,1rem+2.6vw,3.5rem)] leading-[0.98] tracking-tightest text-ink">
            Monstera <span className="italic text-moss">Variegada</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-ink-soft">
            Cada hoja es un mapa único de verde y blanco. Seleccionamos ejemplares adultos,
            aclimatados en nuestro vivero durante meses, listos para entrar directo a tu casa
            sin drama de adaptación.
          </p>

          <ul className="mt-8 space-y-3 border-l border-line-soft pl-5 text-sm text-ink-soft">
            <li>
              <span className="font-medium text-ink">Ejemplar</span> — adulto, 60–80 cm
            </li>
            <li>
              <span className="font-medium text-ink">Maceta incluida</span> — aluminio cepillado Ø 22 cm
            </li>
            <li>
              <span className="font-medium text-ink">Cuidado</span> — luz indirecta abundante, riego moderado
            </li>
            <li>
              <span className="font-medium text-ink">Garantía</span> — reposición si no prende en 30 días
            </li>
          </ul>

          <div className="mt-10 flex items-end justify-between gap-6 border-t border-line-soft pt-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-dim">Precio</p>
              <p className="mt-1 font-display text-3xl text-ink">$ 8.900</p>
              <p className="text-xs text-ink-dim">maceta incluida</p>
            </div>
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-bg transition-transform hover:-translate-y-[1px]"
            >
              Reservar
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.8}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
