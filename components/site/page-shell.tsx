import * as React from "react"
import { Navbar, type NavLink } from "@/components/site/navbar"
import { Footer, type FooterColumn } from "@/components/site/footer"

export type PageShellProps = {
  navLinks: NavLink[]
  footer: {
    tagline: string
    columns: FooterColumn[]
    legal: { label: string; href: string }[]
    disclaimer: string
  }
  variant?: "over-hero" | "solid"
  children: React.ReactNode
}

export function PageShell({ navLinks, footer, variant = "solid", children }: PageShellProps) {
  return (
    <main className="relative w-full bg-background text-foreground">
      <Navbar links={navLinks} variant={variant} />
      {children}
      <Footer
        tagline={footer.tagline}
        columns={footer.columns}
        legal={footer.legal}
        disclaimer={footer.disclaimer}
      />
    </main>
  )
}
