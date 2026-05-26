import Image from "next/image"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/site/page-shell"
import { PageHeader } from "@/components/site/page-header"
import { FOOTER, NAV_LINKS, PAGES } from "@/lib/content"

export const metadata = { title: "About — Blue Hibiscus" }

export default function AboutPage() {
  const page = PAGES.find((p) => p.slug === "about")
  if (!page) notFound()

  return (
    <PageShell navLinks={NAV_LINKS} footer={FOOTER}>
      <PageHeader eyebrow="About" title={page.title} subtitle={page.subtitle} />

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-5 text-[15px] leading-[1.7] text-foreground/85 lg:col-span-7">
            {page.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          {page.coverUrl ? (
            <div className="lg:col-span-5">
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-md">
                <Image
                  src={page.coverUrl}
                  alt={page.coverAlt ?? page.title}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </PageShell>
  )
}
