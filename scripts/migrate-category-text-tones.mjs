#!/usr/bin/env node
/**
 * Creates array tables for SiteContent.categoryTextTones:
 *   - site_content_category_text_tones
 *   - _site_content_v_version_category_text_tones
 *
 * Mirrors the schema Payload/drizzle creates for other arrays
 * (site_content_pillars, _site_content_v_version_pillars).
 * Idempotent: uses IF NOT EXISTS everywhere.
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

const statements = [
  // Published table — id is varchar (Payload generates nanoids on save)
  `CREATE TABLE IF NOT EXISTS site_content_category_text_tones (
     _order integer NOT NULL,
     _parent_id integer NOT NULL,
     id varchar NOT NULL,
     slug varchar,
     tone varchar DEFAULT 'dark',
     CONSTRAINT site_content_category_text_tones_pkey PRIMARY KEY (id),
     CONSTRAINT site_content_category_text_tones_parent_id_fk
       FOREIGN KEY (_parent_id) REFERENCES site_content(id) ON DELETE CASCADE
   );`,
  `CREATE INDEX IF NOT EXISTS site_content_category_text_tones_order_idx
     ON site_content_category_text_tones USING btree (_order);`,
  `CREATE INDEX IF NOT EXISTS site_content_category_text_tones_parent_id_idx
     ON site_content_category_text_tones USING btree (_parent_id);`,

  // Versioned table — id is serial integer, plus _uuid varchar
  `CREATE TABLE IF NOT EXISTS _site_content_v_version_category_text_tones (
     _order integer NOT NULL,
     _parent_id integer NOT NULL,
     id serial PRIMARY KEY,
     slug varchar,
     tone varchar DEFAULT 'dark',
     _uuid varchar,
     CONSTRAINT _site_content_v_version_category_text_tones_parent_id_fk
       FOREIGN KEY (_parent_id) REFERENCES _site_content_v(id) ON DELETE CASCADE
   );`,
  `CREATE INDEX IF NOT EXISTS _site_content_v_version_category_text_tones_order_idx
     ON _site_content_v_version_category_text_tones USING btree (_order);`,
  `CREATE INDEX IF NOT EXISTS _site_content_v_version_category_text_tones_parent_id_idx
     ON _site_content_v_version_category_text_tones USING btree (_parent_id);`,
]

const client = new pg.Client({ connectionString: DATABASE_URI })
await client.connect()
try {
  for (const sql of statements) {
    try {
      await client.query(sql)
      console.log("  + " + sql.split("\n")[0])
    } catch (err) {
      console.warn("  ! " + err.message)
    }
  }
  console.log("✓ Migration complete.")
} finally {
  await client.end()
}
