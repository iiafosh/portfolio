import { site } from "./site"
import type { Project, ProjectCategory } from "./types"

// Projects tab. Newest first; `size: "hero"` fills the bento's full width at
// double height, `size: "wide"` takes both columns.
// Stories are Mostafa's own LinkedIn posts, translated from Arabic.

export const PROJECT_CATEGORIES: readonly ("All" | ProjectCategory)[] = [
  "All",
  "Games",
  "Hardware",
  "AI",
  "Apps",
  "Web",
]

export const projects: Project[] = [
  {
    slug: "fosh-and-fish",
    title: "fosh&fish",
    tagline: "My first game — a cozy fishing game in Godot 4",
    summary:
      "A cozy top-down fishing game rebuilt from the Virtual Fisher Discord bot I was hooked on. Cast, catch, sell, upgrade your rod and boat, and travel through 7 biomes from the River to the Abyss.",
    date: "2026-10",
    period: "Oct 2026",
    categories: ["Games"],
    status: "0.1 beta · playable",
    size: "hero",
    featured: true,
    cover: {
      src: "/media/fosh-and-fish-cover.webp",
      alt: "fosh&fish cover: a fisherman casting from a boat near a beach shop",
      width: 1280,
      height: 720,
    },
    cardImage: {
      src: "/media/fosh-and-fish-gameplay.webp",
      alt: "fosh&fish gameplay: a cruise ship fishing in a coral sea",
      position: "50% 46%",
      zoom: 1.2,
      width: 1280,
      height: 720,
    },
    gallery: [
      { src: "/media/fosh-and-fish-gameplay.webp", alt: "fosh&fish gameplay", width: 1280, height: 720 },
      { src: "/media/fosh-and-fish-biomes.webp", alt: "The seven fosh&fish biomes", width: 1280, height: 720 },
      { src: "/media/fosh-and-fish-shop.webp", alt: "The fosh&fish shop screen", width: 1280, height: 720 },
    ],
    video: {
      src: "/media/fosh-and-fish-trailer.webm",
      poster: "/media/fosh-and-fish-cover.webp",
    },
    vignette: "fish",
    role: "Solo — design, Godot scripting, Blender art pipeline, releases",
    stack: ["Godot 4", "GDScript", "Blender", "Python", "AI-assisted dev"],
    highlights: [
      "20 fish, 21 rods, 17 boats, 8 baits and 7 biomes, balanced against the original bot's data",
      "Ships to Web, Windows, Linux and Android from one Godot project",
      "Every sprite rendered through a scripted Blender pipeline",
      "Headless simulation tests for mechanics and balance, plus an automated trailer pipeline",
    ],
    links: [
      { label: "Play in the browser", href: "https://iiafosh.github.io/fosh-and-fish/", kind: "live" },
      { label: "Source on GitHub", href: "https://github.com/iiafosh/fosh-and-fish", kind: "repo" },
      { label: "Download for Windows, Linux, Android", href: "https://github.com/iiafosh/fosh-and-fish/releases", kind: "download" },
    ],
    story: [
      {
        title: "Why a fishing game?",
        body: [
          "It started with a strange addiction: a fishing bot inside Discord. The game has no UI/UX at all — it's a button press in a chat. So I asked myself: what if I rebuilt it from scratch as a real game on an engine like Godot?",
          "The result turned out even more addictive than the original.",
        ],
      },
      {
        title: "Art before code",
        body: [
          "Before writing a single line I lived on Pinterest to settle the art style and the theme. I don't believe in reinventing the wheel, so I collected free 3D models from itch.io and Sketchfab and reworked them in Blender.",
        ],
      },
      {
        title: "Into Godot",
        body: [
          "My first time with the engine. I learned how to compose a scene and wire 3D models to scripts, movement and interaction.",
        ],
        quote:
          "Honestly, I leaned on AI to write and tune the scripts. After some mutual suffering with it, the first version came to life.",
      },
      {
        title: "What's in 0.1 beta",
        list: [
          "Chests, Gold / Emerald / Lava / Diamond fish, 8 charms and 5 pets",
          "Shop, league upgrades, boosts and workers, daily and weekly quests",
          "Prestige with its own shop, and a guided start for new players",
          "Saves automatically — on desktop and in the browser",
        ],
      },
    ],
  },
  {
    slug: "respark",
    title: "ReSpark",
    tagline: "Give tech a second life — e-waste on two fronts",
    summary:
      "A website and mobile app that recycles e-waste on two fronts: students sell the parts of old hardware projects to other students, and AI workloads get software strategies that cut the energy and water data centers burn.",
    date: "2026-09",
    period: "Sep 2026",
    categories: ["Apps", "Web", "AI"],
    status: "3rd place · Green Loop",
    featured: true,
    cover: {
      src: "/media/respark-booth.webp",
      alt: "Standing next to the ReSpark roll-up banner at Green Loop",
      position: "50% 30%",
      width: 960,
      height: 1706,
    },
    vignette: "respark",
    role: "Mobile app — built with Abdelrahman Mohsen",
    team: [
      { name: "Yousef Mohammed Salah", href: "https://yust.dev" },
      { name: "Abdelrahman Mohsen" },
    ],
    stack: ["Mobile app", "Web platform", "Green AI", "Team of 3"],
    highlights: [
      "3rd place in the Horus University round — qualified to represent HUE nationally",
      "I built the mobile application with a teammate",
    ],
    links: [
      { label: "respark.tech", href: "https://respark.tech", kind: "live" },
      { label: "The story on LinkedIn", href: site.posts, kind: "post" },
    ],
    hackathon: "green-loop",
    story: [
      {
        title: "Physical e-waste",
        body: [
          "Built a hardware project for a course or a training that's now collecting dust? Instead of throwing it away, ReSpark lets you take it apart and sell its parts to other students who can use them — and make some money back.",
        ],
      },
      {
        title: "Virtual e-waste",
        body: [
          "AI models run inside data centers that consume huge amounts of electricity, and water for cooling. ReSpark offers specific software strategies that reduce the load on AI — saving real energy and resources, and cutting your AI costs when you build on ReSpark.",
        ],
      },
      {
        title: "My part",
        body: [
          "I built the mobile application together with Abdelrahman Mohsen, with Yousef Mohammed Salah — the best team I've worked with.",
        ],
      },
    ],
  },
  {
    slug: "smart-medical-watch",
    title: "Smart Medical Watch",
    tagline: "An ESP32 wearable streaming heart rate & steps live",
    summary:
      "A wearable that counts steps and reads heart rate, then streams the data over Wi-Fi to a live web dashboard — hardware and software, built for the Damietta Hackathon.",
    date: "2026-07",
    period: "Jul 2026",
    categories: ["Hardware"],
    status: "Hackathon build",
    cover: {
      src: "/media/damietta-hackathon.webp",
      alt: "The team at the Damietta Hackathon with the dashboard on two laptops",
      position: "50% 40%",
      width: 652,
      height: 490,
    },
    vignette: "watch",
    cardMedia: "vignette",
    role: "Technical research & the LoRa link",
    team: [
      { name: "Abdullah Shata" },
      { name: "Noreen el Shenawey" },
      { name: "Ahmed Alsayed" },
      { name: "Noha Kamal" },
    ],
    stack: ["XIAO ESP32-C6", "Arduino IDE", "MPU6050", "MAX30100", "GPS", "LoRa", "1.28\" round TFT"],
    highlights: [
      "XIAO ESP32-C6 driving a 1.28\" round TFT, small enough to wear",
      "MPU6050 step counting and a MAX30100 pulse sensor",
      "Fixed unreliable pulse readings with 4.7kΩ resistors",
      "Live data to a web dashboard over the watch's own Wi-Fi connection",
    ],
    links: [{ label: "The story on LinkedIn", href: site.posts, kind: "post" }],
    hackathon: "damietta-hackathon",
    story: [
      {
        title: "The idea",
        body: [
          "A medical watch plus the full software around it — a real hardware + software product. Two sensors do the work, a bio sensor and an accelerometer, counting your steps and your heart rate, and everything lands nicely laid out in a web GUI.",
        ],
      },
      {
        title: "How we built the hardware",
        list: [
          "Brain: a tiny Seeed XIAO ESP32-C6 that fits a watch",
          "Display: a 1.28\" round TFT so it looks and feels like a real watch",
          "Steps: an MPU6050 motion sensor",
          "Pulse: a MAX30100 — it only read correctly after adding 4.7kΩ resistors",
          "Location: a GPS module; radio: LoRa",
        ],
      },
      {
        title: "Software",
        body: [
          "Everything is programmed in the Arduino IDE. The watch opens its own access point to join Wi-Fi and pushes every reading live to our dashboard.",
        ],
      },
      {
        title: "My part",
        body: ["Full technical research, and helping build the LoRa link in the hardware."],
        quote: "The MAX30100 kept throwing errors until we added 4.7kΩ resistors. Then it finally read right.",
      },
    ],
  },
  {
    slug: "robo-space",
    title: "Robo-Space",
    tagline: "Predicting machine failures before they happen",
    summary:
      "An AI-powered predictive maintenance system that analyzes industrial sensor data to predict machine failures before they happen — to cut downtime and repair costs.",
    date: "2026-06",
    period: "Jun 2026",
    categories: ["AI"],
    status: "Course project",
    vignette: "robo",
    role: "Teammate in a team of six",
    team: [
      { name: "Mohammed Ayman" },
      { name: "Abdullah Shata" },
      { name: "Abdelrahman Elshazly" },
      { name: "Ibrahim Kaml" },
      { name: "Abdo Ibrahim" },
    ],
    stack: ["Python", "scikit-learn", "Pandas", "Tkinter", "Matplotlib"],
    highlights: [
      "Random Forest classifier detecting 6 types of machine failure",
      "Live failure probabilities from temperature, RPM and torque",
      "ROC curves, feature importance and distribution plots",
      "Spoken text-to-speech alerts for instant diagnostics",
    ],
    links: [{ label: "Team post on LinkedIn", href: site.posts, kind: "post" }],
    story: [
      {
        title: "The problem",
        body: [
          "Unplanned downtime is expensive in industry. Robo-Space reads sensor data and predicts failures before they happen, so maintenance happens on a schedule instead of after a breakdown.",
        ],
      },
      {
        title: "What it does",
        list: [
          "AI model: a Random Forest trained to detect 6 different machine failure types",
          "Interactive dashboard: real-time analysis of temperature, RPM and torque inputs",
          "Analytics: ROC curves, feature importance and distribution plots",
          "Smart alerts: integrated text-to-speech for audio diagnostics",
        ],
      },
    ],
  },
  {
    slug: "numlab",
    title: "NumLab",
    tagline: "A desktop solver for numerical methods",
    summary:
      "A desktop program that solves numerical methods equations. Six first-year AI students wrote every algorithm by hand in Python.",
    date: "2026-06",
    period: "Jun 2026",
    categories: ["Apps"],
    status: "Course project",
    vignette: "numlab",
    role: "Teammate — algorithms in Python",
    team: [
      { name: "Abdullah Shata" },
      { name: "Mohammed Ayman" },
      { name: "Abdelrahman Elshazly" },
      { name: "Ibrahim Kaml" },
      { name: "Abdo Ibrahim" },
    ],
    stack: ["Python", "Numerical methods", "CustomTkinter"],
    highlights: [
      "All core logic and math algorithms written by the team in Python",
      "Focus on correct math and clean code",
      "CustomTkinter interface, built with AI tools as the course rules allowed",
    ],
    links: [{ label: "Team post on LinkedIn", href: site.posts, kind: "post" }],
    story: [
      {
        title: "How we made it",
        body: [
          "We were a team of six level-1 students at the Faculty of Artificial Intelligence, and this was our Numerical Methods course project. We wrote all of the core logic and math algorithms ourselves in Python, and cared most about getting the math right and the code clean.",
        ],
      },
      {
        title: "An honest note",
        quote:
          "We hadn't studied GUIs yet, so we used AI tools (Gemini and Claude) to build the CustomTkinter interface — allowed by the project rules — while we focused on the logic.",
      },
    ],
  },
  {
    slug: "afosh-ai",
    title: "Afosh AI",
    tagline: "A street-smart tech mentor, as a chatbot",
    summary:
      "A persona chatbot built for a Microsoft Student Club session at HUE: a street-smart tech mentor that explains Python, C++ and computer vision with an Egyptian twist.",
    date: "2026-03",
    period: "Mar 2026",
    categories: ["AI", "Web"],
    status: "Workshop build",
    size: "wide",
    vignette: "chat",
    role: "Solo",
    stack: ["React", "TypeScript", "Gemini API", "GitHub Actions"],
    highlights: [
      "Google Gemini API with a custom system persona",
      "Auto-deploys with GitHub Actions",
    ],
    links: [
      { label: "Source on GitHub", href: "https://github.com/iiafosh/portfolie_for_MSC-mostsfs-kmal", kind: "repo" },
    ],
    story: [
      {
        title: "The persona",
        body: [
          "Built for an MSC HUE session: instead of a polite assistant, a mentor who talks like a friend from the street — and still explains Python, C++ and computer vision properly.",
        ],
      },
    ],
  },
]

export function getProject(slug: string | null | undefined) {
  return projects.find((p) => p.slug === slug)
}
