import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { parseBody } from "next-sanity/webhook"

/**
 * Sanity GROQ Webhook → Next.js on-demand revalidation.
 *
 * Configure in Sanity dashboard:
 *   API → Webhooks → Create webhook
 *   URL:           https://<your-domain>/api/revalidate
 *   Dataset:       production
 *   Trigger on:    Create, Update, Delete
 *   Filter:        _type in ["ebook", "landing"]
 *   HTTP method:   POST
 *   API version:   v2024-01-01 (or your env apiVersion)
 *   Secret:        same value as SANITY_REVALIDATE_SECRET below
 *
 * Required env var: SANITY_REVALIDATE_SECRET (any long random string, must
 *                   match the secret you put in the Sanity webhook config).
 */

type SignedBody = {
  _type?: string
  slug?: { current?: string } | string
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<SignedBody>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    )

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      )
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: "Bad request: missing _type" },
        { status: 400 }
      )
    }

    // Pages that depend on each type — revalidate broadly so featured grids
    // and listings refresh too.
    if (body._type === "ebook") {
      revalidatePath("/")
      revalidatePath("/shop")
      revalidatePath("/sleep")
      const slug =
        typeof body.slug === "string" ? body.slug : body.slug?.current
      if (slug) revalidatePath(`/shop/${slug}`)
    } else if (body._type === "landing") {
      revalidatePath("/")
      revalidatePath("/sleep")
    }

    return NextResponse.json({ revalidated: true, type: body._type })
  } catch (err) {
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 500 }
    )
  }
}
