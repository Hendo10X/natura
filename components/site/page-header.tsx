export type PageHeaderProps = {
  eyebrow?: string
  title: string
  subtitle?: string | null
}

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <header className="border-b border-border bg-secondary/40">
      <div className="mx-auto w-full max-w-7xl px-6 pt-32 pb-16 sm:px-10 sm:pt-40 sm:pb-24">
        {eyebrow ? (
          <p className="mb-5 text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  )
}
