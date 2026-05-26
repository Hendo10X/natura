import Image from "next/image"
import Link from "next/link"

export type EbookCardData = {
  title: string
  subtitle?: string | null
  price: number
  pages?: number | null
  slug: string
  isBestSeller?: boolean | null
  coverUrl: string | null
  coverAlt: string
}

export type FeaturedEbooksProps = {
  eyebrow: string
  headlineTop: string
  headlineBottom: string
  viewAllLabel: string
  totalLabel: string
  books: EbookCardData[]
}

export function FeaturedEbooks({
  eyebrow,
  headlineTop,
  headlineBottom,
  viewAllLabel,
  totalLabel,
  books,
}: FeaturedEbooksProps) {
  return (
    <section id="shop" className="relative w-full bg-background py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="mb-4 text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
              {eyebrow}
            </p>
            <h2 className="font-serif text-3xl leading-[1.05] tracking-tight sm:text-5xl">
              {headlineTop}
              <br />
              <span className="text-primary">
                {headlineBottom}
              </span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground"
          >
            {viewAllLabel || totalLabel}
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border transition-colors group-hover:border-foreground">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" />
              </svg>
            </span>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => (
            <EbookCard key={book.slug} book={book} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EbookCard({ book }: { book: EbookCardData }) {
  return (
    <Link href={`/shop/${book.slug}`} className="group flex flex-col">
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-md bg-secondary/40">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.coverAlt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
          />
        ) : null}
        {book.isBestSeller ? (
          <span className="absolute top-3 left-3 rounded-full bg-background/95 px-2.5 py-1 text-[10px] tracking-[0.16em] uppercase text-foreground">
            Best seller
          </span>
        ) : null}
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-serif text-lg leading-tight">{book.title}</h3>
          {book.subtitle ? (
            <p className="mt-1 text-sm text-muted-foreground">{book.subtitle}</p>
          ) : null}
          {book.pages ? (
            <p className="mt-2 text-[11px] tracking-[0.14em] uppercase text-muted-foreground/80">
              {book.pages} pages
            </p>
          ) : null}
        </div>
        <div className="shrink-0 font-serif text-lg text-foreground">
          ${book.price}
        </div>
      </div>
    </Link>
  )
}
