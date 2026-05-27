import Link from "next/link"
import { PageShell } from "@/components/site/page-shell"
import { FOOTER, NAV_LINKS } from "@/lib/content"

export const metadata = {
  title: "Thank you — Blue Hibiscus",
  description: "Your order is on its way.",
}

type SearchParams = Promise<{ checkout_id?: string }>

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { checkout_id } = await searchParams

  return (
    <PageShell navLinks={NAV_LINKS} footer={FOOTER}>
      <section className="mx-auto flex w-full max-w-3xl flex-col items-start px-6 pt-32 pb-24 sm:px-10 sm:pt-40 sm:pb-32">
        <span className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
          Thank you
        </span>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          Your ebook is on its way.
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          We’ve received your order. A download link is in your inbox now,
          and a copy will sit in your Polar customer portal whenever you need
          it again.
        </p>

        {checkout_id ? (
          <p className="mt-8 text-xs tracking-wide text-muted-foreground">
            Order reference: <span className="font-mono">{checkout_id}</span>
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary"
          >
            Keep browsing
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            Back to the home page
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
