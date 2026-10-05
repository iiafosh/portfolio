import { site } from "./site"
import type { Achievement } from "./types"

// Achievements tab — each one sits on the trophy shelf. Newest first.

export const achievements: Achievement[] = [
  {
    slug: "green-loop-3rd",
    title: "3rd Place",
    event: "Green Loop — Horus University round",
    issuer: "Horus University",
    date: "2026-09",
    dateLabel: "Sep 2026",
    object: "trophy",
    metal: "bronze",
    engraving: "3RD",
    description:
      "Top 3 at Horus University with ReSpark, which qualified us to represent the university in the national round of the Green Loop recycling competition.",
    stats: [
      { label: "Place at HUE", value: 3, prefix: "#" },
    ],
    team: [{ name: "Yousef Mohammed Salah", href: "https://yust.dev" }, { name: "Abdelrahman Mohsen" }],
    related: { hackathon: "green-loop", project: "respark" },
    proofs: [
      {
        label: "Horus University — winners",
        href: "https://horus.edu.eg/ar/hue_latest_news/green-loop-competition-2026-winners-ar/",
        kind: "news",
      },
      { label: "Official announcement", href: "https://www.facebook.com/share/p/1cKjehsJfs/", kind: "news" },
    ],
  },
  {
    slug: "ecpc-2026",
    title: "#1 at Horus",
    event: "ECPC 2026 Qualifications",
    issuer: "ICPC · Egyptian Collegiate Programming Contest",
    date: "2026-08",
    dateLabel: "Aug 2026",
    object: "medal",
    metal: "gold",
    engraving: "#1",
    description:
      "With the ICPC HUE community, my team ranked #1 among Horus University teams in the ECPC qualifications — #189 on Day 7 — solving 4 problems in 5 hours, in our first year of college.",
    stats: [
      { label: "Rank at Horus", value: 1, prefix: "#" },
      { label: "Rank on Day 7", value: 189, prefix: "#" },
      { label: "Problems solved", value: 4 },
      { label: "Contest hours", value: 5 },
    ],
    team: [{ name: "Abdullah Shata" }, { name: "Mohammed Ayman" }],
    related: { community: "icpc-hue" },
    proofs: [
      { label: "My post", href: site.posts, kind: "post" },
      { label: "ICPC HUE", href: "https://icpchue.com", kind: "site" },
    ],
  },
  {
    slug: "damietta-qualified",
    title: "Qualified",
    event: "Damietta Hackathon",
    issuer: "Damietta Hackathon",
    date: "2026-07",
    dateLabel: "Jul 2026",
    object: "ribbon",
    metal: "silver",
    engraving: "Q",
    description:
      "Passed the preliminaries in my first year of college and built a working hardware + software wearable on the day: the Smart Medical Watch.",
    stats: [
      { label: "Sensors wired", value: 3 },
      { label: "The resistor fix", value: 4.7, suffix: "kΩ" },
      { label: "Year at college", value: 1, prefix: "Y" },
    ],
    team: [
      { name: "Abdullah Shata" },
      { name: "Noreen el Shenawey" },
      { name: "Ahmed Alsayed" },
      { name: "Noha Kamal" },
    ],
    related: { hackathon: "damietta-hackathon", project: "smart-medical-watch" },
    proofs: [{ label: "My post", href: site.posts, kind: "post" }],
  },
]
