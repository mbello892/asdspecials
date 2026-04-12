import Link from "next/link"
import { Search, ShoppingBag, User } from "lucide-react"

const NAV = [
  { label: "Plantas", href: "#plantas" },
  { label: "Macetas", href: "#macetas" },
  { label: "Velas", href: "#velas" },
  { label: "Cuidados", href: "#cuidados" },
]

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className="glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl tracking-tightest text-ink">
            asd<span className="italic text-moss">specials</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-[13px] font-medium tracking-wide text-ink-soft transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 text-ink-soft">
          <button aria-label="Buscar" className="rounded-full p-2 transition-colors hover:text-ink">
            <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </button>
          <button aria-label="Cuenta" className="rounded-full p-2 transition-colors hover:text-ink">
            <User className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </button>
          <button
            aria-label="Bolsa"
            className="relative rounded-full p-2 transition-colors hover:text-ink"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-moss" />
          </button>
        </div>
      </nav>
    </header>
  )
}
