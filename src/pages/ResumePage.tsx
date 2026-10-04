import React, { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Download } from 'lucide-react'
import { useItemsOfKind, useProfile } from '@/lib/content'
import { prettyUrl } from '@/components/timeline/period'
import type { PortfolioItem } from '@/content/types'

// Print rules: only the paper is printed, on A4, without the dark site around it.
// Elements that do not contain the resume are removed from layout (needs :has, all
// evergreen browsers); the visibility rules are a fallback for older engines.
const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 12mm; }
  html, body { background: white !important; color-scheme: light; }
  body * { visibility: hidden; }
  #resume-paper, #resume-paper * { visibility: visible; }
  #resume-paper { position: absolute; left: 0; top: 0; width: 100%; }
  body *:not(:has(#resume-paper)):not(#resume-paper):not(#resume-paper *) { display: none !important; }
  body *:has(#resume-paper) {
    margin: 0 !important; padding: 0 !important; min-height: 0 !important; height: auto !important;
    position: static !important; transform: none !important; filter: none !important;
    backdrop-filter: none !important; background: none !important; box-shadow: none !important; overflow: visible !important;
  }
  #resume-paper a { color: inherit; text-decoration: none; }
  #resume-paper { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .resume-block { break-inside: avoid; }
}
`

const RESUME_TITLE = 'Mostafa Kamal Shabara — Resume'

/** One-page printable resume generated from the same content as the home page. */
export const ResumePage: React.FC = () => {
  const { profile } = useProfile()
  const { items: experience } = useItemsOfKind('experience')
  const { items: projects } = useItemsOfKind('project')
  const { items: education } = useItemsOfKind('education')
  const { items: skills } = useItemsOfKind('skill_group')
  const { items: certifications } = useItemsOfKind('certification')
  const { items: achievements } = useItemsOfKind('achievement')

  useEffect(() => {
    const previous = document.title
    document.title = RESUME_TITLE
    return () => {
      document.title = previous
    }
  }, [])

  const contact: { label: string; href?: string }[] = [
    profile.location ? { label: profile.location } : null,
    profile.email ? { label: profile.email, href: `mailto:${profile.email}` } : null,
    profile.github_url ? { label: prettyUrl(profile.github_url), href: profile.github_url } : null,
    profile.linkedin_url ? { label: prettyUrl(profile.linkedin_url), href: profile.linkedin_url } : null,
  ].filter((c): c is { label: string; href?: string } => c !== null)

  return (
    <div className="py-6 sm:py-10 print:p-0">
      <style>{PRINT_CSS}</style>

      {/* Toolbar (screen only) */}
      <div className="no-print mx-auto mb-5 flex max-w-[210mm] flex-wrap items-center justify-between gap-3">
        <Link to="/" className="btn-ghost">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-xs text-faint sm:inline">Pick “Save as PDF” in the print dialog</span>
          <button type="button" onClick={() => window.print()} className="btn-primary">
            <Download className="h-4 w-4" aria-hidden="true" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Paper */}
      <article
        id="resume-paper"
        aria-label={`Resume of ${profile.name}`}
        className="mx-auto max-w-[210mm] rounded-md bg-white px-5 py-7 font-sans text-[12.5px] leading-[1.5] text-zinc-800 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:min-h-[297mm] sm:px-[12mm] sm:py-[12mm] print:!min-h-0 print:!max-w-none print:!rounded-none print:!p-0 print:text-[9pt] print:leading-[1.35] print:!shadow-none"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-5 border-b-2 border-zinc-900 pb-3.5">
          <div className="min-w-0">
            <h1 className="font-display text-[28px] font-bold leading-none tracking-tight text-zinc-900 print:text-[21pt]">
              {profile.name}
            </h1>
            {profile.headline && (
              <p className="mt-1.5 text-[14px] font-medium text-sky-700 print:text-[11pt]">{profile.headline}</p>
            )}
            {contact.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5 text-[12px] text-zinc-600 print:text-[9pt]">
                {contact.map((c, i) => (
                  <li key={c.label} className="flex items-center gap-x-2">
                    {i > 0 && <span aria-hidden="true" className="text-zinc-300">|</span>}
                    {c.href ? (
                      <a
                        href={c.href}
                        target={c.href.startsWith('mailto:') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="underline decoration-zinc-300 underline-offset-2 hover:text-sky-700 hover:decoration-sky-600"
                      >
                        {c.label}
                      </a>
                    ) : (
                      <span>{c.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {profile.avatar_url && (
            // The photo file is a circle on a dark square: mask it round and scale past the edge.
            <span className="hidden h-[68px] w-[68px] shrink-0 overflow-hidden rounded-full ring-2 ring-sky-600/70 ring-offset-2 ring-offset-white min-[420px]:block print:block print:h-[19mm] print:w-[19mm]">
              <img
                src={profile.avatar_url}
                alt=""
                width={68}
                height={68}
                className="h-full w-full scale-[1.1] object-cover"
                decoding="async"
              />
            </span>
          )}
        </header>

        {profile.bio && (
          <ResumeBlock title="Summary">
            <p className="text-zinc-700">{profile.bio}</p>
          </ResumeBlock>
        )}

        {experience.length > 0 && (
          <ResumeBlock title="Experience">
            <div className="space-y-1.5">
              {experience.map((item) => (
                <ResumeEntry key={item.id} item={item} showDescription showTags={false} />
              ))}
            </div>
          </ResumeBlock>
        )}

        {achievements.length > 0 && (
          <ResumeBlock title="Achievements">
            <ul className="space-y-0.5">
              {achievements.map((item) => (
                <li key={item.id} className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span>
                    <span className="font-semibold text-zinc-900">{item.title}</span>
                    {item.subtitle && <span className="text-zinc-600"> — {item.subtitle}</span>}
                  </span>
                  {item.period && <span className="font-mono text-[11px] text-zinc-500 print:text-[8pt]">{item.period}</span>}
                </li>
              ))}
            </ul>
          </ResumeBlock>
        )}

        {projects.length > 0 && (
          <ResumeBlock title="Projects">
            <div className="space-y-1.5">
              {projects.map((item) => (
                <ResumeEntry key={item.id} item={item} maxHighlights={1} showLinks />
              ))}
            </div>
          </ResumeBlock>
        )}

        {(education.length > 0 || skills.length > 0) && (
          <>
            {education.length > 0 && (
              <ResumeBlock title="Education">
                <div className="space-y-1.5">
                  {education.map((item) => (
                    <ResumeEntry key={item.id} item={item} showDescription />
                  ))}
                </div>
              </ResumeBlock>
            )}

            {skills.length > 0 && (
              <ResumeBlock title="Skills">
                <dl className="space-y-0.5">
                  {skills.map((group) => (
                    <div key={group.id}>
                      <dt className="inline font-semibold text-zinc-900">{group.title}: </dt>
                      <dd className="inline text-zinc-700">{group.tags.join(', ')}</dd>
                    </div>
                  ))}
                </dl>
              </ResumeBlock>
            )}
          </>
        )}

        {certifications.length > 0 && (
          <ResumeBlock title="Certifications">
            <ul className="space-y-1">
              {certifications.map((item) => (
                <li key={item.id} className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span>
                    <span className="font-semibold text-zinc-900">{item.title}</span>
                    {item.subtitle && <span className="text-zinc-600"> — {item.subtitle}</span>}
                    {item.url && (
                      <>
                        {' · '}
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-700 underline decoration-sky-300 underline-offset-2"
                        >
                          credential
                        </a>
                      </>
                    )}
                  </span>
                  {item.period && <span className="font-mono text-[11px] text-zinc-500 print:text-[8pt]">{item.period}</span>}
                </li>
              ))}
            </ul>
          </ResumeBlock>
        )}
      </article>
    </div>
  )
}

const ResumeBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="resume-block mt-3">
    <h2 className="mb-1.5 flex items-center gap-2 font-display text-[11.5px] font-bold uppercase tracking-[0.16em] text-sky-700 print:text-[8.5pt]">
      <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-sky-600" />
      {title}
      <span aria-hidden="true" className="h-px flex-1 bg-zinc-200" />
    </h2>
    {children}
  </section>
)

const ResumeEntry: React.FC<{
  item: PortfolioItem
  maxHighlights?: number
  showDescription?: boolean
  showLinks?: boolean
  showTags?: boolean
}> = ({ item, maxHighlights, showDescription, showLinks, showTags = true }) => {
  const highlights = maxHighlights !== undefined ? item.highlights.slice(0, maxHighlights) : item.highlights
  const meta = [item.period, item.location].filter(Boolean).join(' · ')
  // LinkedIn post links all point at the same activity feed, already in the header.
  const links = showLinks ? [item.url, item.repo_url].filter((u): u is string => !!u && !u.includes('linkedin.com')) : []

  return (
    <div className="resume-block">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <p>
          <span className="font-semibold text-zinc-900">{item.title}</span>
          {item.subtitle && (
            <span className="text-zinc-600">
              {' — '}
              {!showLinks && item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-700">
                  {item.subtitle}
                </a>
              ) : (
                item.subtitle
              )}
            </span>
          )}
        </p>
        {meta && <span className="shrink-0 font-mono text-[11px] text-zinc-500 print:text-[8pt]">{meta}</span>}
      </div>

      {showDescription && item.description && <p className="text-zinc-700">{item.description}</p>}

      {highlights.length > 0 && (
        <ul className="list-disc pl-4 text-zinc-700 marker:text-zinc-400">
          {highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}

      {((showTags && item.tags.length > 0) || links.length > 0) && (
        <p className="text-[11.5px] text-zinc-500 print:text-[8.5pt]">
          {showTags && item.tags.length > 0 && (
            <>
              <span className="font-medium text-zinc-600">{item.kind === 'project' ? 'Stack' : 'Skills'}:</span>{' '}
              {item.tags.join(' · ')}
            </>
          )}
          {links.map((u, i) => (
            <React.Fragment key={u}>
              {(i > 0 || (showTags && item.tags.length > 0)) && ' · '}
              <a href={u} target="_blank" rel="noopener noreferrer" className="text-sky-700 underline decoration-sky-300 underline-offset-2">
                {prettyUrl(u)}
              </a>
            </React.Fragment>
          ))}
        </p>
      )}
    </div>
  )
}
