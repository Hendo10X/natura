/**
 * Drops the Neon Postgres `public` schema and recreates it empty.
 *
 * Why: when collection schemas change a lot, Payload's push mode and the
 * seed are easier to reason about against a clean slate. This is the
 * dev-time "start over" button.
 *
 * Usage:  bun run reset:db
 */

import "dotenv/config"
import { Client } from "pg"

async function main() {
  const connectionString = process.env.DATABASE_URI
  if (!connectionString) {
    console.error("DATABASE_URI is not set in .env")
    process.exit(1)
  }

  const client = new Client({ connectionString })
  await client.connect()
  try {
    console.log("Dropping schema public…")
    await client.query("DROP SCHEMA IF EXISTS public CASCADE")
    await client.query("CREATE SCHEMA public")
    await client.query("GRANT ALL ON SCHEMA public TO public")
    console.log("✓ Reset complete. Restart `bun run dev` to re-seed.")
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
