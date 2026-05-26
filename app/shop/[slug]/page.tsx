import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/site/page-shell"
import { EBOOKS, FOOTER, NAV_LINKS } from "@/lib/content"

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const book = EBOOKS.find((b) => b.slug === slug)
  if (!book) return { title: "Not found — Blue Hibiscus" }
  return {
    title: `${book.title} — Blue Hibiscus`,
    description: book.shortDescription,
  }
}

export function generateStaticParams() {
  return EBOOKS.map((b) => ({ slug: b.slug }))
}

export default async function EbookPage({ params }: Params) {
  const { slug } = await params
  const book = EBOOKS.find((b) => b.slug === slug)
  if (!book) notFound()

  return (
    <PageShell navLinks={NAV_LINKS} footer={FOOTER}>
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
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-md bg-secondary/40">
              <Image
                src={book.coverUrl}
                alt={book.coverAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
              {book.isBestSeller ? (
                <span className="absolute top-4 left-4 rounded-full bg-background/95 px-2.5 py-1 text-[10px] tracking-[0.16em] uppercase text-foreground">
                  Best seller
                </span>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-6 lg:pt-4">
            <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
              {book.category}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              {book.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">{book.subtitle}</p>

            <div className="mt-8 flex items-baseline gap-4">
              <span className="font-serif text-3xl">${book.price}</span>
              <span className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                {book.pages} pages • Digital
              </span>
            </div>

            <p className="mt-8 text-[15px] leading-relaxed text-foreground/85">
              {book.shortDescription}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary"
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

        <div className="mt-20 grid grid-cols-1 gap-8 border-t border-border pt-16 lg:grid-cols-12">
          <h2 className="font-serif text-2xl tracking-tight lg:col-span-4">
            About this ebook
          </h2>
          <div className="space-y-5 text-[15px] leading-[1.7] text-foreground/85 lg:col-span-8">
            {book.longDescription.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
