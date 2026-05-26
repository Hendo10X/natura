import path from "path"
import { fileURLToPath } from "url"
import { withPayload } from "@payloadcms/next/withPayload"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root so Next/Turbopack doesn't pick up the bun.lock
  // sitting in C:\Users\Hendo\ as the project root.
  turbopack: {
    root: __dirname,
  },
  images: {
    // Payload serves media from /api/media/file/<filename>. The Next/Image
    // optimizer doesn't play well with that endpoint in dev (and there's
    // little to gain since uploaded files are already sized for the web).
    // Bypassing the optimizer makes Image emit a plain <img>.
    unoptimized: true,
  },
}

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
})
