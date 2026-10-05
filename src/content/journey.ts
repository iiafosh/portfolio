import type { Milestone, Skill } from "./types"

// The short journey on the home page (newest first) and the toolbox.

export const milestones: Milestone[] = [
  { date: "2026-10", label: "Oct 2026", title: "Shipped fosh&fish 0.1 beta", org: "first game", href: "/projects?p=fosh-and-fish" },
  { date: "2026-09", label: "Sep 2026", title: "3rd place at Green Loop", org: "HUE", href: "/hackathons#green-loop" },
  { date: "2026-08", label: "Aug 2026", title: "#1 Horus team, ECPC qualifiers", org: "ICPC HUE", href: "/achievements?a=ecpc-2026" },
  { date: "2026-07", label: "Jul 2026", title: "Qualified for the Damietta Hackathon", org: "first hackathon", href: "/hackathons#damietta-hackathon" },
  { date: "2026-06", label: "Jun 2026", title: "Robo-Space & NumLab", org: "course", href: "/projects?p=robo-space" },
  { date: "2026-01", label: "Jan 2026", title: "Joined ICPC HUE", org: "community", href: "/community" },
  { date: "2025-12", label: "Dec 2025", title: "Joined AXIS technical staff", org: "club", href: "/community" },
  { date: "2025-09", label: "Sep 2025", title: "Started AI & Informatics (Robotics)", org: "HUE" },
]

/** Inline chips in the home introduction (sleek-portfolio's skill chips). */
export const heroSkills: Record<string, Skill> = {
  godot: { name: "Godot", icon: "godot", href: "https://godotengine.org" },
  blender: { name: "Blender", icon: "blender", href: "https://www.blender.org" },
  esp32: { name: "ESP32", icon: "espressif", href: "https://www.espressif.com/en/products/socs/esp32" },
  python: { name: "Python", icon: "python", href: "https://www.python.org" },
  sklearn: { name: "scikit-learn", icon: "scikitlearn", href: "https://scikit-learn.org" },
  react: { name: "React", icon: "react", href: "https://react.dev" },
  cpp: { name: "C++", icon: "cplusplus", href: "https://isocpp.org" },
}

export const toolbox: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "C++", "TypeScript", "GDScript", "Supabase"] },
  { group: "AI & data", items: ["scikit-learn", "Pandas", "Matplotlib", "Random Forest", "Gemini API", "YOLO"] },
  { group: "Hardware & IoT", items: ["ESP32", "Arduino IDE", "LoRa", "MPU6050", "MAX30100", "GPS"] },
  { group: "Games & 3D", items: ["Godot 4", "Blender", "Game balancing", "Multi-platform export"] },
  { group: "Web & apps", items: ["React", "Next.js", "Tailwind CSS", "Vite", "CustomTkinter"] },
  { group: "Ways of working", items: ["Git & GitHub", "GitHub Actions", "AI-assisted coding", "Hackathon teamwork"] },
]
