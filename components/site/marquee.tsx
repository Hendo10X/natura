export type MarqueeProps = {
  phrases: string[]
}

export function Marquee({ phrases }: MarqueeProps) {
  if (phrases.length === 0) return null
  const items = [...phrases, ...phrases]
  return (
    <section
      aria-hidden="true"
      className="relative w-full overflow-hidden border-y border-border bg-background py-8"
    >
      <div className="marquee-track flex w-max items-center gap-12 whitespace-nowrap will-change-transform">
        {items.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-flex items-center gap-12 font-serif text-3xl tracking-tight text-foreground/85 sm:text-5xl"
          >
            {word}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
          </span>
        ))}
      </div>
    </section>
  )
}
