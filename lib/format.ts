/**
 * Client-safe formatters.
 * Do NOT import anything from `lib/payload.ts` here — that file
 * pulls in server-only Payload code (node:fs etc.) and would
 * break client bundles.
 */

export function formatPrice(amount: number): string {
  return `$ ${new Intl.NumberFormat("es-AR").format(amount)}`
}
