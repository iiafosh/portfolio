import React from 'react'
import { BentoProjects } from '@/components/BentoProjects'

export const ProjectsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <BentoProjects />
    </div>
  )
}
