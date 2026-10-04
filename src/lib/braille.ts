// Grade-1 braille for the colophon's printer's mark (decorative, aria-hidden).

const LETTERS: Record<string, string> = {
  a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑", f: "⠋", g: "⠛", h: "⠓", i: "⠊", j: "⠚",
  k: "⠅", l: "⠇", m: "⠍", n: "⠝", o: "⠕", p: "⠏", q: "⠟", r: "⠗", s: "⠎", t: "⠞",
  u: "⠥", v: "⠧", w: "⠺", x: "⠭", y: "⠽", z: "⠵",
}

export function brailleText(text: string) {
  return [...text.toLowerCase()].map((ch) => LETTERS[ch] ?? (ch === " " ? "⠀" : "")).join("")
}
