import Link from "next/link"
import { PageShell } from "@/components/site/page-shell"
import { FOOTER, NAV_LINKS } from "@/lib/content"

export const metadata = {
  title: "Not found — Blue Hibiscus",
}

export default function NotFound() {
  return (
    <PageShell navLinks={NAV_LINKS} footer={FOOTER}>
      <section className="mx-auto flex w-full max-w-3xl flex-col items-start px-6 pt-32 pb-24 sm:px-10 sm:pt-40 sm:pb-32">
        <span className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
          404
        </span>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          That page has gone quiet.
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          The page you were looking for isn’t here. It may have moved, or it
          may simply be resting.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[color:var(--primary)]"
          >
            Back to the home page
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            Browse the library
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
