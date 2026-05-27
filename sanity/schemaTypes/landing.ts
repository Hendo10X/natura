import { defineField, defineType } from "sanity"

/**
 * Singleton document — only one of these exists. Holds the CMS-editable
 * pieces of the homepage (everything else is hard-coded in lib/content.ts).
 */
export const landing = defineType({
  name: "landing",
  title: "Landing Page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      type: "object",
      fields: [
        defineField({ name: "headlineTop", type: "string", initialValue: "Sleep softer." }),
        defineField({
          name: "headlineBottom",
          type: "string",
          initialValue: "Wake gentler.",
        }),
        defineField({ name: "subheadline", type: "text", rows: 3 }),
        defineField({
          name: "video",
          type: "file",
          options: { accept: "video/mp4" },
          description: "Background video for the hero section.",
        }),
      ],
    }),
    defineField({
      name: "sleepSection",
      title: "Sleep section",
      type: "object",
      fields: [
        defineField({ name: "headlineTop", type: "string" }),
        defineField({ name: "headlineBottom", type: "string" }),
        defineField({ name: "body", type: "text", rows: 4 }),
        defineField({
          name: "image",
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Alt text" }],
        }),
        defineField({ name: "statFigure", type: "string" }),
        defineField({ name: "statCaption", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Landing Page" }),
  },
})
