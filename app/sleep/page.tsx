import { PageShell } from "@/components/site/page-shell"
import { PageHeader } from "@/components/site/page-header"
import { EbookCard } from "@/components/site/featured-ebooks"
import { SleepCollection } from "@/components/site/sleep-collection"
import { FOOTER, NAV_LINKS } from "@/lib/content"
import { getEbooks, getLanding } from "@/lib/sanity"

export const revalidate = 60

export const metadata = {
  title: "Sleep Library — Blue Hibiscus",
  description:
    "Gentle herbal remedy ebooks written for older adults whose evenings have grown a little restless.",
}

export default async function SleepPage() {
  const [ebooks, landing] = await Promise.all([getEbooks(), getLanding()])
  const sleepBooks = ebooks.filter((b) => b.category === "sleep")

  return (
    <PageShell navLinks={NAV_LINKS} footer={FOOTER}>
      <PageHeader
        eyebrow={landing.sleep.eyebrow}
        title="Made for the nights that feel longest."
        subtitle={landing.sleep.body}
      />

      <SleepCollection {...landing.sleep} />

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-28">
        <h2 className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
          Titles in the sleep collection
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {sleepBooks.length} {sleepBooks.length === 1 ? "title" : "titles"} in
          this collection.
        </p>

        {sleepBooks.length === 0 ? (
          <p className="mt-12 text-muted-foreground">
            No sleep ebooks yet. Add some in the Sanity Studio at /studio.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sleepBooks.map((book) => (
              <EbookCard key={book.slug} book={book} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  )
}
