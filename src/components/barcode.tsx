// A decorative label barcode whose bars come from its code string
// (cali.so's print ephemera) — stable across renders, ornament not data.

function bars(code: string) {
  let h = 2166136261
  for (let i = 0; i < code.length; i++) {
    h ^= code.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const next = () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return (h >>> 0) / 4294967296
  }
  const out: { x: number; w: number }[] = []
  let x = 0
  // guard bars, payload, guard bars
  for (const w of [1, 1]) {
    out.push({ x, w })
    x += w + 1
  }
  for (let i = 0; i < 26; i++) {
    const w = 1 + Math.floor(next() * 3)
    out.push({ x, w })
    x += w + 1 + Math.floor(next() * 2)
  }
  for (const w of [1, 1]) {
    out.push({ x, w })
    x += w + 1
  }
  return { out, width: x - 1 }
}

export function Barcode({ code, className }: { code: string; className?: string }) {
  const { out, width } = bars(code)
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox={`0 0 ${width} 20`} preserveAspectRatio="none" className="block h-5 w-full" shapeRendering="crispEdges">
        {out.map((b) => (
          <rect key={b.x} x={b.x} y={0} width={b.w} height={20} fill="currentColor" />
        ))}
      </svg>
      <span className="mt-1 block text-center font-mono text-[8px] tracking-[0.2em]">{code}</span>
    </span>
  )
}
