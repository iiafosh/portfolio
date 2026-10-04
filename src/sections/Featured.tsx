import React, { useState } from 'react'
import { Gamepad2, Play } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { useItemsOfKind } from '@/lib/content'
import type { PortfolioItem } from '@/content/types'

/** The project shown in the Featured section: first featured project by sort_order. */
export function pickFeatured(projects: PortfolioItem[]): PortfolioItem | null {
  return projects.find((p) => p.featured) ?? null
}

interface Shot {
  src: string
  alt: string
}

/** Extra screenshots shipped in /public/media for fosh&fish. */
function screenshotsFor(item: PortfolioItem): Shot[] {
  const isFosh = item.id === 'proj-fosh-and-fish' || (item.image_url ?? '').includes('fosh-and-fish')
  if (!isFosh) return []
  const cover = item.image_url ?? '/media/fosh-and-fish-cover.jpg'
  return [
    { src: cover, alt: `${item.title} cover art` },
    { src: '/media/fosh-and-fish-gameplay.jpg', alt: `${item.title} gameplay screenshot` },
    { src: '/media/fosh-and-fish-biomes.jpg', alt: `${item.title} biomes screenshot` },
    { src: '/media/fosh-and-fish-shop.jpg', alt: `${item.title} shop screenshot` },
  ]
}

const FeaturedMedia: React.FC<{ item: PortfolioItem }> = ({ item }) => {
  const shots = screenshotsFor(item)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)

  const image = shots[active]?.src ?? item.image_url
  const imageAlt = shots[active]?.alt ?? `${item.title} cover art`
  if (!image && !item.video_url) return null

  return (
    <div>
      <div className="relative aspect-video overflow-hidden bg-ink-850">
        {playing && item.video_url ? (
          <video
            className="h-full w-full bg-black object-contain"
            src={item.video_url}
            poster={item.image_url ?? undefined}
            controls
            autoPlay
            playsInline
            preload="metadata"
          >
            Your browser can't play this video.{' '}
            <a className="link" href={item.video_url}>
              Download the trailer
            </a>
            .
          </video>
        ) : item.video_url ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 block h-full w-full"
            aria-label={`Play the ${item.title} trailer`}
          >
            {image && (
              <img
                src={image}
                alt={imageAlt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                width={1280}
                height={720}
                decoding="async"
              />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slime-400 text-ink-950 shadow-glow transition-transform duration-200 group-hover:scale-105 sm:h-20 sm:w-20">
                <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" aria-hidden="true" />
              </span>
            </span>
            <span className="absolute bottom-3 left-3 rounded-lg bg-ink-950/70 px-2.5 py-1 font-mono text-[11px] text-fg backdrop-blur sm:bottom-4 sm:left-4">
              Watch trailer
            </span>
          </button>
        ) : (
          image && (
            <img
              src={image}
              alt={imageAlt}
              className="h-full w-full object-cover"
              width={1280}
              height={720}
              decoding="async"
            />
          )
        )}
      </div>

      {shots.length > 1 && (
        <div className="grid grid-cols-4 gap-2 border-b border-line p-3 sm:gap-3 sm:px-6 sm:py-4">
          {shots.map((shot, i) => {
            const selected = i === active && !playing
            return (
              <button
                key={shot.src}
                type="button"
                onClick={() => {
                  setActive(i)
                  setPlaying(false)
                }}
                aria-pressed={selected}
                aria-label={`Show ${shot.alt}`}
                className={`aspect-video overflow-hidden rounded-lg border transition-all duration-150 ${
                  selected
                    ? 'border-slime-400/70 opacity-100'
                    : 'border-line opacity-60 hover:border-slime-400/30 hover:opacity-100'
                }`}
              >
                <img src={shot.src} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const FeaturedSection: React.FC = () => {
  const { items } = useItemsOfKind('project')
  const item = pickFeatured(items)
  if (!item) return null

  return (
    <Section id="featured" eyebrow="featured" title="Latest release">
      <article className="card overflow-hidden">
        <FeaturedMedia item={item} />

        <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[1.15fr_1fr]">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">{item.title}</h3>
              {item.period && <span className="font-mono text-xs text-fg-faint">{item.period}</span>}
            </div>
            {item.subtitle && <p className="mt-1 font-mono text-xs text-slime-300">{item.subtitle}</p>}
            {item.description && <p className="mt-4 leading-relaxed text-fg-muted">{item.description}</p>}

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
              <div className="mt-6 flex flex-wrap gap-3 md:mt-auto md:pt-6">
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    <Gamepad2 className="h-4 w-4" aria-hidden="true" />
                    Play in browser
                  </a>
                )}
                {item.repo_url && (
                  <a href={item.repo_url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                    <GithubIcon className="h-4 w-4" />
                    Source
                  </a>
                )}
              </div>
            )}
          </div>

          {item.highlights.length > 0 && (
            <div className="md:border-l md:border-line md:pl-8">
              <p className="eyebrow text-fg-faint">Highlights</p>
              <ul className="mt-3 space-y-2.5">
                {item.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm leading-relaxed text-fg-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slime-400" aria-hidden="true" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    </Section>
  )
}
