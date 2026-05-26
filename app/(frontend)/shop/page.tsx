import { PageShell } from "@/components/site/page-shell"
import { PageHeader } from "@/components/site/page-header"
import { EbookCard, type EbookCardData } from "@/components/site/featured-ebooks"
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
  title: "Shop — Blue Hibiscus",
  description: "Every Blue Hibiscus ebook, in one place.",
}

export default async function ShopPage() {
  const payload = await getPayloadClient()
  const [{ navLinks, footer }, ebooksRes] = await Promise.all([
    getSiteChrome(),
    payload.find({
      collection: "ebooks",
      limit: 50,
      depth: 2,
      sort: "-isBestSeller",
    }),
  ])

  const mediaMap = await resolveMediaRefs(
    payload,
    ebooksRes.docs.map((b: any) => b.cover as MediaRef)
  )

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
        eyebrow={`The Library — ${ebooksRes.totalDocs} titles`}
        title="Every Blue Hibiscus ebook."
        subtitle="Browse the full library. Each title is written slowly, set in large readable type, and reviewed by a registered herbalist."
      />

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-28">
        {books.length === 0 ? (
          <p className="text-muted-foreground">
            No ebooks yet. Add some in the admin.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <EbookCard key={book.slug} book={book} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  )
}
