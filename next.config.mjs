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
}

export default nextConfig
