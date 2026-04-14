import Link from "next/link"
import type { Product } from "@/types/shop"
import { formatPrice } from "@/lib/format"

const FALLBACK =
  "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=900&q=80&auto=format&fit=crop"

function firstImageUrl(images: Product["images"]): string {
  return images?.[0]?.image?.url || FALLBACK
}

export function ProductCard({ product }: { product: Product }) {
  const img = firstImageUrl(product.images)
  const categoryName = product.category?.name ?? ""
  const soldOut = product.stock < 1
  const lowStock = !soldOut && product.stock <= 3

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group relative block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--r)] bg-bg-deep">
        <img
          src={img}
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-[var(--dur-slow)] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] ${
            soldOut ? "opacity-55 grayscale" : ""
          }`}
        />
        {lowStock && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-bg backdrop-blur">
            Últimas {product.stock}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {categoryName && (
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-dim">
              {categoryName}
            </p>
          )}
          <h3 className={`mt-0.5 truncate font-display text-lg leading-snug ${soldOut ? "text-ink-soft" : "text-ink"}`}>
            {product.name}
          </h3>
          {product.shortDescription && (
            <p className="mt-1 line-clamp-2 text-xs text-ink-soft">
              {product.shortDescription}
            </p>
          )}
        </div>
        {soldOut ? (
          <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-leather">
            Sin stock
          </p>
        ) : (
          <p className="shrink-0 font-display text-lg text-ink tabular-nums">
            {formatPrice(product.price)}
          </p>
        )}
      </div>
    </Link>
  )
}
