import path from "path"
import { fileURLToPath } from "url"
import { buildConfig } from "payload"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import sharp from "sharp"

import { Users } from "./payload/collections/Users.ts"
import { Media } from "./payload/collections/Media.ts"
import { Categories } from "./payload/collections/Categories.ts"
import { Products } from "./payload/collections/Products.ts"
import { SiteContent } from "./payload/globals/SiteContent.ts"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// En Vercel, cada preview deployment tiene URL distinta por commit, así que
// leemos VERCEL_URL (deploy actual) y VERCEL_PROJECT_PRODUCTION_URL (prod fija)
// como fallback. NEXT_PUBLIC_APP_URL sigue teniendo prioridad si se setea.
const vercelUrls = [
  process.env.VERCEL_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_BRANCH_URL,
]
  .filter((v): v is string => Boolean(v))
  .map((host) => `https://${host}`)

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || vercelUrls[0] || "http://localhost:3000"

// Orígenes extra para acceso desde la LAN (celu, otras compus en la red).
// Leídos de NEXT_DEV_LAN_HOSTS en .env.local, separados por coma.
// Ej: NEXT_DEV_LAN_HOSTS=10.10.10.102,192.168.1.20
const lanOrigins = (process.env.NEXT_DEV_LAN_HOSTS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((host) => `http://${host}:3000`)

const ALLOWED_ORIGINS = Array.from(
  new Set([SITE_URL, ...vercelUrls, ...lanOrigins]),
)

export default buildConfig({
  // No seteamos `serverURL` a propósito — si lo hiciéramos, Payload lo
  // hornearía en el bundle del admin y las llamadas de API desde el celu
  // irían a `localhost:3000` (que desde el celu apunta a sí mismo, no al
  // dev server). Con serverURL ausente, el admin usa URLs relativas y
  // funciona igual en localhost, LAN y producción.
  cors: ALLOWED_ORIGINS,
  csrf: ALLOWED_ORIGINS,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " · asdspecials admin",
    },
  },
  collections: [Users, Media, Categories, Products],
  globals: [SiteContent],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload/payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
})
