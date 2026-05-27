import type { MetadataRoute } from "next"
import { PAGES, POSTS } from "@/lib/content"
import { getEbooks } from "@/lib/sanity"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

const RESERVED = new Set(["shop", "sleep", "about", "journal"])

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ebooks = await getEbooks()
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/sleep`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/journal`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ]

  const ebookRoutes: MetadataRoute.Sitemap = ebooks.map((b) => ({
    url: `${siteUrl}/shop/${b.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const journalRoutes: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${siteUrl}/journal/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const pageRoutes: MetadataRoute.Sitemap = PAGES.filter(
    (p) => !RESERVED.has(p.slug)
  ).map((p) => ({
    url: `${siteUrl}/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }))

  return [...staticRoutes, ...ebookRoutes, ...journalRoutes, ...pageRoutes]
}
