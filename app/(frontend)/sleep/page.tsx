import { PageShell } from "@/components/site/page-shell"
import { PageHeader } from "@/components/site/page-header"
import { EbookCard, type EbookCardData } from "@/components/site/featured-ebooks"
import { SleepCollection } from "@/components/site/sleep-collection"
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
  title: "Sleep Library — Blue Hibiscus",
  description:
    "Gentle herbal remedy ebooks written for older adults whose evenings have grown a little restless.",
}

export default async function SleepPage() {
  const payload = await getPayloadClient()
  const [{ navLinks, footer }, landing, ebooksRes] = await Promise.all([
    getSiteChrome(),
    payload.findGlobal({ slug: "landing", depth: 2 }),
    payload.find({
      collection: "ebooks",
      where: { category: { equals: "sleep" } },
      limit: 24,
      depth: 2,
    }),
  ])

  const sleep = (landing as Record<string, any>).sleep ?? {}

  const mediaMap = await resolveMediaRefs(payload, [
    sleep.image as MediaRef,
    ...ebooksRes.docs.map((b: any) => b.cover as MediaRef),
  ])
  const sleepImage = pickMedia(sleep.image, mediaMap)

  const books: EbookCardData[] = ebooksRes.docs.map((b: any) => {
    const cover = pickMedia(b.cover, mediaMap)
    return {
      title: b.title,
      subtitle: b.subtitle,
      price: b.price,
      pages: b.pages,
      slug: b.slug,
      isBestSeller: b.isBestSeller,
      coverUrl: mediaUrl(cover),
      coverAlt: mediaAlt(cover, b.title),
    }
  })

  return (
    <PageShell navLinks={navLinks} footer={footer}>
      <PageHeader
        eyebrow={sleep.eyebrow ?? "The Sleep Library"}
        title="Made for the nights that feel longest."
        subtitle={sleep.body}
      />

      <SleepCollection
        eyebrow={sleep.eyebrow ?? ""}
        headlineTop={sleep.headlineTop ?? ""}
        headlineBottom={sleep.headlineBottom ?? ""}
        body={sleep.body ?? ""}
        imageUrl={mediaUrl(sleepImage)}
        imageAlt={mediaAlt(sleepImage, "Sleep collection")}
        statFigure={sleep.stat?.figure}
        statCaption={sleep.stat?.caption}
        bullets={(sleep.bullets ?? []).map((b: any) => ({
          title: b.title,
          text: b.text,
        }))}
      />

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-28">
        <h2 className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
          Titles in the sleep collection
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {ebooksRes.totalDocs} {ebooksRes.totalDocs === 1 ? "title" : "titles"} in
          this collection.
        </p>

        {books.length === 0 ? (
          <p className="mt-12 text-muted-foreground">
            No sleep ebooks yet. Add some in the admin.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <EbookCard key={book.slug} book={book} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  )
}
