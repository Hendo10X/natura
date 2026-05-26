import Image from "next/image"
import Link from "next/link"
import { PageShell } from "@/components/site/page-shell"
import { PageHeader } from "@/components/site/page-header"
import { FOOTER, NAV_LINKS, POSTS } from "@/lib/content"

export const metadata = {
  title: "Journal — Blue Hibiscus",
  description: "Quiet notes from a slow press.",
}

export default function JournalPage() {
  return (
    <PageShell navLinks={NAV_LINKS} footer={FOOTER}>
      <PageHeader
        eyebrow="Journal"
        title="Notes from a slow press."
        subtitle="Short essays, plant notes, and the occasional letter from the kitchen."
      />

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-28">
        <ul className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <Link href={`/journal/${post.slug}`} className="group block">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-secondary/40">
                  <Image
                    src={post.coverUrl}
                    alt={post.coverAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-5">
                  <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl leading-tight">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}
