import fs from "fs"
import path from "path"
import type { Payload } from "payload"

/**
 * Seeds default content on first run so the site has something to show
 * before an admin logs in. Skips anything that already exists.
 *
 * Wrapped in try/catch per step so a transient "relation does not exist"
 * during a cold start (push migration still in flight) never takes the
 * whole site down — the next request will retry naturally.
 */
export async function seedDefaults(payload: Payload) {
  const steps: Array<[string, () => Promise<void>]> = [
    ["media", () => seedMedia(payload)],
    ["ebooks", () => seedEbooks(payload)],
    ["testimonials", () => seedTestimonials(payload)],
    ["posts", () => seedPosts(payload)],
    ["pages", () => seedPages(payload)],
    ["landing", () => seedLanding(payload)],
    ["navigation", () => seedNavigation(payload)],
  ]
  for (const [label, fn] of steps) {
    try {
      await fn()
    } catch (err) {
      payload.logger.warn(
        `[seed] step "${label}" skipped: ${(err as Error).message}`
      )
    }
  }
}

const PUBLIC_ROOT = path.resolve(process.cwd(), "public")

const MEDIA_FILES: Array<{
  filename: string
  source: string
  alt: string
  kind: "image" | "video"
}> = [
  { filename: "herb-cup.jpg", source: "images/herb cup.jpg", alt: "Warm herbal tea in a ceramic cup", kind: "image" },
  { filename: "lavender-sprigs.jpg", source: "images/lavender_sprigs.jpg", alt: "Dried lavender sprigs tied with string", kind: "image" },
  { filename: "chamomile-flower.jpg", source: "images/chamomile_flower.jpg", alt: "Chamomile flowers in bloom", kind: "image" },
  { filename: "warmhands.jpg", source: "images/warmhands.jpg", alt: "Warm hands cradling a teacup", kind: "image" },
  { filename: "herbs.jpg", source: "images/herbs.jpg", alt: "Fresh culinary herbs gathered on a board", kind: "image" },
  { filename: "Herbs.mp4", source: "videos/Herbs.mp4", alt: "Herbs being prepared", kind: "video" },
]

async function seedMedia(payload: Payload) {
  for (const entry of MEDIA_FILES) {
    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: entry.filename } },
      limit: 1,
    })
    if (existing.totalDocs > 0) continue

    const absolutePath = path.join(PUBLIC_ROOT, entry.source)
    if (!fs.existsSync(absolutePath)) {
      payload.logger.warn(`[seed] media source missing: ${absolutePath}`)
      continue
    }

    // Read into a buffer so we can rename to a clean filename without spaces
    // (the source files in /public have spaces and underscores we don't want
    // exposed in URLs).
    const data = fs.readFileSync(absolutePath)
    const mimetype =
      entry.kind === "video"
        ? "video/mp4"
        : entry.filename.endsWith(".png")
          ? "image/png"
          : "image/jpeg"

    try {
      await payload.create({
        collection: "media",
        data: { alt: entry.alt, kind: entry.kind },
        file: {
          data,
          mimetype,
          name: entry.filename,
          size: data.length,
        },
      })
      payload.logger.info(`[seed] uploaded media: ${entry.filename}`)
    } catch (err) {
      payload.logger.error(
        `[seed] failed to upload ${entry.filename}: ${(err as Error).message}`
      )
    }
  }
}

async function findMediaIdByFilename(payload: Payload, filename: string) {
  const res = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
  })
  return res.docs[0]?.id ?? null
}

/**
 * Idempotent create-or-update keyed by slug. Re-running the seed reconciles
 * stale cover refs, missing fields, and any drift left by an earlier broken run.
 */
async function upsertBySlug(
  payload: Payload,
  collection: "ebooks" | "posts" | "pages",
  slug: string,
  data: Record<string, unknown>
) {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.totalDocs > 0) {
    await payload.update({
      collection,
      id: existing.docs[0].id,
      data: data as any,
    })
  } else {
    await payload.create({ collection, data: data as any })
  }
}

function richText(text: string) {
  return {
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: text.split("\n\n").map((paragraph) => ({
        type: "paragraph",
        format: "" as const,
        indent: 0,
        version: 1,
        direction: "ltr" as const,
        children: [
          {
            type: "text",
            text: paragraph,
            format: 0,
            detail: 0,
            mode: "normal",
            style: "",
            version: 1,
          },
        ],
      })),
    },
  }
}

async function seedEbooks(payload: Payload) {
  const books = [
    {
      title: "The Quiet Hour",
      subtitle: "Herbal teas for restful nights",
      slug: "the-quiet-hour",
      category: "sleep",
      price: 18,
      pages: 142,
      isBestSeller: true,
      coverFile: "herb-cup.jpg",
      shortDescription:
        "Twelve carefully chosen tisanes for the last hour of the day. Lavender, chamomile, lemon balm and more — each with brewing notes, timing, and a list of what to avoid alongside common medications.",
      description: richText(
        "Twelve carefully chosen tisanes for the last hour of the day. Lavender, chamomile, lemon balm and more — each with brewing notes, timing, and a list of what to avoid alongside common medications.\n\nWritten in a large, readable typeface and printable as a bedside companion."
      ),
    },
    {
      title: "Lavender at Dusk",
      subtitle: "Bedtime rituals for older adults",
      slug: "lavender-at-dusk",
      category: "sleep",
      price: 22,
      pages: 168,
      coverFile: "lavender-sprigs.jpg",
      shortDescription:
        "A short, gentle programme for the half-hour before sleep. Includes breathwork, scent, light, and a two-week journal to track how the body settles.",
      description: richText(
        "A short, gentle programme for the half-hour before sleep. Includes breathwork, scent, light, and a two-week journal to track how the body settles."
      ),
    },
    {
      title: "Chamomile & Calm",
      subtitle: "Gentle remedies for an anxious mind",
      slug: "chamomile-and-calm",
      category: "calm",
      price: 16,
      pages: 120,
      coverFile: "chamomile-flower.jpg",
      shortDescription:
        "For the kind of evening worry that visits unannounced. A small atlas of chamomile, passionflower and lemon balm preparations, with notes for caregivers.",
      description: richText(
        "For the kind of evening worry that visits unannounced. A small atlas of chamomile, passionflower and lemon balm preparations, with notes for caregivers."
      ),
    },
    {
      title: "Warm Hands, Slow Breath",
      subtitle: "An evening practice in twelve steps",
      slug: "warm-hands-slow-breath",
      category: "calm",
      price: 14,
      pages: 96,
      coverFile: "warmhands.jpg",
      shortDescription:
        "A pocket-sized practice that needs nothing more than warm water, a cup and ten quiet minutes.",
      description: richText(
        "A pocket-sized practice that needs nothing more than warm water, a cup and ten quiet minutes."
      ),
    },
  ]

  for (const book of books) {
    const coverId = await findMediaIdByFilename(payload, book.coverFile)
    const { coverFile: _ignore, ...rest } = book
    const data = {
      ...rest,
      cover: coverId ?? undefined,
      publishedAt: new Date().toISOString(),
    }
    await upsertBySlug(payload, "ebooks", book.slug, data)
  }
}

async function seedTestimonials(payload: Payload) {
  const entries = [
    {
      name: "Annika R.",
      meta: "Daughter, reading from Oslo",
      quote:
        "I bought The Quiet Hour for my mother — eighty-three and a stubborn night-owl. She has slept seven hours, three nights running. I have not seen her this rested in a decade.",
      rating: 5,
    },
    {
      name: "Mary-Anne T.",
      meta: "Retired nurse, 71",
      quote:
        "The instructions are unhurried, the writing kind. I made the lavender tisane the same evening it arrived and I slept like the kitchen had been blessed.",
      rating: 5,
    },
    {
      name: "Harold K.",
      meta: "Long-time gardener, 78",
      quote:
        "Finally an herbal book that is not afraid to say what NOT to take alongside medication. A small thing, but for a man my age — a very big thing.",
      rating: 5,
    },
    {
      name: "Priya S.",
      meta: "Reading with her dad",
      quote:
        "Beautiful, slow, and useful. The large-print edition is on my father's nightstand and the smaller one travels with me.",
      rating: 5,
    },
  ]

  for (const entry of entries) {
    const existing = await payload.find({
      collection: "testimonials",
      where: { name: { equals: entry.name } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      await payload.update({
        collection: "testimonials",
        id: existing.docs[0].id,
        data: entry as any,
      })
    } else {
      await payload.create({ collection: "testimonials", data: entry as any })
    }
  }
}

async function seedPosts(payload: Payload) {
  const posts = [
    {
      title: "A short defense of the evening kettle",
      slug: "evening-kettle",
      excerpt: "Why the act of boiling water at 9pm is doing more than you think.",
      coverFile: "warmhands.jpg",
      body: "A short defense of the evening kettle.\n\nThe act of boiling water at 9pm signals the body that the day is winding down — a small ritual that pulls the nervous system out of its daylight clamour.",
    },
    {
      title: "Lavender, in three forms",
      slug: "lavender-three-forms",
      excerpt: "Sachet, tisane, pillow spray — and what each one is actually doing.",
      coverFile: "lavender-sprigs.jpg",
      body: "Lavender shows up everywhere in evening apothecary. Here we walk through three of its most useful forms and what each one is actually doing in the body.",
    },
    {
      title: "What we mean by 'gentle'",
      slug: "what-gentle-means",
      excerpt: "Notes on a word we use a lot, and what it means in practice.",
      coverFile: "chamomile-flower.jpg",
      body: "We use the word 'gentle' a great deal at Blue Hibiscus. Here is what we mean by it, in practice.",
    },
  ]

  for (const post of posts) {
    const coverId = await findMediaIdByFilename(payload, post.coverFile)
    const { coverFile: _ignore, body, ...rest } = post
    await upsertBySlug(payload, "posts", post.slug, {
      ...rest,
      cover: coverId ?? undefined,
      body: richText(body),
      publishedAt: new Date().toISOString(),
    })
  }
}

async function seedPages(payload: Payload) {
  const pages = [
    {
      title: "About Blue Hibiscus",
      slug: "about",
      subtitle: "A small, slow press, made for quieter evenings.",
      coverFile: "herbs.jpg",
      body: "Blue Hibiscus is a small ebook press dedicated to gentle plant remedies, with a focus on the kind of careful, doctor-reviewed writing that older readers can actually trust.\n\nWe publish four to six titles a year, slowly. Each one is reviewed by a registered herbalist and a sleep physician, set in large, kind type, and made available in both screen and printable formats.",
    },
    { title: "Bundles", slug: "bundles", subtitle: "Save when you read together.", body: "Pair a sleep title with a calm title and save 20%. More bundles coming soon.", coverFile: "herbs.jpg" },
    { title: "Gift cards", slug: "gift-cards", subtitle: "A small, quiet gift.", body: "Send a gift card by email in any amount. Redeemable against any title in the library.", coverFile: "herb-cup.jpg" },
    { title: "Free sample", slug: "free-sample", subtitle: "Read a chapter, on us.", body: "Enter your email and we'll send a chapter of The Quiet Hour, our most-loved sleep title.", coverFile: "lavender-sprigs.jpg" },
    { title: "Reading guides", slug: "reading-guides", subtitle: "How to read these ebooks.", body: "A short note on how to use our ebooks — pace, sequencing, and when to stop and brew.", coverFile: "chamomile-flower.jpg" },
    { title: "Herb glossary", slug: "herb-glossary", subtitle: "Plants we write about.", body: "A growing glossary of the plants we feature, with botanical names, common uses, and contraindications.", coverFile: "herbs.jpg" },
    { title: "Press", slug: "press", subtitle: "What people have written about us.", body: "Selected press, reviews and recognition for Blue Hibiscus.", coverFile: "herbs.jpg" },
    { title: "Contact", slug: "contact", subtitle: "Reach a real person.", body: "Email hello@bluehibiscus.example and a human will reply, usually within one working day.", coverFile: "warmhands.jpg" },
    { title: "FAQs", slug: "faq", subtitle: "Common questions.", body: "Answers to the most common questions about our ebooks, formats, and remedies.", coverFile: "chamomile-flower.jpg" },
    { title: "Shipping", slug: "shipping", subtitle: "How and when our ebooks arrive.", body: "Our ebooks are delivered instantly to your email. No physical shipping is involved.", coverFile: "herb-cup.jpg" },
    { title: "Refunds", slug: "refunds", subtitle: "A 30-day refund window.", body: "If a title isn't for you, we'll refund it within 30 days of purchase — no questions asked.", coverFile: "warmhands.jpg" },
    { title: "Accessibility", slug: "accessibility", subtitle: "Made readable.", body: "Every title ships with a large-print edition, dyslexia-friendly typography, and full screen-reader support.", coverFile: "lavender-sprigs.jpg" },
    { title: "Privacy", slug: "privacy", subtitle: "How we handle your data.", body: "We collect only what we need to deliver your ebooks. No tracking, no resale, no third-party analytics.", coverFile: "herbs.jpg" },
    { title: "Terms", slug: "terms", subtitle: "Terms of service.", body: "By purchasing from Blue Hibiscus you agree to our terms of service.", coverFile: "herbs.jpg" },
    { title: "Cookies", slug: "cookies", subtitle: "Just the essentials.", body: "We use only essential cookies for the cart and login. No marketing cookies.", coverFile: "herbs.jpg" },
  ]

  for (const page of pages) {
    const coverId = await findMediaIdByFilename(payload, page.coverFile)
    const { coverFile: _ignore, body, ...rest } = page
    await upsertBySlug(payload, "pages", page.slug, {
      ...rest,
      cover: coverId ?? undefined,
      body: richText(body),
    })
  }
}

async function seedLanding(payload: Payload) {
  // Always re-link media on every boot. Even if the admin has edited copy,
  // we want a stale/missing image reference to be auto-healed against the
  // latest media IDs. Headlines are only filled in if they're empty so we
  // don't trample user edits.
  const heroVideo = await findMediaIdByFilename(payload, "Herbs.mp4")
  const sleepImage = await findMediaIdByFilename(payload, "warmhands.jpg")
  const ritualsImage = await findMediaIdByFilename(payload, "herbs.jpg")

  const existing = (await payload.findGlobal({
    slug: "landing",
  })) as Record<string, any>
  const heroFilled = !!existing?.hero?.headlineTop
  if (heroFilled) {
    // Just patch media refs; preserve admin edits.
    await payload.updateGlobal({
      slug: "landing",
      data: {
        hero: { ...(existing.hero ?? {}), video: heroVideo ?? undefined },
        sleep: { ...(existing.sleep ?? {}), image: sleepImage ?? undefined },
        rituals: {
          ...(existing.rituals ?? {}),
          image: ritualsImage ?? undefined,
        },
      } as any,
    })
    return
  }

  await payload.updateGlobal({
    slug: "landing",
    data: {
      hero: {
        headlineTop: "Sleep softer.",
        headlineBottom: "Wake gentler.",
        subheadline:
          "Beautifully written ebooks of time-tested herbal remedies — made with older adults in mind, for the nights that used to feel long.",
        primaryCtaLabel: "Browse the library",
        primaryCtaHref: "/shop",
        secondaryCtaLabel: "Sleep collection",
        secondaryCtaHref: "/sleep",
        video: heroVideo ?? undefined,
        stats: [
          { figure: "24", caption: "Original ebooks" },
          { figure: "9,400+", caption: "Quiet sleepers" },
          { figure: "4.9", caption: "Reader rating" },
        ],
      },
      featured: {
        eyebrow: "The Library — 01",
        headlineTop: "Ebooks chosen for the",
        headlineBottom: "gentlest evenings.",
        viewAllLabel: "View all ebooks",
      },
      sleep: {
        eyebrow: "The Library — 02",
        headlineTop: "Made for the nights",
        headlineBottom: "that feel longest.",
        body: "Our sleep collection was written for parents and grandparents — for anyone whose evenings have grown a little restless. Each ebook walks gently, page by page, through plants and rituals that ease the body back into rest.",
        image: sleepImage ?? undefined,
        stat: {
          figure: "98%",
          caption: "of readers over 60 reported falling asleep faster within two weeks.",
        },
        bullets: [
          { title: "Plant by plant", text: "Lavender, chamomile, valerian, lemon balm — exactly how to prepare, when to take, and what to avoid." },
          { title: "Large, readable typography", text: "Designed to be kind to older eyes, printable, and easy to follow at bedside." },
          { title: "Doctor-reviewed", text: "Every remedy is cross-checked with a registered herbalist and a sleep physician." },
        ],
      },
      rituals: {
        eyebrow: "The Practice — 03",
        headlineTop: "A practice, not a",
        headlineBottom: "prescription.",
        intro: "Blue Hibiscus is a small, slow press. We publish four to six ebooks a year, each one drawn from a long tradition of plant medicine and reviewed for the gentlest possible use.",
        image: ritualsImage ?? undefined,
        steps: [
          { number: "01", title: "Choose your ebook", text: "Browse the library by season, complaint, or plant. Read sample chapters for free." },
          { number: "02", title: "Read at your pace", text: "Download to any device, or print a large-type edition for bedside use." },
          { number: "03", title: "Prepare the remedy", text: "Step-by-step instructions, ingredient sourcing, and quiet evening rituals." },
          { number: "04", title: "Sleep, gently", text: "Track how the body settles with the included two-week rest journal." },
        ],
      },
      marquee: {
        phrases: [
          { text: "Chamomile" },
          { text: "Lavender" },
          { text: "Valerian root" },
          { text: "Passionflower" },
          { text: "Lemon balm" },
          { text: "Ashwagandha" },
          { text: "Magnolia bark" },
          { text: "Tart cherry" },
          { text: "Hops" },
          { text: "California poppy" },
        ],
      },
      testimonials: {
        eyebrow: "Letters from readers — 04",
        headlineTop: "Quiet words from",
        headlineBottom: "rested readers.",
        averageRating: "4.9",
        reviewCount: "2,100+",
      },
    },
  })
}

async function seedNavigation(payload: Payload) {
  const existing = await payload.findGlobal({ slug: "navigation" })
  if (existing && (existing as { primary?: unknown[] }).primary?.length) return

  await payload.updateGlobal({
    slug: "navigation",
    data: {
      primary: [
        { label: "Shop", href: "/shop" },
        { label: "Sleep Library", href: "/sleep" },
        { label: "About", href: "/about" },
        { label: "Journal", href: "/journal" },
      ],
      footer: {
        tagline:
          "A small library of natural remedy ebooks, made slowly, in Northern Italy. Made for older readers, but read by everyone who loves a quieter evening.",
        columns: [
          {
            title: "Shop",
            links: [
              { label: "All ebooks", href: "/shop" },
              { label: "Sleep collection", href: "/sleep" },
              { label: "Bundles", href: "/bundles" },
              { label: "Gift cards", href: "/gift-cards" },
            ],
          },
          {
            title: "Read",
            links: [
              { label: "Free sample", href: "/free-sample" },
              { label: "Journal", href: "/journal" },
              { label: "Reading guides", href: "/reading-guides" },
              { label: "Herb glossary", href: "/herb-glossary" },
              { label: "Press", href: "/press" },
            ],
          },
          {
            title: "Care",
            links: [
              { label: "Contact", href: "/contact" },
              { label: "FAQs", href: "/faq" },
              { label: "Shipping", href: "/shipping" },
              { label: "Refunds", href: "/refunds" },
              { label: "Accessibility", href: "/accessibility" },
            ],
          },
        ],
        legal: [
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
          { label: "Cookies", href: "/cookies" },
          { label: "Admin", href: "/admin" },
        ],
        disclaimer:
          "All remedies for informational use; consult your physician for medical advice.",
      },
    },
  })
}
