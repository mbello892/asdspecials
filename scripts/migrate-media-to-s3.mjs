// Script one-shot: sube todos los archivos en ./media/ al bucket S3 de Supabase.
// Ejecutar con: node scripts/migrate-media-to-s3.mjs
//
// Los nombres de archivo se preservan tal cual (incluidos los variantes
// generadas por Payload como `-400x400.jpg`), así la DB ya apunta a las
// keys correctas sin necesidad de actualizar registros.
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const {
  S3_ENDPOINT,
  S3_REGION = "us-east-1",
  S3_BUCKET = "media",
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
} = process.env

if (!S3_ENDPOINT || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
  console.error("Faltan env vars S3_* en .env.local")
  process.exit(1)
}

const client = new S3Client({
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
})

const mimeByExt = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const mediaDir = path.resolve(__dirname, "..", "media")

const files = await readdir(mediaDir)
console.log(`Encontrados ${files.length} archivos en ${mediaDir}`)

let uploaded = 0
let skipped = 0
let failed = 0

for (const name of files) {
  const ext = path.extname(name).toLowerCase()
  const contentType = mimeByExt[ext] || "application/octet-stream"

  try {
    await client.send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: name }))
    console.log(`  skip ${name} (ya existe)`)
    skipped++
    continue
  } catch {}

  try {
    const body = await readFile(path.join(mediaDir, name))
    await client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: name,
        Body: body,
        ContentType: contentType,
      }),
    )
    console.log(`  ok   ${name}`)
    uploaded++
  } catch (err) {
    console.error(`  FAIL ${name}:`, err.message)
    failed++
  }
}

console.log(`\nResumen: ${uploaded} subidos, ${skipped} saltados, ${failed} fallidos`)
process.exit(failed > 0 ? 1 : 0)
