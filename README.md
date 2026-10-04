# afosh · portfolio

Personal site of **Mostafa Kamal Shabara** ([@iiafosh](https://github.com/iiafosh)): AI & Software Engineering student at Horus University in Egypt, creator of [fosh&fish](https://github.com/iiafosh/fosh-and-fish).

**Stack:** Vite · React 18 · TypeScript · TanStack Router & Query · Supabase (Postgres, RLS, GitHub OAuth, Realtime) · Tailwind CSS · Vercel

## What's in it

- **Recruiter-first home page:** who I am, what I build, resume and contact above the fold, with hover preview cards on GitHub, LinkedIn and Resume.
- **Featured project:** fosh&fish with a lazy-loaded trailer, screenshots and a "play in browser" link.
- **Content lives in Supabase.** Projects, experience, education, certifications, skills and the *order of sections* are rows in Postgres. Visitors can read them; only the owner can change them (RLS + `is_portfolio_owner()`).
- **`/admin`:** an owner-only editor. Sign in with GitHub as @iiafosh to reorder sections and items, toggle visibility and edit content.
- **Guestbook:** visitors sign in with GitHub and leave a message. Updates arrive live over Supabase Realtime. Author names come from the GitHub identity on the server, so they can't be spoofed, and each visitor can post 3 messages a day.
- **`/resume`:** a one-page resume built from the same data. "Download PDF" prints it on A4.
- **Rimuru slime mascot:** wanders the page and points at real things on the site every minute. You can drag it.
- **Anghami player** and a visit counter in the footer.

If Supabase is unreachable or the tables don't exist yet, the site falls back to the copy in `src/content/fallback.ts`.

## Setup

```bash
npm install
cp .env.example .env   # fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

### Supabase

1. Open the Supabase SQL Editor and run [`supabase/portfolio.sql`](supabase/portfolio.sql). It's idempotent, so you can run it again; seed rows are only inserted when missing.
2. Under **Authentication → Providers → GitHub**, enable GitHub with the Client ID and Secret from a GitHub OAuth app. The app's callback URL is `https://<project>.supabase.co/auth/v1/callback`.
3. Under **Authentication → URL Configuration**, set the Site URL to the production domain and add these redirect URLs: `http://localhost:5173/auth/callback` and `https://<your-domain>/auth/callback`.

The owner is identified by GitHub user id `256016032` (@iiafosh) in `is_portfolio_owner()`.

### Deploy (Vercel)

Import the repo and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables. `vercel.json` rewrites all routes to the SPA.

## Project layout

```
supabase/portfolio.sql      schema, RLS, triggers, seed
src/content/                types + local fallback content
src/lib/content.ts          React Query hooks (read, owner edits, guestbook, views)
src/context/AuthContext.tsx GitHub OAuth session + isOwner
src/sections/               home page sections (rendered in profile.section_order)
src/pages/                  Home, Resume, Admin, AuthCallback, NotFound
src/components/             layout, dock, hover cards, mascot, Anghami player
```
