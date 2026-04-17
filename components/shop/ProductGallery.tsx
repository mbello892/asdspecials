"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

type Props = {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const prev = useCallback(
    () => setActive((i) => (i - 1 + images.length) % images.length),
    [images.length],
  )
  const next = useCallback(
    () => setActive((i) => (i + 1) % images.length),
    [images.length],
  )

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false)
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox, prev, next])

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [lightbox])

  return (
    <>
      {/* Imagen principal */}
      <div
        className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[var(--r-lg)] bg-bg-deep"
        onClick={() => setLightbox(true)}
      >
        <img
          src={images[active]}
          alt={`${name} — foto ${active + 1}`}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        <div className="absolute bottom-3 right-3 rounded-full bg-bg/60 p-1.5 backdrop-blur-sm">
          <ZoomIn className="h-4 w-4 text-ink" strokeWidth={1.5} />
        </div>
        {images.length > 1 && (
          <>
            <button
              aria-label="Foto anterior"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-bg/60 p-2 backdrop-blur-sm transition-colors hover:bg-bg/90"
            >
              <ChevronLeft className="h-4 w-4 text-ink" strokeWidth={1.5} />
            </button>
            <button
              aria-label="Foto siguiente"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-bg/60 p-2 backdrop-blur-sm transition-colors hover:bg-bg/90"
            >
              <ChevronRight className="h-4 w-4 text-ink" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((url, i) => (
            <button
              key={i}
              aria-label={`Ver foto ${i + 1}`}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-[var(--r-sm)] bg-bg-deep transition-all duration-200 ${
                active === i
                  ? "opacity-100 ring-2 ring-ink"
                  : "opacity-45 hover:opacity-75"
              }`}
            >
              <img
                src={url}
                alt={`${name} — miniatura ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-deep/96 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <button
            aria-label="Cerrar"
            className="absolute right-5 top-5 rounded-full bg-surface p-2 text-ink transition-colors hover:bg-line"
            onClick={() => setLightbox(false)}
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>

          {images.length > 1 && (
            <>
              <button
                aria-label="Foto anterior"
                className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-surface p-3 text-ink transition-colors hover:bg-line"
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button
                aria-label="Foto siguiente"
                className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-surface p-3 text-ink transition-colors hover:bg-line"
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </>
          )}

          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[active]}
              alt={`${name} — foto ${active + 1}`}
              className="max-h-[90vh] max-w-[90vw] rounded-[var(--r)] object-contain"
            />
            {images.length > 1 && (
              <p className="mt-3 text-center text-xs text-ink-dim">
                {active + 1} / {images.length}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
