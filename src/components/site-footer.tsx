import Link from "next/link"

import { NAV } from "@/content/nav"
import { site } from "@/content/site"
import { brailleText } from "@/lib/braille"
import { FooterClock } from "./footer-clock"
import { ArrowNE } from "./icons"

// Swiss editorial footer set as folder trees (cali.so): contact, index,
// and a colophon with the copyright, the name in braille and the local clock.

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-24 w-full max-w-[var(--column)] px-6 pb-28 text-sm text-muted-foreground">
      <div className="hairline-top grid grid-cols-2 gap-x-6 gap-y-9 pt-8 sm:grid-cols-[1.2fr_1fr_1fr]">
        <div className="col-span-2 flex flex-col justify-between gap-6 sm:order-first sm:col-span-1">
          <div>
            <p className="text-foreground">
              © {new Date().getFullYear()} {site.name}
            </p>
            <p className="footer-braille" aria-hidden="true">
              {brailleText(site.name)}
            </p>
          </div>
          <FooterClock />
        </div>

        <div className="footer-tree">
          <h2 className="footer-label">contact</h2>
          <ul>
            <li>
              <a href={site.socials.github.href} target="_blank" rel="noopener noreferrer">
                GitHub
                <ArrowNE className="external-mark" />
              </a>
            </li>
            <li>
              <a href={site.socials.linkedin.href} target="_blank" rel="noopener noreferrer">
                LinkedIn
                <ArrowNE className="external-mark" />
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>Email</a>
            </li>
            <li>
              <Link href="/cv">CV</Link>
            </li>
          </ul>
        </div>

        <div className="footer-tree">
          <h2 className="footer-label">index</h2>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </footer>
  )
}
