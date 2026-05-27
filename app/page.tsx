import { Navbar } from "@/components/site/navbar"
import { Hero } from "@/components/site/hero"
import { FeaturedEbooks } from "@/components/site/featured-ebooks"
import { SleepCollection } from "@/components/site/sleep-collection"
import { Marquee } from "@/components/site/marquee"
import { Rituals } from "@/components/site/rituals"
import { Testimonials } from "@/components/site/testimonials"
import { Footer } from "@/components/site/footer"
import {
  FEATURED,
  FOOTER,
  MARQUEE_PHRASES,
  NAV_LINKS,
  RITUALS,
  TESTIMONIALS,
  TESTIMONIALS_SECTION,
} from "@/lib/content"
import { getEbooks, getLanding } from "@/lib/sanity"

export const revalidate = 60

export default async function Page() {
  const [ebooks, landing] = await Promise.all([getEbooks(), getLanding()])
  const featuredBooks = ebooks.slice(0, 4)

  return (
    <main className="relative w-full bg-background text-foreground">
      <Navbar links={NAV_LINKS} variant="over-hero" />
      <Hero {...landing.hero} />
      <FeaturedEbooks
        eyebrow={FEATURED.eyebrow}
        headlineTop={FEATURED.headlineTop}
        headlineBottom={FEATURED.headlineBottom}
        viewAllLabel={`View all ${ebooks.length} ebooks`}
        totalLabel={`View all ${ebooks.length} ebooks`}
        books={featuredBooks}
      />
      <Marquee phrases={MARQUEE_PHRASES} />
      <SleepCollection {...landing.sleep} />
      <Rituals {...RITUALS} />
      <Testimonials {...TESTIMONIALS_SECTION} entries={TESTIMONIALS} />
      <Footer {...FOOTER} />
    </main>
  )
}
