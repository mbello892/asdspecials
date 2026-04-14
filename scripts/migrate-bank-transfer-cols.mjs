#!/usr/bin/env node
/**
 * Adds the bank_transfer_* columns to site_content and _site_content_v.
 * Runs idempotently (IF NOT EXISTS). Reads DATABASE_URI from .env.local.
 * One-shot: remove when Payload dev push is back on.
 */

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import pg from "pg"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envText = readFileSync(resolve(__dirname, "..", ".env.local"), "utf8")
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "")
}

const { DATABASE_URI } = process.env
if (!DATABASE_URI) {
  console.error("Missing DATABASE_URI in .env.local")
  process.exit(1)
}

const COLUMNS = [
  "bank_transfer_bank_name",
  "bank_transfer_account_holder",
  "bank_transfer_cbu",
  "bank_transfer_alias",
  "bank_transfer_cuit",
  "bank_transfer_discount_label",
]

const TABLES = ["site_content", "_site_content_v"]

const client = new pg.Client({ connectionString: DATABASE_URI })
await client.connect()
try {
  for (const table of TABLES) {
    for (const col of COLUMNS) {
      const colName = table === "_site_content_v" ? `version_${col}` : col
      const sql = `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${colName} varchar;`
      try {
        await client.query(sql)
        console.log(`  + ${table}.${colName}`)
      } catch (err) {
        console.warn(`  ! ${table}.${colName}: ${err.message}`)
      }
    }
  }
  console.log("✓ Migration complete.")
} finally {
  await client.end()
}
