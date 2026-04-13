/**
 * Converts a human-readable name into a URL-safe slug.
 * Client-safe — no deps.
 *
 *   "Monstera Deliciosa Variegada" → "monstera-deliciosa-variegada"
 *   "Jarrón de Cerámica · Ø18"     → "jarron-de-ceramica-18"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics (tildes, eñe, etc.)
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens
    .slice(0, 80)
}
