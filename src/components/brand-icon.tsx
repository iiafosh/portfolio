import {
  siArduino,
  siBlender,
  siCplusplus,
  siEspressif,
  siGit,
  siGithubactions,
  siGodotengine,
  siGooglegemini,
  siNextdotjs,
  siPandas,
  siPython,
  siReact,
  siScikitlearn,
  siTailwindcss,
  siTypescript,
  siVite,
} from "simple-icons"

// Brand marks from Simple Icons (CC0). Very dark brand colors fall back to
// the current ink so they survive dark mode.

const ICONS = {
  arduino: siArduino,
  blender: siBlender,
  cplusplus: siCplusplus,
  espressif: siEspressif,
  git: siGit,
  githubactions: siGithubactions,
  godot: siGodotengine,
  gemini: siGooglegemini,
  nextdotjs: siNextdotjs,
  pandas: siPandas,
  python: siPython,
  react: siReact,
  scikitlearn: siScikitlearn,
  tailwindcss: siTailwindcss,
  typescript: siTypescript,
  vite: siVite,
} as const

export type BrandKey = keyof typeof ICONS

/** Tool names → brand keys, for the toolbox and project stacks. */
export const TOOL_BRANDS: Record<string, BrandKey> = {
  Python: "python",
  "C++": "cplusplus",
  TypeScript: "typescript",
  "scikit-learn": "scikitlearn",
  Pandas: "pandas",
  "Gemini API": "gemini",
  ESP32: "espressif",
  "XIAO ESP32-C6": "espressif",
  "Arduino IDE": "arduino",
  "Godot 4": "godot",
  Godot: "godot",
  GDScript: "godot",
  Blender: "blender",
  React: "react",
  "Next.js": "nextdotjs",
  "Tailwind CSS": "tailwindcss",
  Vite: "vite",
  "Git & GitHub": "git",
  "GitHub Actions": "githubactions",
}

function isDark(hex: string) {
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.22
}

export function BrandIcon({ name, className, mono = false }: { name: BrandKey; className?: string; mono?: boolean }) {
  const icon = ICONS[name]
  const fill = mono || isDark(icon.hex) ? "currentColor" : `#${icon.hex}`
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill={fill}>
      <path d={icon.path} />
    </svg>
  )
}

export function brandFor(tool: string): BrandKey | undefined {
  return TOOL_BRANDS[tool]
}
