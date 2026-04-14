import Link from "next/link"
import { Navbar } from "@/components/sections/Navbar"
import { Footer } from "@/components/sections/Footer"
import { ProductCard } from "@/components/shop/ProductCard"
import { getCategories, getProducts } from "@/lib/woocommerce"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Catálogo — asdspecials",
}

type Params = {
  searchParams: Promise<{ c?: string }>
}

export default async function CatalogoPage({ searchParams }: Params) {
  const { c: selectedSlug } = await searchParams
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: selectedSlug }),
  ])

  const selectedCategory = selectedSlug
    ? categories.find((cat) => cat.slug === selectedSlug)
    : null

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
              {selectedCategory ? (
                <>
                  <span className="italic text-moss">{selectedCategory.name}</span>
                </>
              ) : (
                <>
                  Todo el <span className="italic text-moss">catálogo</span>
                </>
              )}
            </h1>
            {selectedCategory?.description && (
              <p className="mt-5 max-w-xl text-base leading-7 text-ink-soft">
                {selectedCategory.description}
              </p>
            )}
          </div>

          {/* Filtros de categoría */}
          <div className="mb-12 flex flex-wrap items-center gap-2">
            <Link
              href="/catalogo"
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                !selectedSlug
                  ? "border-ink bg-ink text-bg"
                  : "border-line text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              Todo ({products.length})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogo?c=${cat.slug}`}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  selectedSlug === cat.slug
                    ? "border-ink bg-ink text-bg"
                    : "border-line text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Grilla */}
          {products.length === 0 ? (
            <div className="rounded-[var(--r-lg)] border border-dashed border-line bg-bg-deep p-14 text-center">
              <p className="font-display text-2xl text-ink">Aún no hay productos acá</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
                {selectedCategory
                  ? `No hay productos publicados en "${selectedCategory.name}" todavía.`
                  : "Cargá el primero desde el admin en /admin/collections/products"}
              </p>
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
