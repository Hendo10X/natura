import "server-only"
import { getPayload } from "payload"
import type { Payload } from "payload"
import config from "@payload-config"

let cached: Promise<Payload> | null = null

/** Returns a single, cached Payload instance for use in RSC. */
export function getPayloadClient() {
  if (!cached) {
    cached = getPayload({ config })
  }
  return cached
}

export type MediaDoc = {
  id: number | string
  filename?: string
  url?: string
  alt?: string
}

/**
 * A media reference as it comes back from Payload. Depending on the `depth`
 * passed to the query — and Payload's quirks per-database — this can be:
 *   - a fully populated media object: `{ id, filename, url, alt, … }`
 *   - a partially populated object: `{ id }` only
 *   - just an ID: a number (Postgres) or string (Mongo)
 *   - null/undefined when no cover is linked
 */
export type MediaRef = Partial<MediaDoc> | number | string | null | undefined

function isPopulated(value: unknown): value is MediaDoc {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as { filename?: unknown }).filename === "string"
  )
}

function getId(value: unknown): number | string | null {
  if (value === null || value === undefined) return null
  if (typeof value === "number" || typeof value === "string") return value
  const id = (value as { id?: number | string }).id
  return id ?? null
}

/** Resolve a populated media object to a renderable URL (or null). */
export function mediaUrl(media: unknown): string | null {
  if (!media || typeof media !== "object") return null
  const m = media as { url?: string; filename?: string }
  // Trust whatever the media collection's afterRead hook + storage plugin
  // produced — either an absolute blob URL (Vercel Blob in prod) or a
  // local /uploads/media/* path (dev).
  if (m.url) return m.url
  if (m.filename) return `/uploads/media/${encodeURIComponent(m.filename)}`
  return null
}

/** Best-effort alt label from a populated media object. */
export function mediaAlt(media: unknown, fallback = ""): string {
  if (!media || typeof media !== "object") return fallback
  const m = media as { alt?: string }
  return m.alt || fallback
}

/**
 * Build a lookup map of `{ id -> fully populated media doc }`.
 *
 * Accepts a mixed array of refs. Anything that arrived already-populated is
 * indexed as-is; anything that's a bare ID, *or* an object without a
 * filename (partial population), is collected into a single batched
 * `media.find({ where: { id: { in: […] } } })` so the result is always
 * complete.
 */
export async function resolveMediaRefs(
  payload: Payload,
  refs: MediaRef[]
): Promise<Map<number | string, MediaDoc>> {
  const map = new Map<number | string, MediaDoc>()
  const idsToFetch = new Set<number | string>()

  for (const ref of refs) {
    if (!ref) continue
    if (isPopulated(ref)) {
      map.set(ref.id, ref)
      continue
    }
    const id = getId(ref)
    if (id !== null) idsToFetch.add(id)
  }

  if (idsToFetch.size > 0) {
    const ids = Array.from(idsToFetch)
    const res = await payload.find({
      collection: "media",
      where: { id: { in: ids } },
      limit: ids.length,
      depth: 0,
    })
    for (const doc of res.docs as MediaDoc[]) {
      map.set(doc.id, doc)
    }
  }

  return map
}

/**
 * Resolve a single ref using the map from `resolveMediaRefs`. Always
 * prefers the map's fully populated doc when available — so a partial
 * inline object can't sneak through and break URL generation.
 */
export function pickMedia(
  ref: MediaRef,
  map: Map<number | string, MediaDoc>
): MediaDoc | null {
  if (!ref) return null
  const id = getId(ref)
  if (id !== null && map.has(id)) return map.get(id)!
  return isPopulated(ref) ? ref : null
}
