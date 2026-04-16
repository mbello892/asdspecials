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

const FALLBACK_SITE_CONTENT: SiteContent = {
  id: 0,
  hero: {
    headline: "",
  },
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const p = await payload()
    return p.findGlobal({ slug: "site-content", depth: 2 })
  } catch (err) {
    console.warn("[Payload] getSiteContent failed, returning fallback:", err)
    return FALLBACK_SITE_CONTENT
  }
}
