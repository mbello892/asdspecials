import Link from "next/link"
import { Search, X } from "lucide-react"
import { Navbar } from "@/components/sections/Navbar"
import { Footer } from "@/components/sections/Footer"
import { ProductCard } from "@/components/shop/ProductCard"
import { SortDropdown } from "@/components/shop/SortDropdown"
import { getCategories, getProducts, type SortOption } from "@/lib/woocommerce"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Catálogo — ASD Specials",
}

const VALID_SORTS: SortOption[] = ["recent", "price-asc", "price-desc", "title-asc", "title-desc"]

type Params = {
  searchParams: Promise<{ c?: string; sort?: string; q?: string }>
}

export default async function CatalogoPage({ searchParams }: Params) {
  const { c: selectedSlug, sort: sortRaw, q: searchQuery } = await searchParams
  const sort: SortOption = VALID_SORTS.includes(sortRaw as SortOption)
    ? (sortRaw as SortOption)
    : "recent"

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: selectedSlug, sort, search: searchQuery }),
  ])

  const selectedCategory = selectedSlug
    ? categories.find((cat) => cat.slug === selectedSlug)
    : null

  function buildUrl(params: Record<string, string | undefined>) {
    const sp = new URLSearchParams()
    if (params.c ?? selectedSlug) sp.set("c", (params.c ?? selectedSlug)!)
    if (params.sort ?? (sort !== "recent" ? sort : undefined))
      sp.set("sort", (params.sort ?? sort)!)
    if (params.q ?? searchQuery) sp.set("q", (params.q ?? searchQuery)!)
    const qs = sp.toString()
    return `/catalogo${qs ? `?${qs}` : ""}`
  }

  return (
    <main className="relative">
      <Navbar />

      <section className="relative px-6 pb-24 pt-36 md:pt-44">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 border-b border-line-soft pb-8">
            <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-ink-dim">
              — Catálogo
            </p>
            <h1 className="font-display text-[clamp(2.5rem,1.5rem+3.6vw,5rem)] leading-[0.94] tracking-tightest text-ink">
              {searchQuery ? (
                <>
                  Resultados para{" "}
                  <span className="italic text-moss">&ldquo;{searchQuery}&rdquo;</span>
                </>
              ) : selectedCategory ? (
                <span className="italic text-moss">{selectedCategory.name}</span>
              ) : (
                <>
                  Todo el <span className="italic text-moss">catálogo</span>
                </>
              )}
            </h1>
            {selectedCategory?.description && !searchQuery && (
              <p className="mt-5 max-w-xl text-base leading-7 text-ink-soft">
                {selectedCategory.description}
              </p>
            )}
          </div>

          {/* Filtros + sort */}
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {searchQuery ? (
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-4 py-2 text-sm text-bg"
                >
                  <Search className="h-3.5 w-3.5" strokeWidth={1.8} />
                  &ldquo;{searchQuery}&rdquo;
                  <X className="h-3.5 w-3.5" strokeWidth={1.8} />
                </Link>
              ) : (
                <>
                  <Link
                    href="/catalogo"
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      !selectedSlug
                        ? "border-ink bg-ink text-bg"
                        : "border-line text-ink-soft hover:border-ink hover:text-ink"
                    }`}
                  >
                    Todo
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/catalogo?c=${cat.slug}${sort !== "recent" ? `&sort=${sort}` : ""}`}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        selectedSlug === cat.slug
                          ? "border-ink bg-ink text-bg"
                          : "border-line text-ink-soft hover:border-ink hover:text-ink"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.14em] text-ink-dim">
                {products.length} {products.length === 1 ? "producto" : "productos"}
              </span>
              <SortDropdown
                current={sort}
                baseUrl={buildUrl({ sort: undefined })}
              />
            </div>
          </div>

          {/* Grilla */}
          {products.length === 0 ? (
            <div className="rounded-[var(--r-lg)] border border-dashed border-line bg-bg-deep p-14 text-center">
              <p className="font-display text-2xl text-ink">
                {searchQuery
                  ? "No encontramos resultados"
                  : "Aún no hay productos acá"}
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
                {searchQuery
                  ? `No hay productos que coincidan con "${searchQuery}". Probá con otro término.`
                  : selectedCategory
                    ? `No hay productos publicados en "${selectedCategory.name}" todavía.`
                    : "El catálogo está vacío por el momento."}
              </p>
              {searchQuery && (
                <Link
                  href="/catalogo"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-transform hover:-translate-y-[1px]"
                >
                  Ver todo el catálogo
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
