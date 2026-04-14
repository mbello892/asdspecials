/**
 * Shared shop types. Data layer (lib/woocommerce.ts) normalizes
 * WooCommerce REST responses to these shapes so UI components
 * don't care where the data comes from.
 */

export type Media = {
  url: string
  alt?: string | null
}

export type Category = {
  id: number
  name: string
  slug: string
  description?: string | null
  image?: Media | null
}

export type ProductImage = {
  id: number
  image: Media
}

export type ProductStatus = "active" | "draft" | "hidden"

export type PlantCare = {
  light?: string | null
  water?: string | null
  size?: string | null
}

export type PotSpecs = {
  material?: string | null
  diameter?: number | null
  height?: number | null
  withStand?: boolean | null
}

export type Product = {
  id: number
  name: string
  slug: string
  shortDescription?: string | null
  description?: string | null
  price: number
  compareAtPrice?: number | null
  stock: number
  status: ProductStatus
  featured: boolean
  category: Category | null
  images: ProductImage[]
  plantCare?: PlantCare | null
  potSpecs?: PotSpecs | null
}
