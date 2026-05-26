import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/site/page-shell"
import { RichText } from "@/components/site/rich-text"
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

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: "ebooks",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const book = res.docs[0] as any
  if (!book) return { title: "Not found — Blue Hibiscus" }
  return {
    title: `${book.title} — Blue Hibiscus`,
    description: book.shortDescription ?? book.subtitle ?? "",
  }
}

export default async function EbookPage({ params }: Params) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const [{ navLinks, footer }, res] = await Promise.all([
    getSiteChrome(),
    payload.find({
      collection: "ebooks",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    }),
  ])

  const book = res.docs[0] as any
  if (!book) notFound()

  const mediaMap = await resolveMediaRefs(payload, [book.cover as MediaRef])
  const cover = pickMedia(book.cover, mediaMap)
  const coverUrl = mediaUrl(cover)
  const coverLabel = mediaAlt(cover, book.title)

  return (
    <PageShell navLinks={navLinks} footer={footer}>
      <section className="mx-auto w-full max-w-7xl px-6 pt-32 pb-20 sm:px-10 sm:pt-40 sm:pb-28">
        <div className="mb-10 text-sm">
          <Link
            href="/shop"
            className="text-muted-foreground hover:text-foreground"
          >
            ← All ebooks
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-secondary/40">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={coverLabel}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              ) : null}
              {book.isBestSeller ? (
                <span className="absolute top-4 left-4 rounded-full bg-background/95 px-2.5 py-1 text-[10px] tracking-[0.16em] uppercase text-foreground">
                  Best seller
                </span>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-6 lg:pt-4">
            <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
              {book.category ?? "Ebook"}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              {book.title}
            </h1>
            {book.subtitle ? (
              <p className="mt-3 text-lg text-muted-foreground">
                {book.subtitle}
              </p>
            ) : null}

            <div className="mt-8 flex items-baseline gap-4">
              <span className="font-serif text-3xl">${book.price}</span>
              {book.pages ? (
                <span className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                  {book.pages} pages • Digital
                </span>
              ) : null}
            </div>

            {book.shortDescription ? (
              <p className="mt-8 text-[15px] leading-relaxed text-foreground/85">
                {book.shortDescription}
              </p>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[color:var(--primary)]"
              >
                Add to cart
              </button>
              <Link
                href="/free-sample"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
              >
                Read a sample
              </Link>
            </div>

            <ul className="mt-12 space-y-3 border-t border-border pt-8 text-sm text-muted-foreground">
              <li>• Instant download (PDF + EPUB)</li>
              <li>• Large-print edition included</li>
              <li>• 30-day refund window</li>
              <li>• Lifetime updates as the book grows</li>
            </ul>
          </div>
        </div>

        {book.description ? (
          <div className="mt-20 grid grid-cols-1 gap-8 border-t border-border pt-16 lg:grid-cols-12">
            <h2 className="font-serif text-2xl tracking-tight lg:col-span-4">
              About this ebook
            </h2>
            <div className="lg:col-span-8">
              <RichText content={book.description} />
            </div>
          </div>
        ) : null}
      </section>
    </PageShell>
  )
}
