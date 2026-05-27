import "server-only"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import {
  EBOOKS as STATIC_EBOOKS,
  HERO as STATIC_HERO,
  SLEEP_SECTION as STATIC_SLEEP,
  type Ebook,
} from "@/lib/content"

/** Shape we read from Sanity. */
type SanityImage = {
  asset?: { _ref?: string }
  alt?: string
}

type RawEbook = {
  _id: string
  title: string
  subtitle?: string
  slug: { current: string }
  category?: Ebook["category"]
  price: number
  pages?: number
  isBestSeller?: boolean
  cover?: SanityImage
  shortDescription?: string
  longDescription?: Array<{
    children?: Array<{ text?: string }>
  }>
  polarProductId?: string
}

function imageUrl(image: SanityImage | undefined): string | null {
  if (!image?.asset?._ref) return null
  return urlFor(image).width(1200).fit("max").url()
}

function imageAlt(image: SanityImage | undefined, fallback: string): string {
  return image?.alt || fallback
}

function blocksToParagraphs(
  blocks: RawEbook["longDescription"]
): string[] | null {
  if (!blocks || blocks.length === 0) return null
  return blocks
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .filter(Boolean)
}

function mapEbook(raw: RawEbook): Ebook {
  return {
    title: raw.title,
    subtitle: raw.subtitle ?? "",
    slug: raw.slug.current,
    category: (raw.category ?? "general") as Ebook["category"],
    price: raw.price,
    pages: raw.pages ?? 0,
    isBestSeller: !!raw.isBestSeller,
    coverUrl: imageUrl(raw.cover) ?? "",
    coverAlt: imageAlt(raw.cover, raw.title),
    shortDescription: raw.shortDescription ?? "",
    longDescription:
      blocksToParagraphs(raw.longDescription) ??
      (raw.shortDescription ? [raw.shortDescription] : []),
    polarProductId: raw.polarProductId,
  }
}

const EBOOK_PROJECTION = /* groq */ `{
  _id, title, subtitle, slug, category, price, pages, isBestSeller,
  cover { asset, alt }, shortDescription, longDescription, polarProductId
}`

const EBOOKS_QUERY = /* groq */ `*[_type == "ebook"] | order(isBestSeller desc, _createdAt desc)${EBOOK_PROJECTION}`
const EBOOK_BY_SLUG_QUERY = /* groq */ `*[_type == "ebook" && slug.current == $slug][0]${EBOOK_PROJECTION}`

/**
 * Returns all ebooks. Falls back to the hardcoded list when Sanity has no
 * documents yet (e.g. first dev boot before content is entered).
 */
export async function getEbooks(): Promise<Ebook[]> {
  try {
    const raws = await client.fetch<RawEbook[]>(EBOOKS_QUERY, {}, {
      next: { revalidate: 60 },
    } as never)
    if (raws && raws.length > 0) return raws.map(mapEbook)
  } catch (err) {
    console.warn("[sanity] getEbooks failed, using static fallback:", err)
  }
  return STATIC_EBOOKS
}

export async function getEbookBySlug(slug: string): Promise<Ebook | null> {
  try {
    const raw = await client.fetch<RawEbook | null>(
      EBOOK_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 60 } } as never
    )
    if (raw) return mapEbook(raw)
  } catch (err) {
    console.warn("[sanity] getEbookBySlug failed, using static fallback:", err)
  }
  return STATIC_EBOOKS.find((b) => b.slug === slug) ?? null
}

// ----------------------------------------------------------------- landing

type RawLanding = {
  hero?: {
    headlineTop?: string
    headlineBottom?: string
    subheadline?: string
    video?: { asset?: { url?: string } }
  }
  sleepSection?: {
    headlineTop?: string
    headlineBottom?: string
    body?: string
    image?: SanityImage
    statFigure?: string
    statCaption?: string
  }
}

const LANDING_QUERY = /* groq */ `*[_type == "landing"][0]{
  hero {
    headlineTop, headlineBottom, subheadline,
    video { asset-> { url } }
  },
  sleepSection {
    headlineTop, headlineBottom, body,
    image { asset, alt },
    statFigure, statCaption
  }
}`

export type LandingContent = {
  hero: typeof STATIC_HERO
  sleep: typeof STATIC_SLEEP
}

/**
 * Returns the landing page content, falling back to static values for any
 * field the editor hasn't filled in.
 */
export async function getLanding(): Promise<LandingContent> {
  let raw: RawLanding | null = null
  try {
    raw = await client.fetch<RawLanding>(
      LANDING_QUERY,
      {},
      { next: { revalidate: 60 } } as never
    )
  } catch (err) {
    console.warn("[sanity] getLanding failed, using static fallback:", err)
  }

  const hero = {
    ...STATIC_HERO,
    headlineTop: raw?.hero?.headlineTop || STATIC_HERO.headlineTop,
    headlineBottom: raw?.hero?.headlineBottom || STATIC_HERO.headlineBottom,
    subheadline: raw?.hero?.subheadline || STATIC_HERO.subheadline,
    videoUrl: raw?.hero?.video?.asset?.url || STATIC_HERO.videoUrl,
  }

  const sleep = {
    ...STATIC_SLEEP,
    headlineTop: raw?.sleepSection?.headlineTop || STATIC_SLEEP.headlineTop,
    headlineBottom:
      raw?.sleepSection?.headlineBottom || STATIC_SLEEP.headlineBottom,
    body: raw?.sleepSection?.body || STATIC_SLEEP.body,
    imageUrl: imageUrl(raw?.sleepSection?.image) || STATIC_SLEEP.imageUrl,
    imageAlt: imageAlt(raw?.sleepSection?.image, STATIC_SLEEP.imageAlt),
    statFigure: raw?.sleepSection?.statFigure || STATIC_SLEEP.statFigure,
    statCaption: raw?.sleepSection?.statCaption || STATIC_SLEEP.statCaption,
  }

  return { hero, sleep }
}
