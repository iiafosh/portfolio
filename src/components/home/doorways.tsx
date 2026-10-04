import Link from "next/link"

import { delay } from "../marks"
import { PixelMedal, PixelTrophy } from "../pixel-art"

// cali.so's doorways: one analog vignette per collection on a hairline grid,
// for visitors who never look at the dock. Counts come from the data, so
// the home page stays the same size however much gets added.

export function Doorways({
  counts,
}: {
  counts: { hackathons: number; projects: number; achievements: number; community: number }
}) {
  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`
  return (
    <nav aria-label="Collections" className="doorways">
      <Link href="/hackathons" className="doorway enter-swing" style={delay(140)}>
        <span className="doorway-vignette dv-trophy" aria-hidden="true">
          <span className="dv-spark dv-spark-a" />
          <span className="dv-spark dv-spark-b" />
          <PixelTrophy metal="bronze" width={39} height={39} />
        </span>
        <span className="doorway-label">Hackathons</span>
        <span className="doorway-sub">{plural(counts.hackathons, "event", "events")}</span>
      </Link>

      <Link href="/projects" className="doorway enter-swing" style={delay(180)}>
        <span className="doorway-vignette" aria-hidden="true">
          <span className="dv-bento">
            <span className="dv-tile dv-tile-a" />
            <span className="dv-tile dv-tile-b" />
            <span className="dv-tile dv-tile-c" />
            <span className="dv-tile dv-tile-d" />
          </span>
        </span>
        <span className="doorway-label">Projects</span>
        <span className="doorway-sub">{plural(counts.projects, "build", "builds")}</span>
      </Link>

      <Link href="/achievements" className="doorway enter-swing" style={delay(220)}>
        <span className="doorway-vignette dv-medal" aria-hidden="true">
          <span className="dv-medal-swing">
            <PixelMedal metal="gold" width={33} height={42} />
          </span>
        </span>
        <span className="doorway-label">Achievements</span>
        <span className="doorway-sub">{plural(counts.achievements, "award", "awards")}</span>
      </Link>

      <Link href="/community" className="doorway enter-swing" style={delay(260)}>
        <span className="doorway-vignette" aria-hidden="true">
          <span className="dv-badge dv-badge-a">
            <span className="dv-badge-clip" />
            <span className="dv-badge-face" />
            <span className="dv-badge-lines" />
          </span>
          <span className="dv-badge dv-badge-b">
            <span className="dv-badge-clip" />
            <span className="dv-badge-face" />
            <span className="dv-badge-lines" />
          </span>
        </span>
        <span className="doorway-label">Community</span>
        <span className="doorway-sub">{plural(counts.community, "club", "clubs")}</span>
      </Link>
    </nav>
  )
}
