import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Product } from "@/types/shop"
import { formatPrice } from "@/lib/format"

function firstImageUrl(images: Product["images"]): string | null {
  return images?.[0]?.image?.url ?? null
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=1100&q=80&auto=format&fit=crop"

export function FeaturedProduct({ product }: { product: Product | null }) {
  // Fallback visual if no featured product exists yet
  if (!product) {
    return (
      <section className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl rounded-[var(--r-lg)] border border-dashed border-line bg-surface-wood p-14 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ink-dim">— Planta del mes</p>
          <h2 className="mt-4 font-display text-3xl leading-[0.98] tracking-tightest text-ink">
            Marcá un producto como <span className="italic text-moss">destacado</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink-soft">
            Entrá al admin, abrí cualquier producto, tocá el checkbox "Destacado en la home"
            y guardá. Va a aparecer acá.
          </p>
        </div>
      </section>
    )
  }

  const imgUrl = firstImageUrl(product.images) || FALLBACK_IMAGE
  const categoryName = product.category?.name ?? "Producto"

  return (
    <section className="relative px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-12">
        <div className="reveal relative order-2 lg:order-1 lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--r-lg)] bg-bg-deep">
            <img src={imgUrl} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {product.stock > 0 && product.stock <= 10 && (
            <div className="glass absolute -right-3 top-6 hidden flex-col items-center rounded-full px-4 py-5 md:flex">
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink-dim">Quedan</span>
              <span className="font-display text-xl text-ink">
                {String(product.stock).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>

        <div className="reveal-slow order-1 lg:order-2 lg:col-span-6 lg:pl-6">
          <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-ink-dim">
            — {categoryName} destacada
          </p>
          <h2 className="font-display text-[clamp(2rem,1rem+2.6vw,3.5rem)] leading-[0.98] tracking-tightest text-ink">
            {product.name}
          </h2>
          {product.shortDescription && (
            <p className="mt-6 max-w-md text-base leading-7 text-ink-soft">
              {product.shortDescription}
            </p>
          )}

          {(product.plantCare?.size || product.potSpecs?.diameter) && (
            <ul className="mt-8 space-y-3 border-l border-line-soft pl-5 text-sm text-ink-soft">
              {product.plantCare?.size && (
                <li>
                  <span className="font-medium text-ink">Tamaño</span> —{" "}
                  {product.plantCare.size}
                </li>
              )}
              {product.potSpecs?.diameter && (
                <li>
                  <span className="font-medium text-ink">Diámetro</span> —{" "}
                  {product.potSpecs.diameter} cm
                </li>
              )}
            </ul>
          )}

          <div className="mt-10 flex items-end justify-between gap-6 border-t border-line-soft pt-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-dim">Precio</p>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <p className="text-sm text-ink-dim line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}
              <p className="mt-1 font-display text-3xl text-ink">
                {formatPrice(product.price)}
              </p>
            </div>
            <Link
              href={`/producto/${product.slug}`}
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-bg transition-transform hover:-translate-y-[1px]"
            >
              Ver pieza
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
