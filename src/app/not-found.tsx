import type { Metadata } from "next"
import Link from "next/link"

import { Barcode } from "@/components/barcode"
import { ArrowRight } from "@/components/icons"
import { PixelCluster } from "@/components/marks"
import { NotFoundNudge } from "@/components/slime/not-found-nudge"

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
}

// cali.so's error proof sheet, with the slime as the usual suspect.
export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[var(--column)] px-6">
      <NotFoundNudge />
      <div className="relative mt-6 overflow-hidden rounded-2xl p-8 shadow-[inset_0_0_0_1px_var(--border)] sm:p-12">
        <div className="flex items-start justify-between gap-4">
          <p className="page-eyebrow enter">Error</p>
          <PixelCluster variant={5} className="enter" />
        </div>
        <h1 className="enter mt-6 font-display font-bold tracking-[-0.045em] text-[6rem] leading-none tracking-[-0.06em] text-foreground sm:text-[8rem]" style={{ "--enter-delay": "40ms" } as React.CSSProperties}>
          404
        </h1>
        <p className="enter page-introduction mt-4 max-w-[26rem]" style={{ "--enter-delay": "90ms" } as React.CSSProperties}>
          This page slimed away. Everything that exists lives in one of the tabs below.
        </p>
        <div className="enter mt-8 flex flex-wrap gap-2.5" style={{ "--enter-delay": "140ms" } as React.CSSProperties}>
          <Link href="/" className="btn-pill btn-pill-primary">
            Back home
            <ArrowRight className="size-4" />
          </Link>
          <Link href="/projects" className="btn-pill btn-pill-ghost">
            Projects
          </Link>
          <Link href="/hackathons" className="btn-pill btn-pill-ghost">
            Hackathons
          </Link>
        </div>
        <Barcode code="ERR-404-AFOSH" className="absolute right-8 bottom-8 hidden w-40 text-muted-foreground/60 sm:block" />
      </div>
    </div>
  )
}
