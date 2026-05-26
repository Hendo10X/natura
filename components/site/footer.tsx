"use client"

import Link from "next/link"

export type FooterColumn = {
  title: string
  links: { label: string; href: string }[]
}

export type FooterProps = {
  tagline: string
  columns: FooterColumn[]
  legal: { label: string; href: string }[]
  disclaimer: string
}

export function Footer({ tagline, columns, legal, disclaimer }: FooterProps) {
  return (
    <footer className="relative w-full bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="font-serif text-3xl tracking-tight text-background"
            >
              Blue Hibiscus
              <span className="text-[color:var(--accent)]">.</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-background/65">
              {tagline}
            </p>

            <form
              className="mt-8 flex max-w-sm overflow-hidden rounded-full border border-background/20"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent px-5 py-3 text-sm text-background placeholder:text-background/45 outline-none"
              />
              <button
                type="submit"
                className="bg-[color:var(--accent)] px-5 text-xs font-medium tracking-wide uppercase text-background transition-colors hover:bg-background hover:text-foreground"
              >
                Subscribe
              </button>
            </form>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="text-[11px] tracking-[0.22em] uppercase text-background/55">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/80 transition-colors hover:text-background"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-background/15 pt-8 text-xs text-background/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Blue Hibiscus Editions. {disclaimer}
          </p>
          <div className="flex flex-wrap gap-5">
            {legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-background"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
