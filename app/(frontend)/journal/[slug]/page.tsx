import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/site/page-shell"
import { RichText } from "@/components/site/rich-text"
import {
  getPayloadClient,
  mediaAlt,
  mediaUrl,
  pickMedia,
  resolveMediaRefs,
  type MediaRef,
} from "@/lib/payload"
import { getSiteChrome } from "@/lib/site"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const post = res.docs[0] as any
  if (!post) return { title: "Not found — Blue Hibiscus" }
  return {
    title: `${post.title} — Blue Hibiscus Journal`,
    description: post.excerpt ?? "",
  }
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const [{ navLinks, footer }, res] = await Promise.all([
    getSiteChrome(),
    payload.find({
      collection: "posts",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    }),
  ])

  const post = res.docs[0] as any
  if (!post) notFound()

  const mediaMap = await resolveMediaRefs(payload, [post.cover as MediaRef])
  const cover = pickMedia(post.cover, mediaMap)
  const coverUrl = mediaUrl(cover)

  return (
    <PageShell navLinks={navLinks} footer={footer}>
      <article className="mx-auto w-full max-w-3xl px-6 pt-32 pb-20 sm:px-10 sm:pt-40 sm:pb-28">
        <div className="mb-10 text-sm">
          <Link
            href="/journal"
            className="text-muted-foreground hover:text-foreground"
          >
            ← Journal
          </Link>
        </div>

        {post.publishedAt ? (
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
            {new Date(post.publishedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        ) : null}

        <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        ) : null}

        {coverUrl ? (
          <div className="relative mt-12 aspect-[16/10] w-full overflow-hidden rounded-md">
            <Image
              src={coverUrl}
              alt={mediaAlt(cover, post.title)}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        {post.body ? (
          <div className="mt-12">
            <RichText content={post.body} />
          </div>
        ) : null}
      </article>
    </PageShell>
  )
}
