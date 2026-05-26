import { Navbar } from "@/components/site/navbar"
import { Hero } from "@/components/site/hero"
import { FeaturedEbooks } from "@/components/site/featured-ebooks"
import { SleepCollection } from "@/components/site/sleep-collection"
import { Marquee } from "@/components/site/marquee"
import { Rituals } from "@/components/site/rituals"
import { Testimonials } from "@/components/site/testimonials"
import { Footer } from "@/components/site/footer"
import {
  EBOOKS,
  FEATURED,
  FOOTER,
  HERO,
  MARQUEE_PHRASES,
  NAV_LINKS,
  RITUALS,
  SLEEP_SECTION,
  TESTIMONIALS,
  TESTIMONIALS_SECTION,
} from "@/lib/content"

export default function Page() {
  return (
    <main className="relative w-full bg-background text-foreground">
      <Navbar links={NAV_LINKS} variant="over-hero" />
      <Hero {...HERO} />
      <FeaturedEbooks
        eyebrow={FEATURED.eyebrow}
        headlineTop={FEATURED.headlineTop}
        headlineBottom={FEATURED.headlineBottom}
        viewAllLabel={`View all ${EBOOKS.length} ebooks`}
        totalLabel={`View all ${EBOOKS.length} ebooks`}
        books={EBOOKS.slice(0, 4)}
      />
      <Marquee phrases={MARQUEE_PHRASES} />
      <SleepCollection {...SLEEP_SECTION} />
      <Rituals {...RITUALS} />
      <Testimonials {...TESTIMONIALS_SECTION} entries={TESTIMONIALS} />
      <Footer {...FOOTER} />
    </main>
  )
}
