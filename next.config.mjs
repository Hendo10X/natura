import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root so Next/Turbopack doesn't pick up the bun.lock
  // sitting in C:\Users\Hendo\ as the project root.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        // Locked to your specific Sanity project — slightly safer than
        // allowing all of cdn.sanity.io.
        pathname: "/images/mlqh0y6z/**",
      },
    ],
  },
}

export default nextConfig
