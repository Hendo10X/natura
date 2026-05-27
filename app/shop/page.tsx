import { PageShell } from "@/components/site/page-shell"
import { PageHeader } from "@/components/site/page-header"
import { EbookCard } from "@/components/site/featured-ebooks"
import { FOOTER, NAV_LINKS } from "@/lib/content"
import { getEbooks } from "@/lib/sanity"

export const revalidate = 60

export const metadata = {
  title: "Shop — Blue Hibiscus",
  description: "Every Blue Hibiscus ebook, in one place.",
}

export default async function ShopPage() {
  const ebooks = await getEbooks()

  return (
    <PageShell navLinks={NAV_LINKS} footer={FOOTER}>
      <PageHeader
        eyebrow={`The Library — ${ebooks.length} ${
          ebooks.length === 1 ? "title" : "titles"
        }`}
        title="Every Blue Hibiscus ebook."
        subtitle="Browse the full library. Each title is written slowly, set in large readable type, and reviewed by a registered herbalist."
      />

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-28">
        {ebooks.length === 0 ? (
          <p className="text-muted-foreground">
            No ebooks yet. Add some in the Sanity Studio at /studio.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ebooks.map((book) => (
              <EbookCard key={book.slug} book={book} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  )
}
