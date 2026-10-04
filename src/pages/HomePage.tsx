import React from 'react'
import { useProfile } from '@/lib/content'
import type { SectionKey } from '@/content/types'
import { HeroSection } from '@/sections/Hero'
import { FeaturedSection } from '@/sections/Featured'
import { AchievementsSection } from '@/sections/Achievements'
import { ProjectsSection } from '@/sections/Projects'
import { ExperienceSection } from '@/sections/Experience'
import { EducationSection } from '@/sections/Education'
import { SkillsSection } from '@/sections/Skills'
import { CertificationsSection } from '@/sections/Certifications'

// Each section renders null when it has no content.
const SECTIONS: Record<SectionKey, React.FC> = {
  featured: FeaturedSection,
  achievements: AchievementsSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  certifications: CertificationsSection,
}

export const HomePage: React.FC = () => {
  const { profile } = useProfile()
  return (
    <div className="space-y-20 sm:space-y-28">
      <HeroSection />
      {profile.section_order.map((key) => {
        const Component = SECTIONS[key]
        return Component ? <Component key={key} /> : null
      })}
    </div>
  )
}
