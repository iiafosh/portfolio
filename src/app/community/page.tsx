import type { Metadata } from "next"

import { BadgeBoard } from "@/components/community/badge-board"
import { PageHeader } from "@/components/marks"
import { communities } from "@/content/community"
import { site } from "@/content/site"

export const metadata: Metadata = {
  title: "Community",
  description: `Clubs and communities ${site.name} is part of at Horus University: ICPC HUE and the AXIS student club.`,
  alternates: { canonical: "/community" },
}

export default function CommunityPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--column)] px-6">
      <PageHeader eyebrow="Community" title="Community" count={communities.length} stamp={5}>
        <p>The clubs and communities I build with. Grab a badge and give it a swing, or tap it to read the card.</p>
      </PageHeader>
      <BadgeBoard items={communities} />
    </div>
  )
}
