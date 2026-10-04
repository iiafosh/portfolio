import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "next-themes"

import { Ambient } from "@/components/ambient"
import { Dock } from "@/components/dock"
import { SiteFooter } from "@/components/site-footer"
import { Slime } from "@/components/slime/slime"
import { site } from "@/content/site"
import { roboto } from "@/lib/fonts"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.headline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: `${site.handle} · ${site.name}`,
  authors: [{ name: site.name, url: site.socials.github.href }],
  creator: site.name,
  keywords: [
    site.name,
    site.handle,
    "Horus University",
    "AI & Informatics",
    "Robotics",
    "fosh&fish",
    "ReSpark",
    "Godot",
    "ESP32",
    "hackathon",
    "Egypt",
  ],
  openGraph: {
    type: "profile",
    siteName: `${site.name} · ${site.handle}`,
    title: `${site.name} — ${site.headline}`,
    description: site.description,
    url: site.url,
    locale: "en_US",
    firstName: "Mostafa",
    lastName: "Kmal",
    username: site.handle,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.headline}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a1814" },
    { media: "(prefers-color-scheme: light)", color: "#fcfcfb" },
  ],
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.handle,
  url: site.url,
  image: `${site.url}${site.avatar}`,
  jobTitle: site.headline,
  affiliation: { "@type": "CollegeOrUniversity", name: site.university.name, url: site.university.href },
  address: { "@type": "PostalAddress", addressLocality: "Mansoura", addressCountry: "EG" },
  sameAs: [site.socials.github.href, site.socials.linkedin.href],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${roboto.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <a
            href="#main"
            className="fixed top-3 left-3 z-[400] -translate-y-20 rounded-full bg-foreground px-4 py-2 text-sm text-background transition-transform focus-visible:translate-y-0"
          >
            Skip to content
          </a>
          <Ambient />
          <div className="flex min-h-dvh flex-col">
            <main id="main" className="flex-1 pt-14 sm:pt-24">
              {children}
            </main>
            <SiteFooter />
          </div>
          <Dock />
          <Slime />
        </ThemeProvider>
      </body>
    </html>
  )
}
