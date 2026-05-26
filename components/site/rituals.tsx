import Image from "next/image"
import Link from "next/link"

export type RitualsProps = {
  eyebrow: string
  headlineTop: string
  headlineBottom: string
  intro: string
  imageUrl: string | null
  imageAlt: string
  steps: { number: string; title: string; text: string }[]
}

export function Rituals({
  eyebrow,
  headlineTop,
  headlineBottom,
  intro,
  imageUrl,
  imageAlt,
  steps,
}: RitualsProps) {
  return (
    <section id="about" className="relative w-full bg-secondary/40 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="mb-4 text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
              {eyebrow}
            </p>
            <h2 className="font-serif text-3xl leading-[1.05] tracking-tight sm:text-5xl">
              {headlineTop}
              <br />
              <span className="text-[color:var(--primary)]">{headlineBottom}</span>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              {intro}
            </p>

            {imageUrl ? (
              <div className="relative mt-10 aspect-[4/3] w-full overflow-hidden rounded-md">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-7">
            <ol className="grid grid-cols-1 sm:grid-cols-2">
              {steps.map((step, i) => {
                const isLast = i === steps.length - 1
                const isPenultimateOrEarlier = i < steps.length - 2
                const isLeftCol = i % 2 === 0
                return (
                  <li
                    key={step.number}
                    className={[
                      "flex flex-col gap-3 border-border px-2 py-8 sm:px-6",
                      isPenultimateOrEarlier ? "sm:border-b" : "",
                      isLeftCol ? "sm:border-r" : "",
                      !isLast ? "border-b sm:border-b-0" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-2xl text-[color:var(--accent)]">
                        {step.number}
                      </span>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    <h3 className="font-serif text-2xl leading-tight">
                      {step.title}
                    </h3>
                    <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                      {step.text}
                    </p>
                  </li>
                )
              })}
            </ol>

            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-border pt-10">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[color:var(--primary)]"
              >
                Start with one ebook
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" />
                </svg>
              </Link>
              <p className="text-xs tracking-wide text-muted-foreground">
                Free sample chapter • 30-day refund • Lifetime updates
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
