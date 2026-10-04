# afosh · Mostafa Kmal

Portfolio of **Mostafa Kmal** ([@iiafosh](https://github.com/iiafosh)) — AI & Informatics (Robotics) student at Horus University in Egypt.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui on Base UI · Motion · a canvas soft-body slime.

## One tab per collection

The home page never grows. Everything lives in its own page, reached from the bottom dock or the home "doorways":

| Tab | Route | What it does |
| --- | --- | --- |
| Home | `/` | Intro, contact row (copy email, GitHub/LinkedIn/CV hover cards), doorways, latest journey, toolbox |
| Hackathons | `/hackathons` | Rank, journey ladder, facts plate, proofs; the full story opens in a bottom sheet (`?story=slug`) |
| Projects | `/projects` | Bento grid with filters; each tile opens a case-study sheet (`?p=slug`) |
| Achievements | `/achievements` | A trophy shelf — pick a trophy to read its plate (`?a=slug`) |
| Community | `/community` | Club badges on lanyards you can swing (`?c=slug`) |
| CV | `/cv` | One-page A4 CV in the style from `index.html` + `style.css`; download at `/cv.pdf` |

Keyboard: **G** then **H / K / P / A / C** jumps between tabs, **G S** lets the slime out or puts it back.

## Editing content

All content is typed data in `src/content/` — add an object and it appears in its tab:

- `site.ts` — name, links, email, location
- `projects.ts`, `hackathons.ts`, `achievements.ts`, `community.ts`
- `journey.ts` — the home timeline, skill chips and toolbox
- `cv.ts` — the CV wording

Media lives in `public/media/`. A project without screenshots gets an animated cover (`vignette`).

## The slime

`src/components/slime/engine.ts` — a ring of Verlet points held together by shape matching, edge springs and pressure. Grab it (it dangles from where you hold it), fling it into the walls, boop it, pet it (hover and wiggle), double-click for a big jump, or leave it alone until it naps. It lands on top of the dock, talks now and then, and has five skins (Preferences → Skin). Under `prefers-reduced-motion` it stays in the dock until asked and never moves on its own.

## Run

```bash
npm install
npm run dev        # http://localhost:3000  (the Claude launch config uses 3210)
npm run build
```

### Regenerate the CV PDF

With the dev server running:

```bash
npm run cv:pdf     # renders /cv to public/cv.pdf with local Chrome/Edge (CV_URL to override)
```

## Design references

Studied from the sites and repos in `ref/` (git-ignored):

- **cali.so** (MIT code) — design language: warm paper scale, motion tokens, frosted bottom dock, section tags, spec plates, status ladder, doorways, footer folder trees
- **yust.dev** — one page per collection, hackathon entries with proofs, project bottom sheets, the desktop pet idea (patterns only; no code copied — that repo has no license)
- **joshtilton.com** — mono timeline rows, the dotted link underline, screens on scenic wallpapers
- **aryankarma.com** — dock, hackathon rail, skill pills, project cards with status badges
- **sleek-portfolio** (MIT) — inline skill chips, theme circle reveal, the "Working" pulse
- **beUI** (MIT) — motion tokens and the tilt card; its `beui` skill and Emil Kowalski's `emil-design-eng` skill (MIT) are in `.claude/skills/`

Brand marks from Simple Icons (CC0). Fonts: Geist (bold, tight — the aryankarma/cali.so look) across the site, Geist Mono for keyboard keys, Roboto for the CV.
