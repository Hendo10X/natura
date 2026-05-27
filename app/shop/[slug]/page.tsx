import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/site/page-shell"
import { AddToCartButton } from "@/components/site/add-to-cart-button"
import { FOOTER, NAV_LINKS } from "@/lib/content"
import { getEbookBySlug, getEbooks } from "@/lib/sanity"

export const revalidate = 60

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const book = await getEbookBySlug(slug)
  if (!book) return { title: "Not found — Blue Hibiscus" }
  return {
    title: `${book.title} — Blue Hibiscus`,
    description: book.shortDescription,
  }
}

export async function generateStaticParams() {
  const ebooks = await getEbooks()
  return ebooks.map((b) => ({ slug: b.slug }))
}

export default async function EbookPage({ params }: Params) {
  const { slug } = await params
  const book = await getEbookBySlug(slug)
  if (!book) notFound()

  return (
    <PageShell navLinks={NAV_LINKS} footer={FOOTER}>
      <section className="mx-auto w-full max-w-7xl px-6 pt-28 pb-20 sm:px-10 sm:pt-32 sm:pb-28">
        <div className="mb-6 text-sm sm:mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <span aria-hidden="true">←</span> All ebooks
          </Link>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-md bg-secondary/40 sm:aspect-3/4">
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={book.coverAlt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
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

          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
              {book.category}
            </p>
            <h1 className="mt-3 font-serif text-3xl leading-[1.05] tracking-tight sm:text-4xl">
              {book.title}
            </h1>
            {book.subtitle ? (
              <p className="mt-2 text-base text-muted-foreground sm:text-lg">
                {book.subtitle}
              </p>
            ) : null}

            <div className="mt-6 flex items-baseline gap-4">
              <span className="font-serif text-3xl">${book.price}</span>
              {book.pages ? (
                <span className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                  {book.pages} pages • Digital
                </span>
              ) : null}
            </div>

            {book.shortDescription ? (
              <p className="mt-6 text-[15px] leading-relaxed text-foreground/85">
                {book.shortDescription}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              {book.polarProductId ? (
                <a
                  href={`/api/checkout?products=${encodeURIComponent(
                    book.polarProductId
                  )}`}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary"
                >
                  Buy now — ${book.price}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              ) : null}
              <AddToCartButton
                slug={book.slug}
                polarProductId={book.polarProductId}
                title={book.title}
                price={book.price}
                coverUrl={book.coverUrl}
                coverAlt={book.coverAlt}
              />
              <Link
                href="/free-sample"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
              >
                Read a sample
              </Link>
            </div>

            <ul className="mt-10 space-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
              <li>• Instant download (PDF + EPUB)</li>
              <li>• Large-print edition included</li>
              <li>• 30-day refund window</li>
              <li>• Lifetime updates as the book grows</li>
            </ul>
          </div>
        </div>

        {book.longDescription.length > 0 ? (
          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-border pt-12 lg:grid-cols-12 lg:gap-12 sm:mt-20 sm:pt-16">
            <h2 className="font-serif text-2xl tracking-tight lg:col-span-4">
              About this ebook
            </h2>
            <div className="space-y-5 text-[15px] leading-[1.7] text-foreground/85 lg:col-span-8">
              {book.longDescription.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </PageShell>
  )
}
