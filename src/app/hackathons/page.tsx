import type { Metadata } from "next"

import { HackathonList } from "@/components/hackathons/hackathon-list"
import { PageHeader } from "@/components/marks"
import { hackathons } from "@/content/hackathons"
import { site } from "@/content/site"

export const metadata: Metadata = {
  title: "Hackathons",
  description: `Hackathons ${site.name} has competed in: 3rd place at Green Loop with ReSpark and the Damietta Hackathon with an ESP32 smart medical watch.`,
  alternates: { canonical: "/hackathons" },
}

export default function HackathonsPage() {
  const podiums = hackathons.filter((h) => h.result.kind === "place").length
  return (
    <div className="mx-auto w-full max-w-[var(--column)] px-6">
      <PageHeader eyebrow="Hackathons" title="Hackathons" count={hackathons.length} stamp={2}>
        <p>
          {hackathons.length} hackathons in my first year of college — {podiums} on the podium. Each one shipped
          something real; the full story behind every build is one tap away.
        </p>
      </PageHeader>
      <HackathonList items={hackathons} />
    </div>
  )
}
