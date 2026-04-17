"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { formatPrice } from "@/lib/format"

type Hit = {
  id: number
  name: string
  slug: string
  price: number
  image: string | null
  stock: number
}

export function SearchInput() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [hits, setHits] = useState<Hit[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleOpen = useCallback(() => {
    setOpen(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    setQuery("")
    setHits([])
  }, [])

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setHits([])
      setLoading(false)
      return
    }
    const ctrl = new AbortController()
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        })
        if (!res.ok) throw new Error(`${res.status}`)
        const data = (await res.json()) as { items: Hit[] }
        setHits(data.items)
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setHits([])
        }
      } finally {
        setLoading(false)
      }
    }, 220)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [query])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose()
    }
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) handleClose()
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("mousedown", onClick)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("mousedown", onClick)
    }
  }, [open, handleClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/catalogo?q=${encodeURIComponent(q)}`)
    handleClose()
  }

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        aria-label="Buscar"
        className="rounded-full p-2 text-ink-soft transition-colors hover:text-ink"
      >
        <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
      </button>
    )
  }

  const showDropdown = query.trim().length >= 2
  const qTrim = query.trim()

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-1">
        <div className="flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1.5">
          <Search className="h-4 w-4 shrink-0 text-ink-dim" strokeWidth={1.6} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="w-40 bg-transparent text-sm text-ink outline-none placeholder:text-ink-dim sm:w-56"
          />
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar búsqueda"
            className="rounded-full p-0.5 text-ink-dim transition-colors hover:text-ink"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>
      </form>

      {showDropdown && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(92vw,380px)] overflow-hidden rounded-[var(--r)] border border-line bg-surface-concrete shadow-xl">
          {loading && hits.length === 0 && (
            <p className="px-4 py-5 text-center text-xs uppercase tracking-[0.18em] text-ink-dim">
              Buscando…
            </p>
          )}

          {!loading && hits.length === 0 && (
            <p className="px-4 py-5 text-center text-sm text-ink-soft">
              Sin resultados para <span className="text-ink">“{qTrim}”</span>
            </p>
          )}

          {hits.length > 0 && (
            <ul className="max-h-[60vh] divide-y divide-line-soft overflow-y-auto">
              {hits.map((h) => (
                <li key={h.id}>
                  <Link
                    href={`/producto/${h.slug}`}
                    onClick={handleClose}
                    className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-line-soft"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[var(--r-sm)] bg-bg-deep">
                      {h.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={h.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink">{h.name}</p>
                      <p className="mt-0.5 text-xs tabular-nums text-ink-soft">
                        {formatPrice(h.price)}
                        {h.stock <= 0 && (
                          <span className="ml-2 text-ink-dim">· Agotado</span>
                        )}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {hits.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                handleSubmit(e)
              }}
              className="block w-full border-t border-line-soft px-4 py-3 text-left text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:bg-line-soft hover:text-ink"
            >
              Ver todos los resultados para “{qTrim}” →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
