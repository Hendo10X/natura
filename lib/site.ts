import "server-only"
import { getPayloadClient } from "@/lib/payload"
import type { NavLink } from "@/components/site/navbar"
import type { FooterColumn } from "@/components/site/footer"

export type SiteChrome = {
  navLinks: NavLink[]
  footer: {
    tagline: string
    columns: FooterColumn[]
    legal: { label: string; href: string }[]
    disclaimer: string
  }
}

/** Fetch nav + footer in one shot for any page in the site. */
export async function getSiteChrome(): Promise<SiteChrome> {
  const payload = await getPayloadClient()
  const navigation = await payload.findGlobal({ slug: "navigation", depth: 1 })
  const n = navigation as Record<string, any>

  const navLinks: NavLink[] = (n.primary ?? []).map((link: any) => ({
    label: link.label,
    href: link.href,
  }))

  const columns: FooterColumn[] = (n.footer?.columns ?? []).map((col: any) => ({
    title: col.title,
    links: (col.links ?? []).map((link: any) => ({
      label: link.label,
      href: link.href,
    })),
  }))

  const legal = (n.footer?.legal ?? []).map((link: any) => ({
    label: link.label,
    href: link.href,
  }))

  return {
    navLinks,
    footer: {
      tagline: n.footer?.tagline ?? "",
      columns,
      legal,
      disclaimer: n.footer?.disclaimer ?? "",
    },
  }
}
