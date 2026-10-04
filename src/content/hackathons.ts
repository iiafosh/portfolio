import { site } from "./site"
import type { Hackathon } from "./types"

// Hackathons tab. Newest first.

export const hackathons: Hackathon[] = [
  {
    slug: "green-loop",
    name: "Green Loop",
    date: "2026-09-10",
    dateLabel: "Sep 10, 2026",
    host: "Horus University",
    location: "New Damietta, Egypt",
    result: { kind: "place", place: 3, label: "3rd Place", stamp: "3rd · qualified" },
    title: "ReSpark — give tech a second life",
    summary:
      "A competition for recycling university waste. The Horus University round picked the top 3 teams to represent the university nationally — we took 3rd with ReSpark and qualified.",
    project: "respark",
    role: "Mobile app, with Abdelrahman Mohsen",
    team: [
      { name: "Yousef Mohammed Salah", href: "https://yust.dev" },
      { name: "Abdelrahman Mohsen" },
    ],
    journey: [
      { label: "Horus University round", state: "done" },
      { label: "Top 3 · 3rd place", state: "done" },
      { label: "National round", state: "current" },
    ],
    facts: [
      { label: "Result", value: "3rd at HUE" },
      { label: "Team", value: "3" },
      { label: "My part", value: "Mobile" },
    ],
    story: [
      {
        title: "How it started",
        body: [
          "I was sitting with my colleague Yousef Salah when he said: “There's a competition — come with us.” (He basically kidnapped me.) Green Loop is a competition for recycling university waste, and the Horus round decided who represents the university across Egypt.",
        ],
      },
      {
        title: "What we built",
        body: [
          "ReSpark, a website and an app that recycle e-waste on two fronts: physical e-waste (old student hardware projects, taken apart and sold as parts) and virtual e-waste (software strategies that cut the energy and water AI burns in data centers).",
        ],
      },
    ],
    proofs: [
      {
        label: "Horus University — Green Loop winners",
        href: "https://horus.edu.eg/ar/hue_latest_news/green-loop-competition-2026-winners-ar/",
        kind: "news",
      },
      { label: "Official announcement", href: "https://www.facebook.com/share/p/1cKjehsJfs/", kind: "news" },
      { label: "respark.tech", href: "https://respark.tech", kind: "live" },
      { label: "My post", href: site.posts, kind: "post" },
    ],
  },
  {
    slug: "damietta-hackathon",
    name: "Damietta Hackathon",
    date: "2026-07-13",
    dateLabel: "Jul 13, 2026",
    host: "Damietta Hackathon",
    location: "Damietta, Egypt",
    result: { kind: "qualified", label: "Qualified", stamp: "Qualified" },
    title: "Smart Medical Watch — hardware + software",
    summary:
      "My first hackathon, in my first year of college. We passed the qualifiers and built a working medical watch — sensors, firmware and a live dashboard.",
    project: "smart-medical-watch",
    role: "Research & the LoRa link",
    team: [
      { name: "Abdullah Shata" },
      { name: "Noreen el Shenawey" },
      { name: "Ahmed Alsayed" },
      { name: "Noha Kamal" },
    ],
    journey: [
      { label: "Qualifiers", state: "done" },
      { label: "Hackathon · Jul 13", state: "done" },
      { label: "Working prototype", state: "done" },
    ],
    facts: [
      { label: "Result", value: "Qualified" },
      { label: "Board", value: "ESP32-C6" },
      { label: "Year", value: "First" },
    ],
    story: [
      {
        title: "Why a medical watch",
        body: [
          "Yes, this post was a little late — but on 13/7 my team and I competed in the Damietta Hackathon after qualifying in the preliminaries. Our idea: a medical watch plus a full software stack around it, so it became a hardware + software project.",
        ],
      },
      {
        title: "Inside the watch",
        list: [
          "A tiny XIAO ESP32-C6 as the brain, with a 1.28\" round TFT",
          "MPU6050 for steps and a MAX30100 for pulse (fixed with 4.7kΩ resistors)",
          "GPS for location, LoRa for radio",
          "Arduino IDE firmware streaming live to a web dashboard",
        ],
      },
    ],
    proofs: [{ label: "My post", href: site.posts, kind: "post" }],
  },
]

export function getHackathon(slug: string | null | undefined) {
  return hackathons.find((h) => h.slug === slug)
}
