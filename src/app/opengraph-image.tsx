import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import sharp from "sharp"

import { site } from "@/content/site"

// The share card: the home masthead as a printed sheet — pixel name,
// the three headline results as spec plates, the portrait and the slime.

export const alt = `${site.name} — ${site.headline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const fonts = join(process.cwd(), "src", "assets", "fonts")
const [bold, sans, avatar] = await Promise.all([
  readFile(join(fonts, "Geist-Bold.ttf")),
  readFile(join(fonts, "Geist-Medium.ttf")),
  // Satori can't read WebP, so the portrait is re-encoded to JPEG for the card.
  sharp(join(process.cwd(), "public", "media", "avatar.webp")).jpeg({ quality: 90 }).toBuffer().then((b) => b.toString("base64")),
])

const SLIME = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="#e8f8ff"/><stop offset="0.45" stop-color="#8fd3f4"/><stop offset="1" stop-color="#4a9fd6"/></linearGradient></defs><path d="M2.5 25c0-10.2 6-20 13.5-20s13.5 9.8 13.5 20c0 1.4-1.1 2.5-2.5 2.5H5c-1.4 0-2.5-1.1-2.5-2.5Z" fill="url(#g)"/><ellipse cx="10" cy="11.5" rx="3.4" ry="1.8" transform="rotate(-32 10 11.5)" fill="#fff" opacity=".85"/><ellipse cx="11.8" cy="18.6" rx="1.5" ry="1.9" fill="#1e3a5f"/><ellipse cx="20.2" cy="18.6" rx="1.5" ry="1.9" fill="#1e3a5f"/><path d="M13.8 22.3q1.1 1.3 2.2 0q1.1 1.3 2.2 0" fill="none" stroke="#1e3a5f" stroke-width="1.1" stroke-linecap="round"/></svg>`,
)}`

const INK = "#efece6"
const MUTED = "#9a958c"
const RULE = "#3a3631"

export default function OpengraphImage() {
  const plates = [
    ["3rd place", "Green Loop · HUE"],
    ["#1 at Horus", "ECPC 2026 quals"],
    ["fosh&fish", "my first game"],
  ]

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#1a1814",
          color: INK,
          padding: "64px 72px",
          position: "relative",
          fontFamily: "Geist",
        }}
      >
        {/* drafting guides */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 40, width: 1, background: RULE, display: "flex" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, right: 40, width: 1, background: RULE, display: "flex" }} />

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Geist", fontSize: 20, color: MUTED, letterSpacing: 3 }}>
            <span>{"// AFOSH · PORTFOLIO"}</span>
            <div style={{ display: "flex", gap: 2 }}>
              <div style={{ width: 8, height: 8, background: "#8fd3f4", display: "flex" }} />
              <div style={{ width: 8, height: 8, background: "#5a5650", display: "flex" }} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 36, fontFamily: "Geist", fontWeight: 700, fontSize: 116, lineHeight: 1, letterSpacing: -6 }}>
            <span>Mostafa</span>
            <span>Kmal</span>
          </div>

          <div style={{ marginTop: 28, fontSize: 27, color: MUTED, display: "flex" }}>
            AI &amp; Informatics (Robotics) · Horus University
          </div>

          <div style={{ display: "flex", gap: 0, marginTop: "auto", borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}` }}>
            {plates.map(([value, label], i) => (
              <div
                key={value}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "16px 22px",
                  paddingLeft: i === 0 ? 0 : 22,
                  borderLeft: i === 0 ? "none" : `1px solid ${RULE}`,
                  fontFamily: "Geist",
                }}
              >
                <span style={{ fontSize: 15, color: MUTED, letterSpacing: 2, textTransform: "uppercase" }}>{label}</span>
                <span style={{ fontSize: 30, marginTop: 6, fontWeight: 700, letterSpacing: -1 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 340, marginLeft: 40 }}>
          <div style={{ display: "flex", width: 280, height: 280, borderRadius: 999, overflow: "hidden", border: `2px solid ${RULE}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`data:image/jpeg;base64,${avatar}`} width={280} height={280} style={{ objectFit: "cover" }} alt="" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SLIME} width={120} height={120} style={{ marginTop: -34 }} alt="" />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: bold, weight: 700, style: "normal" },
        { name: "Geist", data: sans, weight: 500, style: "normal" },
      ],
    },
  )
}
