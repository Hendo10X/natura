import Link from "next/link"

type Stat = { figure: string; caption: string }

export type HeroProps = {
  headlineTop: string
  headlineBottom: string
  subheadline?: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  videoUrl: string | null
  stats: Stat[]
}

export function Hero({
  headlineTop,
  headlineBottom,
  subheadline,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  videoUrl,
  stats,
}: HeroProps) {
  return (
    <section className="relative isolate h-svh min-h-160 w-full overflow-hidden bg-black">
      {videoUrl ? (
        <>
          {/* Start fetching the video as early as possible so the first
              paint already has bytes to work with. */}
          <link rel="preload" as="video" href={videoUrl} type="video/mp4" />
          <video
            className="absolute inset-0 -z-10 h-full w-full bg-black object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disableRemotePlayback
            // The video element itself is black until the first frame paints,
            // so the user never sees the warm cream/brown body color flash through.
            style={{ backgroundColor: "#000" }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </>
      ) : null}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/55 via-black/30 to-black/65" />

      <div className="relative flex h-full w-full flex-col">
        <div className="flex-1" />

        <div className="mx-auto w-full max-w-7xl px-6 pb-20 sm:px-10 sm:pb-28">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h1 className="font-serif text-4xl leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[80px]">
                {headlineTop}
                <br />
                <span className="text-white/90">{headlineBottom}</span>
              </h1>
              {subheadline ? (
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                  {subheadline}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
              <Link
                href={primaryCtaHref}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-white"
              >
                {primaryCtaLabel}
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
              <Link
                href={secondaryCtaHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                {secondaryCtaLabel}
              </Link>
            </div>
          </div>

          {stats.length > 0 ? (
            <div className="mt-14 grid grid-cols-3 gap-6 border-t border-white/20 pt-6 text-white/85 sm:gap-10">
              {stats.map((s) => (
                <div key={s.caption}>
                  <div className="font-serif text-2xl sm:text-3xl">{s.figure}</div>
                  <div className="mt-1 text-[11px] tracking-[0.16em] uppercase text-white/65">
                    {s.caption}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
