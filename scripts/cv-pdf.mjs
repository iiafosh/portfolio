// Renders /cv to public/cv.pdf with a local headless Chrome or Edge.
//   npm run dev            (in one terminal)
//   npm run cv:pdf         (in another; CV_URL overrides the address)

import { spawnSync } from "node:child_process"
import { existsSync, mkdtempSync, rmSync, statSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

const url = process.env.CV_URL ?? "http://localhost:3210/cv"
const out = resolve("public", "cv.pdf")

const candidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean)

const browser = candidates.find((p) => existsSync(p))
if (!browser) {
  console.error("No Chrome/Edge found. Set CHROME_PATH to a Chromium-based browser.")
  process.exit(1)
}

// a throwaway profile, so the export never touches your everyday browser
const profile = mkdtempSync(join(tmpdir(), "cv-pdf-"))

const result = spawnSync(
  browser,
  [
    "--headless=new",
    `--user-data-dir=${profile}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=8000",
    `--print-to-pdf=${out}`,
    url,
  ],
  { stdio: "inherit" },
)
rmSync(profile, { recursive: true, force: true })

if (result.status !== 0 || !existsSync(out)) {
  console.error(`PDF export failed (exit ${result.status}).`)
  process.exit(1)
}
console.log(`✓ ${out} (${Math.round(statSync(out).size / 1024)} KB) from ${url}`)
