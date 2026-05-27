import { type SchemaTypeDefinition } from "sanity"
import { ebook } from "./ebook"
import { landing } from "./landing"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [ebook, landing],
}
