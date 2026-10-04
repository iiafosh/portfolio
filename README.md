# afosh · portfolio

Personal site of **Mostafa Kamal Shabara** ([@iiafosh](https://github.com/iiafosh) · [LinkedIn](https://www.linkedin.com/in/mostafa-kamal-3731453a9/)): AI & Informatics (Robotics) student at Horus University in Egypt, creator of [fosh&fish](https://github.com/iiafosh/fosh-and-fish).

**Stack:** Vite · React 18 · TypeScript · TanStack Router · Tailwind CSS. Fully static: no backend, no environment variables.

## What's in it

- **Recruiter-first hero:** who I am, what I build, resume and contact above the fold, with hover preview cards on GitHub, LinkedIn and Resume.
- **Featured project:** fosh&fish with a lazy-loaded trailer, screenshots and a "play in browser" link.
- **Wins, projects and experience from LinkedIn:**
  - Green Loop 3rd place with ReSpark
  - #1 Horus team at the ECPC qualifiers
  - Damietta Hackathon with the Smart Medical Watch
  - Robo-Space, NumLab, AXIS and ICPC HUE
- **`/resume`:** a one-page resume built from the same data. "Download PDF" prints it on A4.
- **Rimuru slime mascot:** wanders, naps, plays and can be flung around. Every minute it points at something on the site.

## Editing content

All content lives in [`src/content/data.ts`](src/content/data.ts). The section order is `PROFILE.section_order`. Hide an item with `visible: false`. Sections with no items don't render.

## Run

```bash
npm install
npm run dev
```

## Deploy

Works on any static host. On Vercel, import the repo; `vercel.json` rewrites all routes to the SPA.
