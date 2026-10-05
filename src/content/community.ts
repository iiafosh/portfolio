import type { Community } from "./types"

// Community tab — clubs and communities, each one a badge on a lanyard.

export const communities: Community[] = [
  {
    slug: "icpc-hue",
    name: "ICPC HUE",
    badge: "ICPC HUE",
    kind: "Competitive programming community",
    role: "Competitive programmer",
    since: "2026-01",
    sinceLabel: "Jan 2026 — now",
    where: "Horus University",
    description:
      "One day I was sitting in college doing nothing much when I stumbled on a community called ICPC HUE. I had no idea what ICPC even was — so I joined to find out. Eight months later the community had grown to 16 teams, and we went to the ECPC qualifications together.",
    highlights: [
      "Training on algorithms and data structures for ICPC-style contests",
      "My team ranked #1 at Horus in the ECPC 2026 qualifications",
      "Hoping to qualify next year with the community",
    ],
    stats: [
      { label: "Teams", value: "16" },
      { label: "ECPC at HUE", value: "#1" },
      { label: "Problems", value: "4 / 5h" },
    ],
    people: {
      label: "Coaches & TAs",
      list: [{ name: "Fatma Magdy" }, { name: "Asem Gado" }, { name: "Raafat M. Elmenayar" }, { name: "Sara Lotfy" }],
    },
    tags: ["C++", "Algorithms", "Problem solving"],
    links: [{ label: "icpchue.com", href: "https://icpchue.com", kind: "site" }],
    strap: "#3b82f6",
  },
  {
    slug: "axis",
    name: "AXIS",
    badge: "AXIS",
    kind: "Student club · Faculty of AI",
    role: "Member of Technical Staff",
    since: "2025-12",
    sinceLabel: "Dec 2025 — now",
    where: "Horus University · hybrid",
    description:
      "Technical member of AXIS, one of the student clubs at the Faculty of Artificial Intelligence at Horus University.",
    highlights: [
      "On the technical staff since my first semester",
    ],
    tags: ["Python", "Teamwork"],
    links: [],
    strap: "#a855f7",
  },
]
