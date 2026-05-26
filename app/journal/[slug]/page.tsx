import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/site/page-shell"
import { FOOTER, NAV_LINKS, POSTS } from "@/lib/content"

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const post = POSTS.find((p) => p.slug === slug)
  if (!post) return { title: "Not found — Blue Hibiscus" }
  return {
    title: `${post.title} — Blue Hibiscus Journal`,
    description: post.excerpt,
  }
}

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params
  const post = POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  return (
    <PageShell navLinks={NAV_LINKS} footer={FOOTER}>
      <article className="mx-auto w-full max-w-3xl px-6 pt-32 pb-20 sm:px-10 sm:pt-40 sm:pb-28">
        <div className="mb-10 text-sm">
          <Link
            href="/journal"
            className="text-muted-foreground hover:text-foreground"
          >
            ← Journal
          </Link>
        </div>

        <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
          {new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          {post.title}
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="relative mt-12 aspect-16/10 w-full overflow-hidden rounded-md">
          <Image
            src={post.coverUrl}
            alt={post.coverAlt}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-12 space-y-5 text-[15px] leading-[1.7] text-foreground/85">
          {post.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>
    </PageShell>
  )
}
