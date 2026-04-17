import Link from "next/link"
import { User } from "lucide-react"
import { CartNavButton } from "@/components/shop/CartNavButton"
import { SearchInput } from "@/components/shop/SearchInput"

const NAV = [
  { label: "Plantas", href: "/catalogo?c=plantas" },
  { label: "Macetas", href: "/catalogo?c=macetas-aluminio" },
  { label: "Velas", href: "/catalogo?c=velas-soja" },
  { label: "Mesas", href: "/catalogo?c=mesas-ratonas" },
]

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className="glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-5">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            alt=""
            className="h-9 w-9 rounded-sm object-contain invert"
          />
          <span className="font-display text-xl tracking-tightest text-ink">
asd <span className="italic text-moss">specials</span>
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
          <SearchInput />
          <button aria-label="Cuenta" className="rounded-full p-2 transition-colors hover:text-ink">
            <User className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </button>
          <CartNavButton />
        </div>
      </nav>
    </header>
  )
}
