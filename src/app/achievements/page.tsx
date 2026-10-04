import type { Metadata } from "next"

import { TrophyShelf } from "@/components/achievements/trophy-shelf"
import { PageHeader } from "@/components/marks"
import { achievements } from "@/content/achievements"
import { site } from "@/content/site"

export const metadata: Metadata = {
  title: "Achievements",
  description: `Awards and ranks won by ${site.name}: #1 Horus University team in the ECPC 2026 qualifications, 3rd place at Green Loop and qualifying for the Damietta Hackathon.`,
  alternates: { canonical: "/achievements" },
}

export default function AchievementsPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--column)] px-6">
      <PageHeader eyebrow="Achievements" title="Achievements" count={achievements.length} stamp={4}>
        <p>
          Everything so far, on one shelf. Pick a trophy to read its plate — the ranks, the team and the proof.
        </p>
      </PageHeader>
      <TrophyShelf items={achievements} />
    </div>
  )
}
