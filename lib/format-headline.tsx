import { Fragment } from "react"

/**
 * Parses a headline where asterisks denote emphasis, e.g.:
 *   "Plantas elegidas. Macetas que las *sostienen*."
 * Becomes:
 *   Plantas elegidas. Macetas que las <em class="italic text-moss">sostienen</em>.
 *
 * Line breaks in the source string become <br />.
 */
export function formatHeadline(input: string) {
  const lines = input.split("\n")
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean)
    return (
      <Fragment key={lineIdx}>
        {parts.map((part, i) => {
          const match = part.match(/^\*([^*]+)\*$/)
          if (match) {
            return (
              <span key={i} className="italic text-moss">
                {match[1]}
              </span>
            )
          }
          return <Fragment key={i}>{part}</Fragment>
        })}
        {lineIdx < lines.length - 1 && <br />}
      </Fragment>
    )
  })
}
