import React from 'react'
import { useProfile } from '@/lib/content'
import type { SectionKey } from '@/content/types'
import { HeroSection } from '@/sections/Hero'
import { FeaturedSection } from '@/sections/Featured'
import { ProjectsSection } from '@/sections/Projects'
import { ExperienceSection } from '@/sections/Experience'
import { EducationSection } from '@/sections/Education'
import { SkillsSection } from '@/sections/Skills'
import { CertificationsSection } from '@/sections/Certifications'
import { GuestbookSection } from '@/sections/Guestbook'

// Each section renders null when it has no content, so empty LinkedIn-only
// sections disappear until data is added in Supabase.
const SECTIONS: Record<SectionKey, React.FC> = {
  featured: FeaturedSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  certifications: CertificationsSection,
  guestbook: GuestbookSection,
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
