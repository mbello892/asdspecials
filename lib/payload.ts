import "server-only"
import { getPayload } from "payload"
import config from "@payload-config"
import type { SiteContent } from "@payload-types"

/**
 * Server-side access to Payload (editorial content only).
 * Product catalog now lives in WooCommerce — see lib/woocommerce.ts.
 */

async function payload() {
  return getPayload({ config })
}

export async function getSiteContent(): Promise<SiteContent> {
  const p = await payload()
  return p.findGlobal({ slug: "site-content", depth: 2 })
}
