#!/usr/bin/env node
/**
 * Applies scripts/harden-supabase.sql against DATABASE_URI.
 *
 * Run after every Payload schema change:
 *   pnpm harden:db
 *
 * Idempotent — safe to re-run.
 */
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { config } from "dotenv"
import pg from "pg"

// Load .env.local explicitly so this script can be run standalone.
const here = dirname(fileURLToPath(import.meta.url))
config({ path: join(here, "..", ".env.local") })

const uri = process.env.DATABASE_URI
if (!uri) {
  console.error("✗ DATABASE_URI not set — check .env.local")
  process.exit(1)
}

const sql = readFileSync(join(here, "harden-supabase.sql"), "utf8")

const client = new pg.Client({ connectionString: uri })

try {
  await client.connect()
  console.log("→ Connected to Postgres, applying hardening…")
  const result = await client.query(sql)

  // The last statement in the SQL is an audit query — its result
  // lists any tables still missing RLS. Empty = all good.
  const audit = Array.isArray(result) ? result[result.length - 1] : result
  const unprotected = audit?.rows ?? []

  if (unprotected.length === 0) {
    console.log("✓ Hardening applied. All public tables have RLS enabled.")
  } else {
    console.warn(
      `⚠ ${unprotected.length} table(s) still have RLS disabled:`,
      unprotected.map((r) => r.table).join(", "),
    )
    process.exitCode = 1
  }
} catch (err) {
  console.error("✗ Failed:", err.message)
  process.exitCode = 1
} finally {
  await client.end()
}
