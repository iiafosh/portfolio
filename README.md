# Vite + TanStack + Supabase + GitHub OAuth (Vercel Ready)

A modern, production-grade Single Page Application (SPA) built with:
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Frontend**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [@tanstack/react-router](https://tanstack.com/router/latest) (declarative, type-safe client routing)
- **Data & Caching**: [@tanstack/react-query](https://tanstack.com/query/latest) (asynchronous state management & cache invalidation)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security & GitHub OAuth)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/) (preconfigured `vercel.json` SPA rewrite rules)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase & GitHub OAuth

#### A. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the **SQL Editor**, open and execute the SQL script in [`supabase/schema.sql`](./supabase/schema.sql). This creates the `user_items` table and enables **Row Level Security (RLS)** policies ensuring users can only read and modify their own records.
3. In **Project Settings &rarr; API**, copy:
   - **Project URL**
   - **anon public API Key**

#### B. Create a GitHub OAuth App
1. Go to your GitHub account &rarr; [Settings &rarr; Developer Settings &rarr; OAuth Apps](https://github.com/settings/developers).
2. Click **New OAuth App**:
   - **Application name**: `Vite TanStack App`
   - **Homepage URL**: `http://localhost:5173` (or your Vercel URL in production)
   - **Authorization callback URL**: `https://<YOUR-SUPABASE-PROJECT-ID>.supabase.co/auth/v1/callback`
     *(Find this in your Supabase Dashboard under Authentication &rarr; Providers &rarr; GitHub)*
3. Click **Register Application**, then generate a **Client Secret**.
4. In your Supabase Dashboard:
   - Go to **Authentication &rarr; Providers &rarr; GitHub**.
   - Toggle **Enable GitHub**.
   - Paste your **Client ID** and **Client Secret**.
   - Click **Save**.
5. In Supabase Dashboard &rarr; **Authentication &rarr; URL Configuration**:
   - Set **Site URL** to `http://localhost:5173` (or your Vercel production domain).
   - In **Redirect URLs**, add:
     - `http://localhost:5173/auth/callback`
     - `https://*.vercel.app/auth/callback`
     - `https://your-custom-domain.com/auth/callback`

#### C. Setup Environment Variables
Duplicate `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

---

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deploying to Vercel

### Step 1: Push Code to GitHub
Initialize git and push to your GitHub repository:
```bash
git init
git add .
git commit -m "feat: Vite + TanStack + Supabase + Vercel setup"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [vercel.com](https://vercel.com) and click **Add New &rarr; Project**.
2. Select your repository.
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
4. Click **Deploy**.

> **Note on Client-Side Routing:**
> The included [`vercel.json`](./vercel.json) handles SPA rewrites so direct navigation and browser refreshing on deep routes (e.g. `/dashboard`, `/auth/callback`) work seamlessly without 404 errors.

---

## 📁 Project Structure

```
├── .env.example             # Supabase environment variables template
├── index.html               # Vite HTML entry point (Geist & Silkscreen fonts)
├── package.json             # Dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vercel.json              # Vercel SPA routing rewrite rules
├── vite.config.ts           # Vite configuration with '@/' path aliases
├── supabase/
│   └── schema.sql           # PostgreSQL table definitions and RLS policies
└── src/
    ├── main.tsx             # App root (QueryClientProvider + AuthProvider + RouterProvider)
    ├── router.tsx           # TanStack Router configuration and route tree
    ├── index.css            # Tailwind & yust.dev liquid dock and noise styles
    ├── lib/
    │   └── supabase.ts      # Supabase client initialization & types
    ├── context/
    │   └── AuthContext.tsx  # Auth state, session persistence, GitHub OAuth triggers
    ├── components/
    │   ├── Dock.tsx         # yust.dev liquid-glass floating pill dock
    │   └── icons/
    │       ├── GithubIcon.tsx   # GitHub SVG icon
    │       └── LinkedInIcon.tsx # LinkedIn SVG icon
    └── pages/
        ├── AboutPage.tsx    # Bio, HUE details, live Cairo clock, socials
        ├── ProjectsPage.tsx # Shipped builds and tech stack tags
        ├── HacksPage.tsx    # Hackathon podium finishes and sprint builds
        ├── CertsPage.tsx    # Academic achievements & verified certifications
        ├── DatabasePage.tsx # Supabase PostgreSQL playground with live RLS & GitHub OAuth
        ├── AuthCallback.tsx # OAuth callback listener and redirect
        └── NotFound.tsx     # 404 page
```

---

## 🛠️ Available Scripts

- `npm run dev`: Starts local Vite development server at `http://localhost:5173`.
- `npm run build`: Type-checks with `tsc -b` and compiles for production with `vite build`.
- `npm run preview`: Previews the production build locally.
