import type { SVGProps } from "react"

// Hand-placed pixel art for the trophy shelf and the hackathon ranks.
// Each sprite is a grid of characters; runs of one color merge into a rect.

type Palette = Record<string, string>

export type Metal = "gold" | "silver" | "bronze"

const METALS: Record<Metal, Palette> = {
  gold: { o: "#7a4f00", b: "#f2c230", h: "#fff1a8", s: "#c8920e", e: "#b07a06" },
  silver: { o: "#475260", b: "#c7d0d9", h: "#f4f7fa", s: "#8d99a6", e: "#7b8794" },
  bronze: { o: "#552a0c", b: "#d08a4a", h: "#f7c79a", s: "#9a5a26", e: "#86491b" },
}

const TROPHY = [
  "..ooooooooo..",
  "ooohbbbbbsooo",
  "o.ohbbbbbso.o",
  "o.ohbbbbbso.o",
  ".oohbbbbbsoo.",
  "..ohbbbbbso..",
  "...ohbbbso...",
  "....obbbo....",
  ".....obo.....",
  ".....obo.....",
  "....ooooo....",
  "...ohbbbso...",
  "...ooooooo...",
]

const MEDAL = [
  "rrrr...BBBB",
  ".rrrr.BBBB.",
  "..rrrBBBB..",
  "...rrBBB...",
  "....ooo....",
  "...ooooo...",
  "..ohhbbso..",
  ".ohhbbbbso.",
  ".ohbbebbso.",
  ".obbeeebso.",
  ".obbbebbso.",
  ".osbbbbsso.",
  "..ossssso..",
  "...ooooo...",
]

const ROSETTE = [
  "...pp.p.pp...",
  "..ppppppppp..",
  ".pppoooooppp.",
  "pppohhbbsoppp",
  ".ppohbbbsopp.",
  "pppobbebsoppp",
  ".ppossbssopp.",
  "..ppooooopp..",
  "...ppppppp...",
  "....tt.tt....",
  "...ttt.ttt...",
  "...tt...tt...",
  "..ttt...ttt..",
  "..t.t...t.t..",
]

function Sprite({
  rows,
  palette,
  pixel = 1,
  title,
  ...props
}: { rows: string[]; palette: Palette; pixel?: number; title?: string } & SVGProps<SVGSVGElement>) {
  const width = rows[0].length
  const height = rows.length
  const rects: { x: number; y: number; w: number; fill: string }[] = []
  rows.forEach((row, y) => {
    let x = 0
    while (x < width) {
      const ch = row[x]
      const fill = palette[ch]
      if (!fill) {
        x++
        continue
      }
      let run = 1
      while (x + run < width && row[x + run] === ch) run++
      rects.push({ x, y, w: run, fill })
      x += run
    }
  })

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width * pixel}
      height={height * pixel}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...props}
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
      ))}
    </svg>
  )
}

export function PixelTrophy({ metal = "gold", ...props }: { metal?: Metal } & SVGProps<SVGSVGElement>) {
  return <Sprite rows={TROPHY} palette={METALS[metal]} {...props} />
}

export function PixelMedal({ metal = "gold", ...props }: { metal?: Metal } & SVGProps<SVGSVGElement>) {
  return (
    <Sprite
      rows={MEDAL}
      palette={{ ...METALS[metal], r: "#e5484d", B: "#3e63dd" }}
      {...props}
    />
  )
}

export function PixelRosette({ metal = "silver", ...props }: { metal?: Metal } & SVGProps<SVGSVGElement>) {
  return (
    <Sprite
      rows={ROSETTE}
      palette={{ ...METALS[metal], p: "#3e8ee8", t: "#2563c9" }}
      {...props}
    />
  )
}

export function PixelObject({
  object,
  metal,
  ...props
}: { object: "trophy" | "medal" | "ribbon"; metal: Metal } & SVGProps<SVGSVGElement>) {
  if (object === "trophy") return <PixelTrophy metal={metal} {...props} />
  if (object === "medal") return <PixelMedal metal={metal} {...props} />
  return <PixelRosette metal={metal} {...props} />
}
