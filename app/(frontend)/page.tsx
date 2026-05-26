import { Navbar, type NavLink } from "@/components/site/navbar"
import { Hero } from "@/components/site/hero"
import {
  FeaturedEbooks,
  type EbookCardData,
} from "@/components/site/featured-ebooks"
import { SleepCollection } from "@/components/site/sleep-collection"
import { Marquee } from "@/components/site/marquee"
import { Rituals } from "@/components/site/rituals"
import {
  Testimonials,
  type TestimonialEntry,
} from "@/components/site/testimonials"
import { Footer, type FooterColumn } from "@/components/site/footer"
import {
  getPayloadClient,
  mediaAlt,
  mediaUrl,
  pickMedia,
  resolveMediaRefs,
  type MediaRef,
} from "@/lib/payload"

export const dynamic = "force-dynamic"

export default async function Page() {
  const payload = await getPayloadClient()

  const [landing, navigation, ebooksRes, testimonialsRes, ebookCount] =
    await Promise.all([
      payload.findGlobal({ slug: "landing", depth: 2 }),
      payload.findGlobal({ slug: "navigation", depth: 1 }),
      payload.find({
        collection: "ebooks",
        limit: 4,
        depth: 2,
        sort: "-isBestSeller",
      }),
      payload.find({ collection: "testimonials", limit: 4, depth: 0 }),
      payload.count({ collection: "ebooks" }),
    ])

  const l = landing as Record<string, any>
  const n = navigation as Record<string, any>
  const hero = l.hero ?? {}
  const featured = l.featured ?? {}
  const sleep = l.sleep ?? {}
  const rituals = l.rituals ?? {}
  const marquee = l.marquee ?? {}
  const reviews = l.testimonials ?? {}

  // Resolve every cover/image reference in one batched lookup, so the page
  // renders correctly whether Payload populated the relation or returned
  // just the ID.
  const mediaRefs: MediaRef[] = [
    hero.video as MediaRef,
    sleep.image as MediaRef,
    rituals.image as MediaRef,
    ...ebooksRes.docs.map((b: any) => b.cover as MediaRef),
  ]
  const mediaMap = await resolveMediaRefs(payload, mediaRefs)

  const navLinks: NavLink[] = (n.primary ?? []).map((link: any) => ({
    label: link.label,
    href: link.href,
  }))

  const footerColumns: FooterColumn[] = (n.footer?.columns ?? []).map(
    (col: any) => ({
      title: col.title,
      links: (col.links ?? []).map((link: any) => ({
        label: link.label,
        href: link.href,
      })),
    })
  )

  const legal = (n.footer?.legal ?? []).map((link: any) => ({
    label: link.label,
    href: link.href,
  }))

  const books: EbookCardData[] = ebooksRes.docs.map((b: any) => {
    const cover = pickMedia(b.cover, mediaMap)
    return {
      title: b.title,
      subtitle: b.subtitle,
      price: b.price,
      pages: b.pages,
      slug: b.slug,
      isBestSeller: b.isBestSeller,
      coverUrl: mediaUrl(cover),
      coverAlt: mediaAlt(cover, b.title),
    }
  })

  const testimonialEntries: TestimonialEntry[] = testimonialsRes.docs.map(
    (t: any) => ({ name: t.name, meta: t.meta, quote: t.quote })
  )

  const totalEbooks = ebookCount.totalDocs
  const heroVideo = pickMedia(hero.video, mediaMap)
  const sleepImage = pickMedia(sleep.image, mediaMap)
  const ritualsImage = pickMedia(rituals.image, mediaMap)

  return (
    <main className="relative w-full bg-background text-foreground">
      <Navbar links={navLinks} variant="over-hero" />
      <Hero
        headlineTop={hero.headlineTop ?? ""}
        headlineBottom={hero.headlineBottom ?? ""}
        subheadline={hero.subheadline}
        primaryCtaLabel={hero.primaryCtaLabel ?? "Browse the library"}
        primaryCtaHref={hero.primaryCtaHref ?? "/shop"}
        secondaryCtaLabel={hero.secondaryCtaLabel ?? "Sleep collection"}
        secondaryCtaHref={hero.secondaryCtaHref ?? "/sleep"}
        videoUrl={mediaUrl(heroVideo)}
        stats={(hero.stats ?? []).map((s: any) => ({
          figure: s.figure,
          caption: s.caption,
        }))}
      />
      <FeaturedEbooks
        eyebrow={featured.eyebrow ?? ""}
        headlineTop={featured.headlineTop ?? ""}
        headlineBottom={featured.headlineBottom ?? ""}
        viewAllLabel={featured.viewAllLabel ?? `View all ${totalEbooks} ebooks`}
        totalLabel={`View all ${totalEbooks} ebooks`}
        books={books}
      />
      <Marquee phrases={(marquee.phrases ?? []).map((p: any) => p.text)} />
      <SleepCollection
        eyebrow={sleep.eyebrow ?? ""}
        headlineTop={sleep.headlineTop ?? ""}
        headlineBottom={sleep.headlineBottom ?? ""}
        body={sleep.body ?? ""}
        imageUrl={mediaUrl(sleepImage)}
        imageAlt={mediaAlt(sleepImage, "Sleep collection")}
        statFigure={sleep.stat?.figure}
        statCaption={sleep.stat?.caption}
        bullets={(sleep.bullets ?? []).map((b: any) => ({
          title: b.title,
          text: b.text,
        }))}
      />
      <Rituals
        eyebrow={rituals.eyebrow ?? ""}
        headlineTop={rituals.headlineTop ?? ""}
        headlineBottom={rituals.headlineBottom ?? ""}
        intro={rituals.intro ?? ""}
        imageUrl={mediaUrl(ritualsImage)}
        imageAlt={mediaAlt(ritualsImage, "Fresh herbs")}
        steps={(rituals.steps ?? []).map((s: any) => ({
          number: s.number,
          title: s.title,
          text: s.text,
        }))}
      />
      <Testimonials
        eyebrow={reviews.eyebrow ?? ""}
        headlineTop={reviews.headlineTop ?? ""}
        headlineBottom={reviews.headlineBottom ?? ""}
        averageRating={reviews.averageRating ?? "4.9"}
        reviewCount={reviews.reviewCount ?? "2,100+"}
        entries={testimonialEntries}
      />
      <Footer
        tagline={n.footer?.tagline ?? ""}
        columns={footerColumns}
        legal={legal}
        disclaimer={n.footer?.disclaimer ?? ""}
      />
    </main>
  )
}
