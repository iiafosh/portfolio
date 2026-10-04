import React, { useState } from 'react'
import { Gamepad2, Globe, Monitor, Play, Smartphone, Terminal, type LucideIcon } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { useItemsOfKind } from '@/lib/content'
import { pickFeatured, releaseTag, shipsTo } from '@/lib/derive'
import type { PortfolioItem } from '@/content/types'

export { pickFeatured }

interface Shot {
  src: string
  alt: string
  label: string
}

/** Extra screenshots shipped in /public/media for fosh&fish. */
function screenshotsFor(item: PortfolioItem): Shot[] {
  const isFosh = item.id === 'proj-fosh-and-fish' || (item.image_url ?? '').includes('fosh-and-fish')
  if (!isFosh) return []
  const cover = item.image_url ?? '/media/fosh-and-fish-cover.jpg'
  return [
    { src: cover, alt: `${item.title} cover art`, label: 'Cover' },
    { src: '/media/fosh-and-fish-gameplay.jpg', alt: `${item.title} gameplay screenshot`, label: 'Gameplay' },
    { src: '/media/fosh-and-fish-biomes.jpg', alt: `${item.title} biomes screenshot`, label: 'Biomes' },
    { src: '/media/fosh-and-fish-shop.jpg', alt: `${item.title} shop screenshot`, label: 'Shop' },
  ]
}

function iconFor(item: PortfolioItem): string | null {
  return (item.image_url ?? '').includes('fosh-and-fish') ? '/media/fosh-and-fish-icon.png' : null
}

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  web: Globe,
  windows: Monitor,
  linux: Terminal,
  android: Smartphone,
}

export const FeaturedSection: React.FC = () => {
  const { items } = useItemsOfKind('project')
  const item = pickFeatured(items)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  if (!item) return null

  const shots = screenshotsFor(item)
  const image = shots[active]?.src ?? item.image_url
  const imageAlt = shots[active]?.alt ?? `${item.title} cover art`
  const platforms = shipsTo(item)
  const release = releaseTag(item)
  const icon = iconFor(item)
  // The "ships to" line is shown as badges, so keep it out of the bullet list.
  const highlights = item.highlights.filter((h) => !/\bships? to\b/i.test(h))

  return (
    <Section id="featured" eyebrow="featured" title="Latest release">
      <article className="card overflow-hidden rounded-3xl">
        {/* Stage */}
        <div className="relative aspect-[4/3] overflow-hidden bg-surface sm:aspect-video">
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
              Your browser can&apos;t play this video.{' '}
              <a className="link" href={item.video_url}>
                Download the trailer
              </a>
              .
            </video>
          ) : (
            <>
              {image && (
                <img
                  key={image}
                  src={image}
                  alt={imageAlt}
                  className="absolute inset-0 h-full w-full animate-[fade-up_0.5s_ease-out_both] object-cover"
                  width={1280}
                  height={720}
                  decoding="async"
                  loading="lazy"
                />
              )}
              {/* Scrim: strongest top-left, where the title plate sits (the cover
                  art carries its own logo bottom-right). */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(120% 95% at 0% 0%, rgb(var(--bg) / 0.94) 0%, rgb(var(--bg) / 0.7) 30%, rgb(var(--bg) / 0) 62%), linear-gradient(to top, rgb(var(--bg) / 0.55), rgb(var(--bg) / 0) 30%)',
                }}
              />

              {item.video_url && (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="group absolute inset-0 flex items-center justify-center"
                  aria-label={`Play the ${item.title} trailer`}
                >
                  <span className="relative flex h-16 w-16 items-center justify-center sm:h-24 sm:w-24">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-accent/25 transition-transform duration-500 group-hover:scale-125"
                    />
                    <span className="relative flex h-full w-full items-center justify-center rounded-full bg-accent text-bg shadow-[0_0_0_6px_rgb(var(--bg)/0.35),0_20px_50px_-10px_rgb(var(--accent)/0.7)] transition-transform duration-300 group-hover:scale-105">
                      <Play className="ml-1 h-7 w-7 fill-current sm:h-9 sm:w-9" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-bg/75 px-3 py-1.5 font-pixel text-[10px] uppercase tracking-[0.16em] text-text backdrop-blur sm:bottom-5 sm:left-5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                    Watch trailer
                  </span>
                </button>
              )}

              {/* Title plate */}
              <div className="pointer-events-none absolute left-0 top-0 flex max-w-[85%] items-start gap-3 p-4 [text-shadow:0_2px_12px_rgba(0,0,0,0.85)] sm:gap-4 sm:p-8">
                {/* The cover art already carries the app icon. */}
                {icon && image !== item.image_url && (
                  <img
                    src={icon}
                    alt=""
                    width={64}
                    height={64}
                    className="h-11 w-11 shrink-0 rounded-xl shadow-card ring-1 ring-white/15 sm:h-16 sm:w-16 sm:rounded-2xl"
                    loading="lazy"
                  />
                )}
                <div className="min-w-0">
                  <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-accent sm:text-[11px]">
                    {[item.period, release].filter(Boolean).join(' · ')}
                  </p>
                  <h3 className="mt-1 font-hero text-2xl font-black leading-none tracking-tight text-white sm:text-5xl">
                    {item.title}
                  </h3>
                  {item.subtitle && <p className="mt-1.5 text-xs font-medium text-text sm:mt-2 sm:text-sm">{item.subtitle}</p>}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Screenshot strip */}
        {shots.length > 1 && (
          <div className="grid grid-cols-4 gap-2 border-b border-line bg-bg/40 p-2.5 sm:gap-3 sm:p-4">
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
                  className={`group relative aspect-video min-h-11 overflow-hidden rounded-lg ring-1 transition-[opacity,box-shadow] duration-200 ${
                    selected ? 'opacity-100 ring-2 ring-accent' : 'opacity-55 ring-line hover:opacity-100 hover:ring-accent/40'
                  }`}
                >
                  <img src={shot.src} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                  <span className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-bg/90 to-transparent px-2 pb-1 pt-4 text-left font-pixel text-[9px] uppercase tracking-[0.14em] text-text sm:block">
                    {shot.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Body */}
        <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[1.2fr_1fr] md:gap-10">
          <div className="flex flex-col">
            {item.description && <p className="text-[15px] leading-relaxed text-muted">{item.description}</p>}

            {platforms.length > 0 && (
              <div className="mt-6">
                <p className="label">Ships to</p>
                <ul className="mt-2.5 flex flex-wrap gap-2" aria-label="Platforms">
                  {platforms.map((p) => {
                    const Icon = PLATFORM_ICONS[p.toLowerCase()] ?? Gamepad2
                    return (
                      <li
                        key={p}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-accent-3/25 bg-accent-3/[0.07] px-2.5 text-xs font-medium text-accent-3"
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {p}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {(item.url || item.repo_url) && (
              <div className="mt-7 flex flex-wrap gap-3 md:mt-auto md:pt-7">
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

          {(highlights.length > 0 || item.tags.length > 0) && (
            <div className="md:border-l md:border-line md:pl-10">
              {highlights.length > 0 && (
                <>
                  <p className="label">Patch notes</p>
                  <ul className="ticks mt-3 space-y-2.5">
                    {highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </>
              )}
              {item.tags.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Built with">
                  {item.tags.map((tag) => (
                    <li key={tag} className="chip">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </article>
    </Section>
  )
}
