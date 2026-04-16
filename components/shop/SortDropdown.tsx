"use client"

import { useRouter } from "next/navigation"
import { ArrowDownUp } from "lucide-react"
import type { SortOption } from "@/lib/woocommerce"

const LABELS: Record<SortOption, string> = {
  recent: "Más recientes",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
  "title-asc": "Nombre: A → Z",
  "title-desc": "Nombre: Z → A",
}

export function SortDropdown({
  current,
  baseUrl,
}: {
  current: SortOption
  baseUrl: string
}) {
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as SortOption
    const url = new URL(baseUrl, window.location.origin)
    if (value === "recent") {
      url.searchParams.delete("sort")
    } else {
      url.searchParams.set("sort", value)
    }
    router.push(url.pathname + url.search)
  }

  return (
    <div className="relative inline-flex items-center gap-2">
      <ArrowDownUp className="h-3.5 w-3.5 text-ink-dim" strokeWidth={1.8} />
      <select
        value={current}
        onChange={handleChange}
        className="appearance-none bg-transparent pr-5 text-sm text-ink outline-none cursor-pointer"
      >
        {(Object.entries(LABELS) as [SortOption, string][]).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
