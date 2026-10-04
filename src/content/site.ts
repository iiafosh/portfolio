// Who this site is about. Everything personal lives here.
// Sources: Mostafa's LinkedIn posts (Oct 2026), github.com/iiafosh and the
// first afosh portfolio (github.com/iiafosh/portfolio).

export const site = {
  name: "Mostafa Kmal",
  fullName: "Mostafa Kmal",
  firstName: "Mostafa",
  handle: "afosh",
  headline: "AI & Informatics (Robotics) student",
  tagline: "Games, apps & hardware — built at hackathons and late at night.",
  description:
    "Mostafa Kmal (afosh) is an AI & Informatics (Robotics) student at Horus University in Egypt who builds games, mobile apps and hardware: the fosh&fish fishing game, the ReSpark e-waste app and an ESP32 smart medical watch.",
  url: "https://afosh.dev",
  university: {
    name: "Horus University in Egypt",
    short: "HUE",
    faculty: "Faculty of Artificial Intelligence",
    program: "AI & Informatics (Robotics)",
    level: "Level 2",
    href: "https://horus.edu.eg",
  },
  location: "Mansoura, Egypt",
  timeZone: "Africa/Cairo",
  email: "mk1440165@gmail.com",
  availability: "Open to internships & freelance",
  avatar: "/media/avatar.jpg",
  socials: {
    github: { label: "GitHub", handle: "iiafosh", href: "https://github.com/iiafosh" },
    linkedin: {
      label: "LinkedIn",
      handle: "mostafa-kamal",
      href: "https://www.linkedin.com/in/mostafa-kamal-3731453a9/",
    },
  },
  /** LinkedIn activity feed — the source for every story on this site. */
  posts: "https://www.linkedin.com/in/mostafa-kamal-3731453a9/recent-activity/all/",
  repo: "https://github.com/iiafosh/portfolio",
  /** The pet that lives in the dock. */
  pet: { name: "Rimuru" },
} as const

export type Site = typeof site
