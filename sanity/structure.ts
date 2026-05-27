import type { StructureResolver } from "sanity/structure"

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singleton — only one Landing Page document
      S.listItem()
        .title("Landing Page")
        .id("landing")
        .child(
          S.document()
            .schemaType("landing")
            .documentId("landing")
            .title("Landing Page")
        ),
      S.divider(),
      // Regular collections (ebook, etc.) — exclude landing so it doesn't appear twice
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "landing"
      ),
    ])
