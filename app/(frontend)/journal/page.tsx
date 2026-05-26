import Image from "next/image"
import Link from "next/link"
import { PageShell } from "@/components/site/page-shell"
import { PageHeader } from "@/components/site/page-header"
import {
  getPayloadClient,
  mediaAlt,
  mediaUrl,
  pickMedia,
  resolveMediaRefs,
  type MediaRef,
} from "@/lib/payload"
import { getSiteChrome } from "@/lib/site"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Journal — Blue Hibiscus",
  description: "Quiet notes from a slow press.",
}

export default async function JournalPage() {
  const payload = await getPayloadClient()
  const [{ navLinks, footer }, postsRes] = await Promise.all([
    getSiteChrome(),
    payload.find({
      collection: "posts",
      sort: "-publishedAt",
      limit: 24,
      depth: 2,
    }),
  ])

  const mediaMap = await resolveMediaRefs(
    payload,
    postsRes.docs.map((p: any) => p.cover as MediaRef)
  )

  return (
    <PageShell navLinks={navLinks} footer={footer}>
      <PageHeader
        eyebrow="Journal"
        title="Notes from a slow press."
        subtitle="Short essays, plant notes, and the occasional letter from the kitchen."
      />

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-28">
        {postsRes.docs.length === 0 ? (
          <p className="text-muted-foreground">
            No journal entries yet. Add some in the admin.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {postsRes.docs.map((post: any) => {
              const cover = pickMedia(post.cover, mediaMap)
              const coverUrl = mediaUrl(cover)
              return (
                <li key={post.slug}>
                  <Link href={`/journal/${post.slug}`} className="group block">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-secondary/40">
                      {coverUrl ? (
                        <Image
                          src={coverUrl}
                          alt={mediaAlt(cover, post.title)}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-[600ms] [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04]"
                        />
                      ) : null}
                    </div>
                    <div className="mt-5">
                      {post.publishedAt ? (
                        <p className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                          {new Date(post.publishedAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      ) : null}
                      <h2 className="mt-2 font-serif text-2xl leading-tight">
                        {post.title}
                      </h2>
                      {post.excerpt ? (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {post.excerpt}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </PageShell>
  )
}
