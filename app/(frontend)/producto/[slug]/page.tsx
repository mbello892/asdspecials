import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Product } from "@/types/shop"
import { Navbar } from "@/components/sections/Navbar"
import { Footer } from "@/components/sections/Footer"
import { AddToCartButton } from "@/components/shop/AddToCartButton"
import { getProductBySlug } from "@/lib/woocommerce"
import { formatPrice } from "@/lib/format"

export const dynamic = "force-dynamic"

const FALLBACK =
  "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=1100&q=80&auto=format&fit=crop"

function resolveImages(images: Product["images"]): string[] {
  if (!images?.length) return [FALLBACK]
  const urls = images.map((i) => i.image?.url).filter((u): u is string => Boolean(u))
  return urls.length > 0 ? urls : [FALLBACK]
}

const LIGHT_LABEL: Record<string, string> = {
  direct: "Luz directa",
  "bright-indirect": "Luz indirecta abundante",
  medium: "Media sombra",
  low: "Poca luz",
}

const WATER_LABEL: Record<string, string> = {
  low: "Riego bajo",
  medium: "Riego moderado",
  high: "Riego frecuente",
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Producto no encontrado — ASD Specials" }
  return {
    title: `${product.name} — ASD Specials`,
    description: product.shortDescription || undefined,
  }
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || product.status !== "active") notFound()

  const images = resolveImages(product.images)
  const categoryName = product.category?.name ?? ""
  const categorySlug = product.category?.slug ?? ""

  const soldOut = product.stock === 0

  return (
    <main className="relative">
      <Navbar />

      <section className="relative px-6 pb-28 pt-36 md:pt-44">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-dim">
            <Link href="/catalogo" className="transition-colors hover:text-ink">
              Catálogo
            </Link>
            {categoryName && categorySlug && (
              <>
                <span>/</span>
                <Link
                  href={`/catalogo?c=${categorySlug}`}
                  className="transition-colors hover:text-ink"
                >
                  {categoryName}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-ink-soft">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Galería */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--r-lg)] bg-bg-deep">
                <img
                  src={images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {images.slice(1, 5).map((url, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-[var(--r-sm)] bg-bg-deep"
                    >
                      <img
                        src={url}
                        alt={`${product.name} ${i + 2}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info + CTA */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
              {categoryName && (
                <p className="text-[11px] uppercase tracking-[0.22em] text-ink-dim">
                  {categoryName}
                </p>
              )}
              <h1 className="mt-2 font-display text-[clamp(2rem,1rem+2.4vw,3.25rem)] leading-[0.98] tracking-tightest text-ink">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="mt-5 text-base leading-7 text-ink-soft">
                  {product.shortDescription}
                </p>
              )}

              {/* Especificaciones */}
              {(product.plantCare?.light ||
                product.plantCare?.water ||
                product.plantCare?.size ||
                product.potSpecs?.diameter ||
                product.potSpecs?.height ||
                product.potSpecs?.material) && (
                <ul className="mt-8 space-y-3 border-l border-line-soft pl-5 text-sm text-ink-soft">
                  {product.plantCare?.size && (
                    <li>
                      <span className="font-medium text-ink">Tamaño</span> —{" "}
                      {product.plantCare.size}
                    </li>
                  )}
                  {product.plantCare?.light && (
                    <li>
                      <span className="font-medium text-ink">Luz</span> —{" "}
                      {LIGHT_LABEL[product.plantCare.light] || product.plantCare.light}
                    </li>
                  )}
                  {product.plantCare?.water && (
                    <li>
                      <span className="font-medium text-ink">Riego</span> —{" "}
                      {WATER_LABEL[product.plantCare.water] || product.plantCare.water}
                    </li>
                  )}
                  {product.potSpecs?.material && (
                    <li>
                      <span className="font-medium text-ink">Material</span> —{" "}
                      {product.potSpecs.material}
                    </li>
                  )}
                  {product.potSpecs?.diameter && (
                    <li>
                      <span className="font-medium text-ink">Diámetro</span> —{" "}
                      {product.potSpecs.diameter} cm
                    </li>
                  )}
                  {product.potSpecs?.height && (
                    <li>
                      <span className="font-medium text-ink">Altura</span> —{" "}
                      {product.potSpecs.height} cm
                    </li>
                  )}
                </ul>
              )}

              <div className="mt-10 flex items-end justify-between gap-6 border-t border-line-soft pt-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-ink-dim">Precio</p>
                  {product.compareAtPrice &&
                    product.compareAtPrice > product.price && (
                      <p className="text-sm text-ink-dim line-through">
                        {formatPrice(product.compareAtPrice)}
                      </p>
                    )}
                  <p className="mt-1 font-display text-3xl text-ink">
                    {formatPrice(product.price)}
                  </p>
                  <p className="mt-1 text-xs text-ink-dim">
                    {soldOut
                      ? "Sin stock"
                      : product.stock <= 3
                        ? `Quedan ${product.stock}`
                        : `Stock disponible`}
                  </p>
                </div>
                <AddToCartButton product={product} />
              </div>

              <Link
                href="/catalogo"
                className="mt-10 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-ink"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
                Volver al catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
