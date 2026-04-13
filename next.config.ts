import type { NextConfig } from "next"
import { withPayload } from "@payloadcms/next/withPayload"

// Hosts extra que pueden acceder al dev server (además de localhost).
// Útil para probar desde el celular en la misma red WiFi.
// Leídos de NEXT_DEV_LAN_HOSTS en .env.local, separados por coma.
//   Ej: NEXT_DEV_LAN_HOSTS=10.10.10.102,192.168.1.20
const devLanHosts = (process.env.NEXT_DEV_LAN_HOSTS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)

const nextConfig: NextConfig = {
  allowedDevOrigins: devLanHosts,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
