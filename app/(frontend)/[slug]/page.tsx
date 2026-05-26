import Image from "next/image"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/site/page-shell"
import { PageHeader } from "@/components/site/page-header"
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

const RESERVED = new Set(["shop", "sleep", "about", "journal", "admin", "api"])

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  if (RESERVED.has(slug)) return { title: "Blue Hibiscus" }
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: "pages",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const page = res.docs[0] as any
  if (!page) return { title: "Not found — Blue Hibiscus" }
  return {
    title: `${page.title} — Blue Hibiscus`,
    description: page.subtitle ?? "",
  }
}

export default async function CatchAllPage({ params }: Params) {
  const { slug } = await params
  if (RESERVED.has(slug)) notFound()

  const payload = await getPayloadClient()
  const [{ navLinks, footer }, res] = await Promise.all([
    getSiteChrome(),
    payload.find({
      collection: "pages",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    }),
  ])

  const page = res.docs[0] as any
  if (!page) notFound()

  const mediaMap = await resolveMediaRefs(payload, [page.cover as MediaRef])
  const cover = pickMedia(page.cover, mediaMap)
  const coverUrl = mediaUrl(cover)

  return (
    <PageShell navLinks={navLinks} footer={footer}>
      <PageHeader
        eyebrow={page.title}
        title={page.title}
        subtitle={page.subtitle}
      />

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {page.body ? (
              <RichText content={page.body} />
            ) : (
              <p className="text-muted-foreground">No content yet.</p>
            )}
          </div>
          {coverUrl ? (
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md">
                <Image
                  src={coverUrl}
                  alt={mediaAlt(cover, page.title)}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </PageShell>
  )
}
