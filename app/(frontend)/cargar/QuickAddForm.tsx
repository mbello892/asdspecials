"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Camera, CheckCircle2, Loader2, Plus, X } from "lucide-react"
import type { Category } from "@payload-types"
import { slugify } from "@/lib/slugify"
import { formatPrice } from "@/lib/format"

type Status = "idle" | "uploading" | "done" | "error"

type PreviewImage = {
  file: File
  previewUrl: string
}

const LIGHT_OPTIONS = [
  { value: "", label: "— Sin especificar" },
  { value: "direct", label: "Luz directa" },
  { value: "bright-indirect", label: "Luz indirecta abundante" },
  { value: "medium", label: "Media sombra" },
  { value: "low", label: "Poca luz" },
]

const WATER_OPTIONS = [
  { value: "", label: "— Sin especificar" },
  { value: "low", label: "Poco riego" },
  { value: "medium", label: "Riego moderado" },
  { value: "high", label: "Riego frecuente" },
]

export function QuickAddForm({ categories }: { categories: Category[] }) {
  const [name, setName] = useState("")
  const [categoryId, setCategoryId] = useState<string>(
    categories[0] ? String(categories[0].id) : "",
  )
  const [price, setPrice] = useState<string>("")
  const [stock, setStock] = useState<string>("1")
  const [shortDescription, setShortDescription] = useState("")
  const [size, setSize] = useState("")
  const [light, setLight] = useState("")
  const [water, setWater] = useState("")

  const [images, setImages] = useState<PreviewImage[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [status, setStatus] = useState<Status>("idle")
  const [progressText, setProgressText] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [lastCreatedSlug, setLastCreatedSlug] = useState<string | null>(null)

  const slugPreview = useMemo(() => slugify(name) || "…", [name])

  // Revoke blob URLs on unmount or when images change
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList) return
    const fresh: PreviewImage[] = []
    for (const f of Array.from(fileList)) {
      if (!f.type.startsWith("image/")) continue
      fresh.push({ file: f, previewUrl: URL.createObjectURL(f) })
    }
    setImages((prev) => [...prev, ...fresh])
  }

  function removeImage(idx: number) {
    setImages((prev) => {
      const next = [...prev]
      const [removed] = next.splice(idx, 1)
      if (removed) URL.revokeObjectURL(removed.previewUrl)
      return next
    })
  }

  function resetForm() {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl))
    setImages([])
    setName("")
    setPrice("")
    setStock("1")
    setShortDescription("")
    setSize("")
    setLight("")
    setWater("")
    setProgressText("")
    setErrorMsg("")
  }

  async function uploadMedia(
    file: File,
    alt: string,
  ): Promise<number> {
    const fd = new FormData()
    fd.append("file", file)
    fd.append("_payload", JSON.stringify({ alt }))
    const res = await fetch("/api/media", { method: "POST", body: fd })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Upload falló: ${body.slice(0, 120)}`)
    }
    const data = await res.json()
    return data.doc?.id ?? data.id
  }

  async function createProduct(mediaIds: number[]): Promise<string> {
    const body = {
      name: name.trim(),
      category: Number(categoryId),
      shortDescription: shortDescription.trim() || undefined,
      price: Number(price),
      stock: Number(stock),
      status: "active" as const,
      featured: false,
      images: mediaIds.map((id) => ({ image: id })),
      plantCare:
        light || water || size
          ? {
              light: light || undefined,
              water: water || undefined,
              size: size.trim() || undefined,
            }
          : undefined,
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`Crear producto falló: ${errBody.slice(0, 200)}`)
    }
    const data = await res.json()
    return data.doc?.slug ?? data.slug
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg("")
    setLastCreatedSlug(null)

    if (!name.trim()) return setErrorMsg("Ponele un nombre al producto.")
    if (!categoryId) return setErrorMsg("Elegí una categoría.")
    if (!price || Number(price) <= 0)
      return setErrorMsg("El precio tiene que ser mayor a 0.")
    if (images.length === 0)
      return setErrorMsg("Agregá al menos una foto.")

    setStatus("uploading")
    try {
      const mediaIds: number[] = []
      for (let i = 0; i < images.length; i++) {
        setProgressText(`Subiendo foto ${i + 1} de ${images.length}…`)
        const id = await uploadMedia(images[i].file, `${name.trim()} — ${i + 1}`)
        mediaIds.push(id)
      }
      setProgressText("Creando producto…")
      const slug = await createProduct(mediaIds)
      setLastCreatedSlug(slug)
      setStatus("done")
      resetForm()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Algo falló")
      setStatus("error")
    }
  }

  const disabled = status === "uploading"

  return (
    <>
      {status === "done" && lastCreatedSlug && (
        <div className="mt-8 flex items-start gap-3 rounded-[var(--r-lg)] border border-moss/40 bg-moss/10 p-5">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-moss" strokeWidth={1.8} />
          <div className="flex-1">
            <p className="font-medium text-ink">Producto publicado</p>
            <p className="mt-1 text-sm text-ink-soft">
              Ya está en vivo en la tienda.{" "}
              <Link
                href={`/producto/${lastCreatedSlug}`}
                target="_blank"
                className="underline hover:text-moss"
              >
                Ver en la web
              </Link>{" "}
              ·{" "}
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="underline hover:text-moss"
              >
                Cargar otro
              </button>
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Fotos */}
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-ink-dim">
            Fotos
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFilesSelected(e.target.files)
              e.target.value = ""
            }}
          />

          {images.length === 0 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="flex aspect-[5/4] w-full flex-col items-center justify-center gap-3 rounded-[var(--r-lg)] border-2 border-dashed border-line bg-bg-deep transition-colors hover:border-ink disabled:opacity-50"
            >
              <Camera className="h-8 w-8 text-ink-soft" strokeWidth={1.5} />
              <span className="text-sm font-medium text-ink">Agregar fotos</span>
              <span className="px-8 text-center text-xs text-ink-dim">
                Desde la cámara, galería o archivos
              </span>
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-[var(--r)] bg-bg-deep"
                >
                  <img
                    src={img.previewUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    disabled={disabled}
                    aria-label="Quitar foto"
                    className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-ink/80 text-bg transition-colors hover:bg-ink"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 rounded-full bg-ink/80 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-bg">
                      Portada
                    </span>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="flex aspect-square items-center justify-center rounded-[var(--r)] border-2 border-dashed border-line text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
                aria-label="Agregar más"
              >
                <Plus className="h-6 w-6" strokeWidth={1.8} />
              </button>
            </div>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-ink-dim">
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={disabled}
            required
            placeholder="Ej: Monstera Deliciosa Variegada"
            className="w-full rounded-[var(--r)] border border-line bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-dim focus:border-ink focus:outline-none disabled:opacity-50"
          />
          <p className="mt-1.5 text-[11px] text-ink-dim">
            URL: <span className="font-mono text-ink-soft">/producto/{slugPreview}</span>
          </p>
        </div>

        {/* Categoría */}
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-ink-dim">
            Categoría
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={disabled}
            required
            className="w-full appearance-none rounded-[var(--r)] border border-line bg-surface px-4 py-3 text-base text-ink focus:border-ink focus:outline-none disabled:opacity-50"
          >
            {categories.length === 0 && <option value="">(Sin categorías cargadas)</option>}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Precio + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-ink-dim">
              Precio (ARS)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              step="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={disabled}
              required
              placeholder="8900"
              className="w-full rounded-[var(--r)] border border-line bg-surface px-4 py-3 text-base tabular-nums text-ink placeholder:text-ink-dim focus:border-ink focus:outline-none disabled:opacity-50"
            />
            {price && Number(price) > 0 && (
              <p className="mt-1.5 text-[11px] text-ink-dim">{formatPrice(Number(price))}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-ink-dim">
              Stock
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              disabled={disabled}
              required
              className="w-full rounded-[var(--r)] border border-line bg-surface px-4 py-3 text-base tabular-nums text-ink focus:border-ink focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Descripción corta */}
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-ink-dim">
            Descripción corta
          </label>
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            disabled={disabled}
            rows={3}
            placeholder="Una o dos líneas que aparecen en el catálogo."
            className="w-full rounded-[var(--r)] border border-line bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-dim focus:border-ink focus:outline-none disabled:opacity-50"
          />
        </div>

        {/* Avanzados (colapsable) */}
        <details className="group rounded-[var(--r)] border border-line-soft bg-surface/50">
          <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-ink">
            Más detalles (tamaño, luz, riego)
            <span className="text-xs text-ink-dim group-open:hidden">+ mostrar</span>
            <span className="hidden text-xs text-ink-dim group-open:inline">− ocultar</span>
          </summary>
          <div className="space-y-4 border-t border-line-soft px-4 pb-4 pt-4">
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-ink-dim">
                Tamaño
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                disabled={disabled}
                placeholder="Ej: 60–80 cm"
                className="w-full rounded-[var(--r)] border border-line bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-dim focus:border-ink focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-ink-dim">
                Luz
              </label>
              <select
                value={light}
                onChange={(e) => setLight(e.target.value)}
                disabled={disabled}
                className="w-full appearance-none rounded-[var(--r)] border border-line bg-surface px-4 py-3 text-base text-ink focus:border-ink focus:outline-none disabled:opacity-50"
              >
                {LIGHT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-ink-dim">
                Riego
              </label>
              <select
                value={water}
                onChange={(e) => setWater(e.target.value)}
                disabled={disabled}
                className="w-full appearance-none rounded-[var(--r)] border border-line bg-surface px-4 py-3 text-base text-ink focus:border-ink focus:outline-none disabled:opacity-50"
              >
                {WATER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </details>

        {/* Error */}
        {errorMsg && (
          <div className="rounded-[var(--r)] border border-leather/40 bg-leather/10 px-4 py-3 text-sm text-leather">
            {errorMsg}
          </div>
        )}

        {/* Progress */}
        {status === "uploading" && (
          <div className="flex items-center gap-3 rounded-[var(--r)] border border-line bg-bg-deep px-4 py-3 text-sm text-ink-soft">
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" strokeWidth={2} />
            {progressText}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={disabled}
          className="sticky bottom-4 z-10 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-medium text-bg shadow-[0_10px_30px_-10px_oklch(16%_0.010_60/0.40)] transition-transform hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {disabled ? "Publicando…" : "Publicar producto"}
        </button>
      </form>
    </>
  )
}
