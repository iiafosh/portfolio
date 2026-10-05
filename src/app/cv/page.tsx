import type { Metadata } from "next"
import Link from "next/link"

import { CvDocument } from "@/components/cv/cv-document"
import { CvSheet, PrintButton } from "@/components/cv/cv-sheet"
import { ArrowRight } from "@/components/icons"
import { site } from "@/content/site"

export const metadata: Metadata = {
  title: "CV",
  description: `One-page CV of ${site.name} — AI & Informatics (Robotics) student at Horus University in Egypt.`,
  alternates: { canonical: "/cv" },
}

export default function CvPage() {
  return (
    <div className="cv-screen mx-auto w-full max-w-[60rem] px-4 sm:px-6" data-column="wide">
      <div className="cv-toolbar enter mx-auto mb-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-3">
        <div>
          <p className="page-eyebrow">Curriculum vitae</p>
          <p className="mt-1.5 text-sm text-muted-foreground">One page · A4 · prints exactly like this</p>
        </div>
        <div className="flex items-center gap-2">
          <PrintButton className="btn-pill btn-pill-ghost h-8 px-3.5 text-[0.8125rem]">Print</PrintButton>
          <a href="/cv.pdf" download={`${site.name.replace(/\s+/g, "-")}-CV.pdf`} className="btn-pill btn-pill-primary h-8 px-3.5 text-[0.8125rem]">
            Download PDF
            <ArrowRight className="size-3.5 rotate-90" />
          </a>
        </div>
      </div>

      <div className="enter" style={{ "--enter-delay": "60ms" } as React.CSSProperties}>
        <CvSheet>
          <CvDocument />
        </CvSheet>
      </div>

      <p className="cv-toolbar mx-auto mt-6 max-w-[210mm] text-center text-xs text-muted-foreground">
        Prefer the long version?{" "}
        <Link href="/projects" className="link-dotted">
          Every project
        </Link>{" "}
        and{" "}
        <Link href="/hackathons" className="link-dotted">
          every hackathon
        </Link>{" "}
        has its own page.
      </p>
    </div>
  )
}
