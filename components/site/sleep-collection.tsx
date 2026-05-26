import Image from "next/image"
import Link from "next/link"

export type SleepCollectionProps = {
  eyebrow: string
  headlineTop: string
  headlineBottom: string
  body: string
  imageUrl: string | null
  imageAlt: string
  statFigure?: string
  statCaption?: string
  bullets: { title: string; text: string }[]
}

export function SleepCollection({
  eyebrow,
  headlineTop,
  headlineBottom,
  body,
  imageUrl,
  imageAlt,
  statFigure,
  statCaption,
  bullets,
}: SleepCollectionProps) {
  return (
    <section
      id="sleep"
      className="relative w-full overflow-hidden bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 sm:px-10 sm:py-32 lg:grid-cols-12">
        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>
          {statFigure || statCaption ? (
            <div className="absolute -bottom-6 -right-4 hidden w-56 rounded-md border border-white/15 bg-[color:var(--primary)] p-5 sm:block lg:-bottom-8 lg:-right-8">
              {statFigure ? (
                <div className="font-serif text-3xl leading-none">{statFigure}</div>
              ) : null}
              {statCaption ? (
                <p className="mt-2 text-xs leading-relaxed text-white/75">
                  {statCaption}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-6 lg:pl-8">
          <p className="mb-4 text-[11px] tracking-[0.22em] uppercase text-white/65">
            {eyebrow}
          </p>
          <h2 className="font-serif text-3xl leading-[1.05] tracking-tight sm:text-5xl">
            {headlineTop}
            <br />
            <span className="text-white/85">{headlineBottom}</span>
          </h2>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-white/75">
            {body}
          </p>

          {bullets.length > 0 ? (
            <ul className="mt-10 space-y-5 border-t border-white/15 pt-8">
              {bullets.map((b) => (
                <li key={b.title} className="flex items-start gap-4">
                  <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                  <div>
                    <div className="font-serif text-lg">{b.title}</div>
                    <p className="mt-1 max-w-md text-sm leading-relaxed text-white/70">
                      {b.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[color:var(--primary)] transition-colors hover:bg-[color:var(--accent)] hover:text-white"
            >
              Read the sleep collection
            </Link>
            <Link
              href="/free-sample"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Sample a chapter
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
