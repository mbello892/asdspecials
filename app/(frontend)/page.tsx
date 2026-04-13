import { HomeLive } from "@/components/sections/HomeLive"
import { getSiteContent } from "@/lib/payload"

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const dynamic = "force-dynamic"

export default async function Home() {
  const initialContent = await getSiteContent()
  return <HomeLive initialContent={initialContent} serverURL={SITE_URL} />
}
