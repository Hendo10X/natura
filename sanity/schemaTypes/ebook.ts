import { defineField, defineType } from "sanity"

export const ebook = defineType({
  name: "ebook",
  title: "Ebook",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "subtitle", type: "string" }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "Sleep", value: "sleep" },
          { title: "Calm", value: "calm" },
          { title: "Energy", value: "energy" },
          { title: "Digestion", value: "digestion" },
          { title: "General", value: "general" },
        ],
        layout: "radio",
      },
      initialValue: "sleep",
    }),
    defineField({
      name: "price",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({ name: "pages", type: "number" }),
    defineField({ name: "isBestSeller", title: "Best seller", type: "boolean", initialValue: false }),
    defineField({
      name: "cover",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "shortDescription",
      type: "text",
      rows: 3,
      description: "One-paragraph blurb used on product cards.",
    }),
    defineField({
      name: "longDescription",
      title: "Long description",
      type: "array",
      of: [{ type: "block" }],
      description: "Full product page copy.",
    }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({
      name: "polarProductId",
      title: "Polar product ID",
      type: "string",
      description:
        "The product ID from polar.sh. Without this the Buy button is disabled.",
    }),
  ],
  orderings: [
    {
      title: "Best sellers first",
      name: "bestFirst",
      by: [
        { field: "isBestSeller", direction: "desc" },
        { field: "publishedAt", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "cover" },
  },
})
