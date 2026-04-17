"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowDownUp, Check, ChevronDown } from "lucide-react"
import type { SortOption } from "@/lib/woocommerce"

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recent", label: "Más recientes" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "title-asc", label: "A → Z" },
  { value: "title-desc", label: "Z → A" },
]

export function SortDropdown({
  current,
  baseUrl,
}: {
  current: SortOption
  baseUrl: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  function select(value: SortOption) {
    setOpen(false)
    const url = new URL(baseUrl, window.location.origin)
    if (value === "recent") {
      url.searchParams.delete("sort")
    } else {
      url.searchParams.set("sort", value)
    }
    router.push(url.pathname + url.search)
  }

  const currentLabel = OPTIONS.find((o) => o.value === current)?.label ?? "Ordenar"

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-ink"
      >
        <ArrowDownUp className="h-3.5 w-3.5 text-ink-dim" strokeWidth={1.8} />
        {currentLabel}
        <ChevronDown
          className={`h-3.5 w-3.5 text-ink-dim transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.8}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-[var(--r)] border border-line bg-surface-wood shadow-lg">
          {OPTIONS.map((opt) => {
            const active = opt.value === current
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => select(opt.value)}
                className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm transition-colors ${
                  active
                    ? "bg-bg-deep text-ink"
                    : "text-ink-soft hover:bg-bg-deep hover:text-ink"
                }`}
              >
                {opt.label}
                {active && <Check className="h-3.5 w-3.5 text-moss" strokeWidth={2} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
