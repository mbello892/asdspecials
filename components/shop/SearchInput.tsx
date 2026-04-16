"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

export function SearchInput() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function handleOpen() {
    setOpen(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  function handleClose() {
    setOpen(false)
    setQuery("")
  }

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

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1">
      <div className="flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1.5">
        <Search className="h-4 w-4 shrink-0 text-ink-dim" strokeWidth={1.6} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos..."
          className="w-32 bg-transparent text-sm text-ink outline-none placeholder:text-ink-dim sm:w-44"
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
  )
}
