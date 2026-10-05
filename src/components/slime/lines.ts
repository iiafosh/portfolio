// What the slime says. Tips point at real things on the site.

export const LINES = {
  hello: [
    "hi! I'm {name}.\ngrab me — I bounce.",
    "{name}, reporting for duty.\ntry throwing me ✦",
  ],
  boop: ["boop.", "hehe", "that tickles", "hi again", "*jiggles*", "poke detected"],
  grab: ["hey! put me down!", "wheee—wait", "careful, I'm 87% gel", "up we go"],
  throw: ["wheeeee!", "to infinity!", "I can fly!!", "weeeeee"],
  bonk: ["oof", "blorp", "ow!", "splat", "that's a wall"],
  dizzy: ["@_@", "the room is spinning", "ok… one more?", "who turned the gravity up"],
  again: ["again! again!", "ok that one was fun", "best. day. ever."],
  pet: ["hehe ♥", "more pats pls", "purrrr", "you're nice"],
  wake: ["huh? I'm up!", "wasn't sleeping…", "five more minutes"],
  sleep: ["zzz…", "nap time"],
  bye: ["back to the dock!", "see you soon", "bye bye ♥"],
  skin: ["new look!", "how do I look?", "fresh skin ✦"],
  lost: ["this page slimed away…", "404? not my fault.", "I ate this page. sorry."],
  tips: [
    "psst — fosh&fish is playable\nin your browser → Projects",
    "Mostafa's team was #1 at Horus\nin the ECPC qualifiers",
    "3rd place at Green Loop\nwith ReSpark ♻",
    "that watch was built at a hackathon\nwith an ESP32 inside",
    "try the trophy shelf\nin Achievements",
    "I'm 87% gel, 13% GDScript",
    "fling me at a wall,\nI dare you",
  ],
} as const

export type LineKind = keyof typeof LINES

export function pickLine(kind: LineKind, name: string, avoid?: string | null) {
  const pool = LINES[kind] as readonly string[]
  let line = pool[Math.floor(Math.random() * pool.length)]
  if (pool.length > 1 && line === avoid) line = pool[(pool.indexOf(line) + 1) % pool.length]
  return line.replaceAll("{name}", name)
}
