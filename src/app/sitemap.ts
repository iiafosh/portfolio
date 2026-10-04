import type { MetadataRoute } from "next"

import { NAV } from "@/content/nav"
import { site } from "@/content/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...NAV.map((n) => n.href), "/cv"]
  return routes.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }))
}
