import type { Metadata } from "next"

import { PageHeader } from "@/components/marks"
import { ProjectGrid } from "@/components/projects/project-grid"
import { projects } from "@/content/projects"
import { site } from "@/content/site"

export const metadata: Metadata = {
  title: "Projects",
  description: `Projects by ${site.name}: the fosh&fish game, the ReSpark e-waste app, an ESP32 smart medical watch, Robo-Space predictive maintenance and more.`,
  alternates: { canonical: "/projects" },
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--column)] px-6" data-column="xwide">
      <PageHeader eyebrow="Projects" title="Projects" count={projects.length} stamp={3}>
        <p>
          Games, hardware, models and apps — built at hackathons, for courses, and for fun. Open any tile for the
          story behind it.
        </p>
      </PageHeader>
      <ProjectGrid items={projects} />
    </div>
  )
}
