import { getPayload } from "payload"
import config from "@payload-config"
import type { SiteContent } from "@payload-types"

/**
 * Server-side access to Payload via local API.
 * Only import from Server Components, API routes, or server actions.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: "site-content", depth: 2 })
}
