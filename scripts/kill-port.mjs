#!/usr/bin/env node
/**
 * Kills any process listening on the given port.
 * Cross-platform (Windows / macOS / Linux).
 *
 *   node scripts/kill-port.mjs 3000
 *
 * Silent if nothing is listening. Used by `pnpm dev:clean`.
 */
import { execSync } from "node:child_process"

const port = process.argv[2]
if (!port || !/^\d+$/.test(port)) {
  console.error("Usage: node scripts/kill-port.mjs <port>")
  process.exit(1)
}

function getPidsWindows(p) {
  try {
    const out = execSync(`netstat -ano -p TCP | findstr :${p}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
    const pids = new Set()
    for (const line of out.split(/\r?\n/)) {
      const m = line.trim().match(/LISTENING\s+(\d+)/)
      if (m) pids.add(m[1])
    }
    return [...pids]
  } catch {
    return []
  }
}

function getPidsUnix(p) {
  try {
    const out = execSync(`lsof -nP -iTCP:${p} -sTCP:LISTEN -t`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
    return out.split(/\r?\n/).filter(Boolean)
  } catch {
    return []
  }
}

function killWindows(pid) {
  try {
    execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" })
    return true
  } catch {
    return false
  }
}

function killUnix(pid) {
  try {
    execSync(`kill -9 ${pid}`, { stdio: "ignore" })
    return true
  } catch {
    return false
  }
}

const isWin = process.platform === "win32"
const pids = isWin ? getPidsWindows(port) : getPidsUnix(port)

if (pids.length === 0) {
  console.log(`✓ Port ${port} ya está libre.`)
  process.exit(0)
}

for (const pid of pids) {
  const ok = isWin ? killWindows(pid) : killUnix(pid)
  console.log(
    ok
      ? `✓ Matado proceso ${pid} que ocupaba el port ${port}.`
      : `✗ No pude matar el proceso ${pid}.`,
  )
}
