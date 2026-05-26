import path from "path"
import { fileURLToPath } from "url"
import { buildConfig } from "payload"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import sharp from "sharp"
import { seedDefaults } from "./payload/seed"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: "users",
    meta: { titleSuffix: " — Blue Hibiscus Admin" },
  },
  collections: [
    {
      slug: "users",
      auth: true,
      admin: { useAsTitle: "email" },
      fields: [],
    },

    {
      slug: "media",
      upload: {
        mimeTypes: ["image/*", "video/*"],
        // Store uploads inside the Next.js /public folder so files are served
        // directly by Next as static assets (no /api/media/file/* hop).
        staticDir: path.resolve(dirname, "public/uploads/media"),
      },
      fields: [
        { name: "alt", type: "text" },
        {
          name: "kind",
          type: "select",
          options: [
            { label: "Image", value: "image" },
            { label: "Video", value: "video" },
          ],
        },
      ],
      hooks: {
        afterRead: [
          ({ doc }) => {
            // Only rewrite the URL when it's still pointing at Payload's
            // default /api/media/file/* endpoint. If a storage plugin
            // (e.g. Vercel Blob in production) has set an absolute URL,
            // leave it alone.
            if (!doc?.filename) return doc
            const current = typeof doc.url === "string" ? doc.url : ""
            const isRemote = /^https?:\/\//.test(current)
            if (isRemote) return doc
            doc.url = `/uploads/media/${doc.filename}`
            return doc
          },
        ],
      },
    },

    {
      slug: "ebooks",
      admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "price", "category", "isBestSeller", "updatedAt"],
        description:
          "Each ebook is a product. Shown in the homepage library grid and on /shop.",
      },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "subtitle", type: "text" },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          index: true,
        },
        {
          name: "category",
          type: "select",
          defaultValue: "sleep",
          options: [
            { label: "Sleep", value: "sleep" },
            { label: "Calm", value: "calm" },
            { label: "Energy", value: "energy" },
            { label: "Digestion", value: "digestion" },
            { label: "General", value: "general" },
          ],
        },
        { name: "price", type: "number", required: true, min: 0 },
        { name: "pages", type: "number" },
        {
          name: "shortDescription",
          type: "textarea",
          admin: { description: "One-paragraph blurb used on product cards." },
        },
        {
          name: "description",
          type: "richText",
          admin: { description: "Long form copy for the product page." },
        },
        { name: "cover", type: "upload", relationTo: "media" },
        {
          name: "gallery",
          type: "array",
          fields: [{ name: "image", type: "upload", relationTo: "media" }],
        },
        { name: "isBestSeller", type: "checkbox", defaultValue: false },
        { name: "publishedAt", type: "date" },
      ],
    },

    {
      slug: "testimonials",
      admin: { useAsTitle: "name", defaultColumns: ["name", "rating", "updatedAt"] },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "meta", type: "text", admin: { description: "e.g. 'Retired nurse, 71'" } },
        { name: "quote", type: "textarea", required: true },
        { name: "rating", type: "number", min: 1, max: 5, defaultValue: 5 },
      ],
    },

    {
      slug: "posts",
      admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "publishedAt", "updatedAt"],
        description: "Journal entries shown at /journal.",
      },
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          index: true,
        },
        { name: "excerpt", type: "textarea" },
        { name: "cover", type: "upload", relationTo: "media" },
        { name: "body", type: "richText" },
        { name: "publishedAt", type: "date" },
      ],
    },

    {
      slug: "pages",
      admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "slug", "updatedAt"],
        description:
          "Generic content pages (About, FAQs, Shipping, etc.). The slug becomes the URL.",
      },
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          index: true,
          admin: { description: "URL path, e.g. 'about', 'shipping', 'faq'." },
        },
        { name: "subtitle", type: "text" },
        { name: "cover", type: "upload", relationTo: "media" },
        { name: "body", type: "richText" },
      ],
    },
  ],

  globals: [
    {
      slug: "landing",
      label: "Landing Page",
      admin: { description: "All editable content on the homepage." },
      fields: [
        {
          type: "group",
          name: "hero",
          fields: [
            { name: "headlineTop", type: "text", required: true },
            { name: "headlineBottom", type: "text", required: true },
            { name: "subheadline", type: "textarea" },
            { name: "primaryCtaLabel", type: "text", defaultValue: "Browse the library" },
            { name: "primaryCtaHref", type: "text", defaultValue: "/shop" },
            { name: "secondaryCtaLabel", type: "text", defaultValue: "Sleep collection" },
            { name: "secondaryCtaHref", type: "text", defaultValue: "/sleep" },
            { name: "video", type: "upload", relationTo: "media" },
            {
              name: "stats",
              type: "array",
              maxRows: 3,
              fields: [
                { name: "figure", type: "text", required: true },
                { name: "caption", type: "text", required: true },
              ],
            },
          ],
        },
        {
          type: "group",
          name: "featured",
          fields: [
            { name: "eyebrow", type: "text", defaultValue: "The Library — 01" },
            { name: "headlineTop", type: "text" },
            { name: "headlineBottom", type: "text" },
            { name: "viewAllLabel", type: "text" },
          ],
        },
        {
          type: "group",
          name: "sleep",
          fields: [
            { name: "eyebrow", type: "text", defaultValue: "The Library — 02" },
            { name: "headlineTop", type: "text" },
            { name: "headlineBottom", type: "text" },
            { name: "body", type: "textarea" },
            { name: "image", type: "upload", relationTo: "media" },
            {
              name: "stat",
              type: "group",
              fields: [
                { name: "figure", type: "text" },
                { name: "caption", type: "text" },
              ],
            },
            {
              name: "bullets",
              type: "array",
              maxRows: 5,
              fields: [
                { name: "title", type: "text", required: true },
                { name: "text", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          type: "group",
          name: "rituals",
          fields: [
            { name: "eyebrow", type: "text", defaultValue: "The Practice — 03" },
            { name: "headlineTop", type: "text" },
            { name: "headlineBottom", type: "text" },
            { name: "intro", type: "textarea" },
            { name: "image", type: "upload", relationTo: "media" },
            {
              name: "steps",
              type: "array",
              maxRows: 6,
              fields: [
                { name: "number", type: "text", required: true },
                { name: "title", type: "text", required: true },
                { name: "text", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          type: "group",
          name: "marquee",
          fields: [
            {
              name: "phrases",
              type: "array",
              fields: [{ name: "text", type: "text", required: true }],
            },
          ],
        },
        {
          type: "group",
          name: "testimonials",
          fields: [
            { name: "eyebrow", type: "text", defaultValue: "Letters from readers — 04" },
            { name: "headlineTop", type: "text" },
            { name: "headlineBottom", type: "text" },
            { name: "averageRating", type: "text", defaultValue: "4.9" },
            { name: "reviewCount", type: "text", defaultValue: "2,100+" },
          ],
        },
      ],
    },

    {
      slug: "navigation",
      label: "Navigation & Footer",
      admin: { description: "Navbar links, footer columns and footer copy." },
      fields: [
        {
          name: "primary",
          type: "array",
          label: "Primary nav (header)",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "href", type: "text", required: true },
          ],
        },
        {
          type: "group",
          name: "footer",
          fields: [
            { name: "tagline", type: "textarea" },
            {
              name: "columns",
              type: "array",
              fields: [
                { name: "title", type: "text", required: true },
                {
                  name: "links",
                  type: "array",
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "href", type: "text", required: true },
                  ],
                },
              ],
            },
            {
              name: "legal",
              type: "array",
              fields: [
                { name: "label", type: "text", required: true },
                { name: "href", type: "text", required: true },
              ],
            },
            { name: "disclaimer", type: "textarea" },
          ],
        },
      ],
    },
  ],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "natura-dev-secret-change-me",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    // Auto-sync the schema on every boot, in dev AND prod. For this app the
    // schema is fully owned by payload.config.ts and we don't need formal
    // migration files. Without this, Vercel boots against an empty DB and
    // every query fails with "relation does not exist".
    push: true,
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      // Only enable when running on Vercel (or anywhere a token is set).
      // Locally with no token, files keep going to public/uploads/media.
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Browser uploads files directly to Vercel Blob using a signed URL,
      // skipping the serverless function entirely — no 4.5MB body limit.
      clientUploads: true,
    }),
  ],
  onInit: async (payload) => {
    await seedDefaults(payload)
  },
})
