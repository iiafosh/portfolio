/** True when a free-text period like "2024 — Present" describes something ongoing. */
export function isCurrentPeriod(period: string | null | undefined): boolean {
  return !!period && /\b(present|now|current)\b/i.test(period)
}

/** "https://www.github.com/iiafosh/" -> "github.com/iiafosh" (for printed links). */
export function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
}
