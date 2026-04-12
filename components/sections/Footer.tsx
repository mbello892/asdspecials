const COLS = [
  {
    title: "Catálogo",
    links: ["Plantas", "Macetas", "Velas", "Mesas (próximamente)"],
  },
  {
    title: "Ayuda",
    links: ["Cuidado de plantas", "Envíos", "Cambios y garantía", "Preguntas frecuentes"],
  },
  {
    title: "Casa",
    links: ["Historia", "Contacto", "Mayorista", "Instagram"],
  },
]

export function Footer() {
  return (
    <footer id="contacto" className="border-t border-line-soft bg-bg-deep px-6 pb-10 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <p className="font-display text-3xl tracking-tightest text-ink">
              asd<span className="italic text-moss">specials</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-ink-soft">
              Plantas y macetas de aluminio cepillado. Seleccionamos y enviamos a toda Argentina
              (excepto Tierra del Fuego) con el mismo cuidado con el que las elegimos.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-ink-dim">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line-soft pt-6 text-xs text-ink-dim md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} asdspecials — Todos los derechos reservados.</p>
          <p>Plantas sanas, macetas para toda la vida.</p>
        </div>
      </div>
    </footer>
  )
}
