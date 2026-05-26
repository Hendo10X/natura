export type TestimonialEntry = {
  name: string
  meta?: string | null
  quote: string
}

export type TestimonialsProps = {
  eyebrow: string
  headlineTop: string
  headlineBottom: string
  averageRating: string
  reviewCount: string
  entries: TestimonialEntry[]
}

export function Testimonials({
  eyebrow,
  headlineTop,
  headlineBottom,
  averageRating,
  reviewCount,
  entries,
}: TestimonialsProps) {
  return (
    <section
      id="reviews"
      className="relative w-full bg-background py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="mb-4 text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
              {eyebrow}
            </p>
            <h2 className="font-serif text-3xl leading-[1.05] tracking-tight sm:text-5xl">
              {headlineTop}
              <br />
              <span className="text-[color:var(--primary)]">{headlineBottom}</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground">{averageRating}</span> from{" "}
              {reviewCount} reviews
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {entries.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col justify-between gap-8 bg-background p-8 sm:p-10"
            >
              <blockquote className="font-serif text-xl leading-[1.4] text-foreground sm:text-2xl">
                <span className="mr-1 text-[color:var(--accent)]">“</span>
                {t.quote}
                <span className="ml-1 text-[color:var(--accent)]">”</span>
              </blockquote>
              <figcaption>
                <div className="text-sm font-medium text-foreground">
                  {t.name}
                </div>
                {t.meta ? (
                  <div className="mt-1 text-xs tracking-wide text-muted-foreground">
                    {t.meta}
                  </div>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Star() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-[color:var(--accent)]"
    >
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  )
}
