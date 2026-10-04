import React from 'react'
import { ExternalLink } from 'lucide-react'
import { Section } from '@/components/ui/Section'

const isLinkedIn = (url: string) => url.includes('linkedin.com')
import { GithubIcon } from '@/components/icons/GithubIcon'
import { useItemsOfKind, useProfile } from '@/lib/content'
import type { PortfolioItem } from '@/content/types'
import { pickFeatured } from './Featured'

const linkClass =
  'inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 -mx-2 text-sm font-medium text-fg-muted transition-colors hover:text-slime-200'

const ProjectCard: React.FC<{ item: PortfolioItem }> = ({ item }) => (
  <article className="card card-hover flex flex-col overflow-hidden">
    {item.image_url && (
      <img
        src={item.image_url}
        alt={`${item.title} screenshot`}
        className="aspect-video w-full border-b border-line object-cover"
        loading="lazy"
        decoding="async"
      />
    )}
    <div className="flex flex-1 flex-col p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-semibold tracking-tight text-fg">{item.title}</h3>
        {item.period && <span className="shrink-0 font-mono text-xs text-fg-faint">{item.period}</span>}
      </div>
      {item.subtitle && <p className="mt-1 text-sm text-slime-300/90">{item.subtitle}</p>}
      {item.description && <p className="mt-3 text-sm leading-relaxed text-fg-muted">{item.description}</p>}

      {item.highlights.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {item.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex gap-2.5 text-sm leading-relaxed text-fg-muted">
              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-slime-400/80" aria-hidden="true" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}

      {item.tags.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Built with">
          {item.tags.map((tag) => (
            <li key={tag} className="chip">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {(item.url || item.repo_url) && (
        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-x-5 border-t border-line pt-3">
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                aria-label={`${item.title}: ${isLinkedIn(item.url) ? 'write-up on LinkedIn' : 'live site'}`}
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                {isLinkedIn(item.url) ? 'Read the post' : 'Live'}
              </a>
            )}
            {item.repo_url && (
              <a
                href={item.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                aria-label={`${item.title}: source code on GitHub`}
              >
                <GithubIcon className="h-4 w-4" />
                Source
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  </article>
)

export const ProjectsSection: React.FC = () => {
  const { items } = useItemsOfKind('project')
  const { profile } = useProfile()

  // The featured project already has its own section; only skip it here when
  // that section is actually on the page.
  const featured = profile.section_order.includes('featured') ? pickFeatured(items) : null
  const projects = items.filter((p) => p !== featured)
  if (projects.length === 0) return null

  return (
    <Section id="projects" eyebrow="projects" title="Things I've built">
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {projects.map((item) => (
          <ProjectCard key={item.id} item={item} />
        ))}
      </div>
    </Section>
  )
}
