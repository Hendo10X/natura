/**
 * All site content lives here. This is plain TS — no CMS, no DB, no
 * fetching. Edit values in this file and the site updates on next save.
 */

import type { NavLink } from "@/components/site/navbar"
import type { FooterColumn } from "@/components/site/footer"

// ---------------------------------------------------------------- chrome

export const NAV_LINKS: NavLink[] = [
  { label: "Shop", href: "/shop" },
  { label: "Sleep Library", href: "/sleep" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
]

export const FOOTER = {
  tagline:
    "A small library of natural remedy ebooks, made slowly, in Northern Italy. Made for older readers, but read by everyone who loves a quieter evening.",
  disclaimer:
    "All remedies for informational use; consult your physician for medical advice.",
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
  ] satisfies FooterColumn[],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
}

// ---------------------------------------------------------------- hero

export const HERO = {
  headlineTop: "Sleep softer.",
  headlineBottom: "Wake gentler.",
  subheadline:
    "Beautifully written ebooks of time-tested herbal remedies — made with older adults in mind, for the nights that used to feel long.",
  primaryCtaLabel: "Browse the library",
  primaryCtaHref: "/shop",
  secondaryCtaLabel: "Sleep collection",
  secondaryCtaHref: "/sleep",
  videoUrl: "/videos/Herbs.mp4",
  stats: [
    { figure: "24", caption: "Original ebooks" },
    { figure: "9,400+", caption: "Quiet sleepers" },
    { figure: "4.9", caption: "Reader rating" },
  ],
}

// ---------------------------------------------------------------- ebooks

export type Ebook = {
  title: string
  subtitle: string
  slug: string
  category: "sleep" | "calm" | "energy" | "digestion" | "general"
  price: number
  pages: number
  isBestSeller?: boolean
  coverUrl: string
  coverAlt: string
  shortDescription: string
  longDescription: string[]
  /** Polar product ID. When absent, the Buy button is disabled. */
  polarProductId?: string
}

export const EBOOKS: Ebook[] = [
  {
    title: "The Quiet Hour",
    subtitle: "Herbal teas for restful nights",
    slug: "the-quiet-hour",
    category: "sleep",
    price: 18,
    pages: 142,
    isBestSeller: true,
    coverUrl: "/images/herb cup.jpg",
    coverAlt: "Warm herbal tea in a ceramic cup",
    shortDescription:
      "Twelve carefully chosen tisanes for the last hour of the day. Lavender, chamomile, lemon balm and more — each with brewing notes, timing, and a list of what to avoid alongside common medications.",
    longDescription: [
      "Twelve carefully chosen tisanes for the last hour of the day. Lavender, chamomile, lemon balm and more — each with brewing notes, timing, and a list of what to avoid alongside common medications.",
      "Written in a large, readable typeface and printable as a bedside companion.",
    ],
  },
  {
    title: "Lavender at Dusk",
    subtitle: "Bedtime rituals for older adults",
    slug: "lavender-at-dusk",
    category: "sleep",
    price: 22,
    pages: 168,
    coverUrl: "/images/lavender_sprigs.jpg",
    coverAlt: "Dried lavender sprigs tied with string",
    shortDescription:
      "A short, gentle programme for the half-hour before sleep. Includes breathwork, scent, light, and a two-week journal to track how the body settles.",
    longDescription: [
      "A short, gentle programme for the half-hour before sleep. Includes breathwork, scent, light, and a two-week journal to track how the body settles.",
    ],
  },
  {
    title: "Chamomile & Calm",
    subtitle: "Gentle remedies for an anxious mind",
    slug: "chamomile-and-calm",
    category: "calm",
    price: 16,
    pages: 120,
    coverUrl: "/images/chamomile_flower.jpg",
    coverAlt: "Chamomile flowers in bloom",
    shortDescription:
      "For the kind of evening worry that visits unannounced. A small atlas of chamomile, passionflower and lemon balm preparations, with notes for caregivers.",
    longDescription: [
      "For the kind of evening worry that visits unannounced. A small atlas of chamomile, passionflower and lemon balm preparations, with notes for caregivers.",
    ],
  },
  {
    title: "Warm Hands, Slow Breath",
    subtitle: "An evening practice in twelve steps",
    slug: "warm-hands-slow-breath",
    category: "calm",
    price: 14,
    pages: 96,
    coverUrl: "/images/warmhands.jpg",
    coverAlt: "Warm hands cradling a teacup",
    shortDescription:
      "A pocket-sized practice that needs nothing more than warm water, a cup and ten quiet minutes.",
    longDescription: [
      "A pocket-sized practice that needs nothing more than warm water, a cup and ten quiet minutes.",
    ],
  },
]

// ---------------------------------------------------------------- featured

export const FEATURED = {
  eyebrow: "The Library — 01",
  headlineTop: "Ebooks chosen for the",
  headlineBottom: "gentlest evenings.",
}

// ---------------------------------------------------------------- sleep section

export const SLEEP_SECTION = {
  eyebrow: "The Library — 02",
  headlineTop: "Made for the nights",
  headlineBottom: "that feel longest.",
  body: "Our sleep collection was written for parents and grandparents — for anyone whose evenings have grown a little restless. Each ebook walks gently, page by page, through plants and rituals that ease the body back into rest.",
  imageUrl: "/images/warmhands.jpg",
  imageAlt: "Warm hands cradling a teacup",
  statFigure: "98%",
  statCaption:
    "of readers over 60 reported falling asleep faster within two weeks.",
  bullets: [
    {
      title: "Plant by plant",
      text: "Lavender, chamomile, valerian, lemon balm — exactly how to prepare, when to take, and what to avoid.",
    },
    {
      title: "Large, readable typography",
      text: "Designed to be kind to older eyes, printable, and easy to follow at bedside.",
    },
    {
      title: "Doctor-reviewed",
      text: "Every remedy is cross-checked with a registered herbalist and a sleep physician.",
    },
  ],
}

// ---------------------------------------------------------------- rituals

export const RITUALS = {
  eyebrow: "The Practice — 03",
  headlineTop: "A practice, not a",
  headlineBottom: "prescription.",
  intro:
    "Blue Hibiscus is a small, slow press. We publish four to six ebooks a year, each one drawn from a long tradition of plant medicine and reviewed for the gentlest possible use.",
  imageUrl: "/images/herbs.jpg",
  imageAlt: "Fresh culinary herbs gathered on a board",
  steps: [
    {
      number: "01",
      title: "Choose your ebook",
      text: "Browse the library by season, complaint, or plant. Read sample chapters for free.",
    },
    {
      number: "02",
      title: "Read at your pace",
      text: "Download to any device, or print a large-type edition for bedside use.",
    },
    {
      number: "03",
      title: "Prepare the remedy",
      text: "Step-by-step instructions, ingredient sourcing, and quiet evening rituals.",
    },
    {
      number: "04",
      title: "Sleep, gently",
      text: "Track how the body settles with the included two-week rest journal.",
    },
  ],
}

// ---------------------------------------------------------------- marquee

export const MARQUEE_PHRASES = [
  "Chamomile",
  "Lavender",
  "Valerian root",
  "Passionflower",
  "Lemon balm",
  "Ashwagandha",
  "Magnolia bark",
  "Tart cherry",
  "Hops",
  "California poppy",
]

// ---------------------------------------------------------------- testimonials

export const TESTIMONIALS_SECTION = {
  eyebrow: "Letters from readers — 04",
  headlineTop: "Quiet words from",
  headlineBottom: "rested readers.",
  averageRating: "4.9",
  reviewCount: "2,100+",
}

export const TESTIMONIALS = [
  {
    name: "Annika R.",
    meta: "Daughter, reading from Oslo",
    quote:
      "I bought The Quiet Hour for my mother — eighty-three and a stubborn night-owl. She has slept seven hours, three nights running. I have not seen her this rested in a decade.",
  },
  {
    name: "Mary-Anne T.",
    meta: "Retired nurse, 71",
    quote:
      "The instructions are unhurried, the writing kind. I made the lavender tisane the same evening it arrived and I slept like the kitchen had been blessed.",
  },
  {
    name: "Harold K.",
    meta: "Long-time gardener, 78",
    quote:
      "Finally an herbal book that is not afraid to say what NOT to take alongside medication. A small thing, but for a man my age — a very big thing.",
  },
  {
    name: "Priya S.",
    meta: "Reading with her dad",
    quote:
      "Beautiful, slow, and useful. The large-print edition is on my father's nightstand and the smaller one travels with me.",
  },
]

// ---------------------------------------------------------------- journal

export type Post = {
  title: string
  slug: string
  excerpt: string
  coverUrl: string
  coverAlt: string
  publishedAt: string
  body: string[]
}

export const POSTS: Post[] = [
  {
    title: "A short defense of the evening kettle",
    slug: "evening-kettle",
    excerpt:
      "Why the act of boiling water at 9pm is doing more than you think.",
    coverUrl: "/images/warmhands.jpg",
    coverAlt: "Warm hands cradling a teacup",
    publishedAt: "2025-02-12",
    body: [
      "A short defense of the evening kettle.",
      "The act of boiling water at 9pm signals the body that the day is winding down — a small ritual that pulls the nervous system out of its daylight clamour.",
    ],
  },
  {
    title: "Lavender, in three forms",
    slug: "lavender-three-forms",
    excerpt:
      "Sachet, tisane, pillow spray — and what each one is actually doing.",
    coverUrl: "/images/lavender_sprigs.jpg",
    coverAlt: "Dried lavender sprigs tied with string",
    publishedAt: "2025-03-04",
    body: [
      "Lavender shows up everywhere in evening apothecary. Here we walk through three of its most useful forms and what each one is actually doing in the body.",
    ],
  },
  {
    title: "What we mean by 'gentle'",
    slug: "what-gentle-means",
    excerpt:
      "Notes on a word we use a lot, and what it means in practice.",
    coverUrl: "/images/chamomile_flower.jpg",
    coverAlt: "Chamomile flowers in bloom",
    publishedAt: "2025-04-21",
    body: [
      "We use the word 'gentle' a great deal at Blue Hibiscus. Here is what we mean by it, in practice.",
    ],
  },
]

// ---------------------------------------------------------------- generic pages

export type Page = {
  slug: string
  title: string
  subtitle?: string
  coverUrl?: string
  coverAlt?: string
  body: string[]
}

export const PAGES: Page[] = [
  {
    slug: "about",
    title: "About Blue Hibiscus",
    subtitle: "A small, slow press, made for quieter evenings.",
    coverUrl: "/images/herbs.jpg",
    coverAlt: "Fresh culinary herbs gathered on a board",
    body: [
      "Blue Hibiscus is a small ebook press dedicated to gentle plant remedies, with a focus on the kind of careful, doctor-reviewed writing that older readers can actually trust.",
      "We publish four to six titles a year, slowly. Each one is reviewed by a registered herbalist and a sleep physician, set in large, kind type, and made available in both screen and printable formats.",
    ],
  },
  {
    slug: "bundles",
    title: "Bundles",
    subtitle: "Save when you read together.",
    body: ["Pair a sleep title with a calm title and save 20%. More bundles coming soon."],
  },
  {
    slug: "gift-cards",
    title: "Gift cards",
    subtitle: "A small, quiet gift.",
    body: [
      "Send a gift card by email in any amount. Redeemable against any title in the library.",
    ],
  },
  {
    slug: "free-sample",
    title: "Free sample",
    subtitle: "Read a chapter, on us.",
    body: [
      "Enter your email and we'll send a chapter of The Quiet Hour, our most-loved sleep title.",
    ],
  },
  {
    slug: "reading-guides",
    title: "Reading guides",
    subtitle: "How to read these ebooks.",
    body: [
      "A short note on how to use our ebooks — pace, sequencing, and when to stop and brew.",
    ],
  },
  {
    slug: "herb-glossary",
    title: "Herb glossary",
    subtitle: "Plants we write about.",
    body: [
      "A growing glossary of the plants we feature, with botanical names, common uses, and contraindications.",
    ],
  },
  {
    slug: "press",
    title: "Press",
    subtitle: "What people have written about us.",
    body: ["Selected press, reviews and recognition for Blue Hibiscus."],
  },
  {
    slug: "contact",
    title: "Contact",
    subtitle: "Reach a real person.",
    body: [
      "Email hello@bluehibiscus.example and a human will reply, usually within one working day.",
    ],
  },
  {
    slug: "faq",
    title: "FAQs",
    subtitle: "Common questions.",
    body: [
      "Answers to the most common questions about our ebooks, formats, and remedies.",
    ],
  },
  {
    slug: "shipping",
    title: "Shipping",
    subtitle: "How and when our ebooks arrive.",
    body: [
      "Our ebooks are delivered instantly to your email. No physical shipping is involved.",
    ],
  },
  {
    slug: "refunds",
    title: "Refunds",
    subtitle: "A 30-day refund window.",
    body: [
      "If a title isn't for you, we'll refund it within 30 days of purchase — no questions asked.",
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    subtitle: "Made readable.",
    body: [
      "Every title ships with a large-print edition, dyslexia-friendly typography, and full screen-reader support.",
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    subtitle: "How we handle your data.",
    body: [
      "We collect only what we need to deliver your ebooks. No tracking, no resale, no third-party analytics.",
    ],
  },
  {
    slug: "terms",
    title: "Terms",
    subtitle: "Terms of service.",
    body: ["By purchasing from Blue Hibiscus you agree to our terms of service."],
  },
  {
    slug: "cookies",
    title: "Cookies",
    subtitle: "Just the essentials.",
    body: [
      "We use only essential cookies for the cart and login. No marketing cookies.",
    ],
  },
]
