import { Doorways } from "@/components/home/doorways"
import Image from "next/image"
import { Journey } from "@/components/home/journey"
import { Toolbox } from "@/components/home/toolbox"
import { ExternalLink, InlineLink, PixelCluster, SectionTag, delay } from "@/components/marks"
import { SkillChip } from "@/components/skill-chip"
import { achievements } from "@/content/achievements"
import { communities } from "@/content/community"
import { hackathons } from "@/content/hackathons"
import { heroSkills, milestones, toolbox } from "@/content/journey"
import { projects } from "@/content/projects"
import { site } from "@/content/site"

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-[var(--column)] px-6">
      <header className="flex flex-col-reverse gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
        <div className="min-w-0 flex-1">
          <p className="enter text-[0.9375rem] text-muted-foreground">
            Hi, I&apos;m <span className="waving inline-block">👋</span>
          </p>
          <div className="mt-3 flex items-start gap-3">
            <h1
              className="enter font-display text-[2.75rem] leading-[1.02] font-bold tracking-[-0.05em] text-foreground sm:text-[3.4rem]"
              style={delay(40)}
            >
              {site.name}
              <span className="sr-only">
                {" "}
                — known online as {site.handle}. {site.headline} at {site.university.name}.
              </span>
            </h1>
            <PixelCluster variant={1} className="enter mt-1.5 shrink-0" />
          </div>
          <p className="enter mt-4 text-[0.9375rem] text-muted-foreground" style={delay(80)}>
            — {site.headline} at{" "}
            <ExternalLink href={site.university.href} className="text-muted-foreground">
              {site.university.short}
            </ExternalLink>
          </p>
        </div>
        <div className="enter w-[9.5rem] shrink-0 sm:w-[13.5rem]" style={delay(60)}>
          <Image
            src={site.avatar}
            alt={`Portrait of ${site.name}`}
            width={320}
            height={320}
            priority
            className="aspect-square w-full rounded-full object-cover shadow-[0_0_0_1px_var(--border),var(--shadow-medium)]"
          />
        </div>
      </header>

      <section className="prose-copy enter mt-10 space-y-4" style={delay(140)}>
        <p>
          I&apos;m <strong>{site.name}</strong> — <span className="font-medium text-foreground">afosh</span> online —
          an AI &amp; Informatics (Robotics) student at{" "}
          <ExternalLink href={site.university.href}>{site.university.name}</ExternalLink>. I build across the
          stack: games in <SkillChip skill={heroSkills.godot} /> and <SkillChip skill={heroSkills.blender} />,
          wearables on an <SkillChip skill={heroSkills.esp32} />, models with{" "}
          <SkillChip skill={heroSkills.python} /> and <SkillChip skill={heroSkills.sklearn} />, and contest
          solutions in <SkillChip skill={heroSkills.cpp} />.
        </p>
        <p>
          Lately my first game <InlineLink href="/projects?p=fosh-and-fish">fosh&amp;fish</InlineLink> went live, my
          team took <InlineLink href="/hackathons#green-loop">3rd at Green Loop</InlineLink> with ReSpark, and we
          were the <InlineLink href="/achievements?a=ecpc-2026">#1 Horus team</InlineLink> in the ECPC
          qualifiers.
        </p>
      </section>

      <div className="mt-14">
        <Doorways
          counts={{
            hackathons: hackathons.length,
            projects: projects.length,
            achievements: achievements.length,
            community: communities.length,
          }}
        />
      </div>

      <section className="mt-16">
        <SectionTag index={1} className="enter" style={delay(200)}>
          Journey
        </SectionTag>
        <Journey items={milestones.slice(0, 6)} start={220} />
      </section>

      <section className="mt-16">
        <SectionTag index={2} className="enter" style={delay(260)}>
          Toolbox
        </SectionTag>
        <Toolbox groups={toolbox} />
      </section>
    </div>
  )
}
