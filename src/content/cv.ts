import { site } from "./site"

// The one-page CV (/cv, and /cv.pdf). Written in résumé voice — tight,
// outcome-first bullets — from the same facts as the rest of the site.

export interface CvEntry {
  title: string
  /** Linked part of the title, e.g. the project name. */
  link?: { label: string; href: string }
  date: string
  sub?: string
  bullets?: string[]
}

export interface CvBullet {
  lead: string
  link?: { label: string; href: string }
  text: string
  date?: string
}

export const cv = {
  name: site.name,
  headline: "AI & Informatics (Robotics) Student · Games, Apps & Hardware",
  contact: [
    { kind: "linkedin", label: "linkedin.com/in/mostafa-kmal-3731453a9", href: site.socials.linkedin.href },
    { kind: "github", label: "github.com/iiafosh", href: site.socials.github.href },
    { kind: "web", label: "afosh.dev", href: site.url },
    { kind: "mail", label: site.email, href: `mailto:${site.email}` },
    { kind: "pin", label: site.location },
  ],
  education: [
    {
      title: "Horus University — B.S. in Artificial Intelligence & Informatics (Robotics)",
      date: "Sep 2025 – Present",
      sub: "Level 2 · Faculty of Artificial Intelligence · New Damietta, Egypt",
    },
  ] satisfies CvEntry[],
  awards: [
    {
      lead: "3rd Place",
      link: {
        label: "Green Loop Competition",
        href: "https://horus.edu.eg/ar/hue_latest_news/green-loop-competition-2026-winners-ar/",
      },
      text: ", Horus University round with ReSpark — qualified to represent the university nationally.",
      date: "Sep 2026",
    },
    {
      lead: "Rank #1 at Horus University",
      link: { label: "ECPC 2026 Qualifications", href: "https://icpchue.com" },
      text: " with ICPC HUE — #189 on Day 7, 4 problems solved in 5 hours as first-year students.",
      date: "Aug 2026",
    },
    {
      lead: "Qualified",
      link: { label: "Damietta Hackathon", href: site.posts },
      text: " — passed the preliminaries and built a working ESP32 medical wearable on site.",
      date: "Jul 2026",
    },
  ] satisfies CvBullet[],
  projects: [
    {
      title: "Cozy 3D Fishing Game, Godot 4 + Blender",
      link: { label: "fosh&fish", href: "https://github.com/iiafosh/fosh-and-fish" },
      date: "Oct 2026",
      bullets: [
        "Rebuilt the Virtual Fisher Discord bot as a full game: 20 fish, 21 rods, 17 boats, 8 baits and 7 biomes balanced against the bot's data; ships to Web, Windows, Linux and Android.",
        "Built a scripted Blender art pipeline, headless simulation tests for mechanics and balance, and an automated trailer pipeline; open source under MIT.",
      ],
    },
    {
      title: "E-Waste Recycling Platform & Mobile App",
      link: { label: "ReSpark", href: "https://respark.tech" },
      date: "Sep 2026",
      bullets: [
        "Built the mobile application with a teammate for a platform where students resell parts of old hardware projects, plus software strategies that cut AI energy and water use.",
        "Won 3rd Place at Green Loop (HUE round) in a team of three; qualified for the national round.",
      ],
    },
    {
      title: "ESP32 Wearable & Live Dashboard",
      link: { label: "Smart Medical Watch", href: site.posts },
      date: "Jul 2026",
      bullets: [
        "XIAO ESP32-C6 watch with a 1.28\" round TFT, MPU6050 step counting, MAX30100 pulse sensing (stabilised with 4.7kΩ resistors), GPS and LoRa, streaming live readings over Wi-Fi to a web dashboard.",
        "Led the technical research and helped build the LoRa link for the Damietta Hackathon.",
      ],
    },
    {
      title: "Predictive Maintenance with Machine Learning",
      link: { label: "Robo-Space", href: site.posts },
      date: "Jun 2026",
      bullets: [
        "Random Forest classifier detecting 6 machine-failure types from temperature, RPM and torque, with a Tkinter dashboard, ROC and feature-importance plots, and text-to-speech alerts (team of 6).",
      ],
    },
    {
      title: "Numerical Methods Solver",
      link: { label: "NumLab", href: site.posts },
      date: "Jun 2026",
      bullets: [
        "Desktop solver with every numerical algorithm hand-written in Python and a CustomTkinter interface (team of 6).",
      ],
    },
  ] satisfies CvEntry[],
  skills: [
    { label: "Languages", items: "Python, C++, TypeScript, GDScript, Supabase" },
    { label: "AI & Data", items: "scikit-learn, Pandas, Matplotlib, Random Forest, Gemini API, Computer Vision (YOLO)" },
    { label: "Hardware & IoT", items: "ESP32 (XIAO ESP32-C6), Arduino IDE, LoRa, MPU6050, MAX30100, GPS modules" },
    { label: "Games & 3D", items: "Godot 4, Blender, game balancing, multi-platform export" },
    { label: "Web & Tools", items: "React, Next.js, Vite, Tailwind CSS, CustomTkinter, Git & GitHub, GitHub Actions" },
  ],
  community: [
    {
      lead: "Competitive Programmer,",
      link: { label: "ICPC HUE", href: "https://icpchue.com" },
      text: " — training with the community's 16 teams on algorithms and data structures; team ranked #1 at Horus in the ECPC 2026 qualifications.",
      date: "Jan 2026 – Present",
    },
    {
      lead: "Member of Technical Staff, AXIS",
      text: " — technical member of the student club at the Faculty of Artificial Intelligence, Horus University.",
      date: "Dec 2025 – Present",
    },
  ] satisfies CvBullet[],
}
