import * as React from "react"

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  format?: number | string
  children?: LexicalNode[]
  url?: string
  fields?: { url?: string }
  listType?: "bullet" | "number" | "check"
}

function isBold(format: number | string | undefined) {
  return typeof format === "number" && (format & 1) === 1
}
function isItalic(format: number | string | undefined) {
  return typeof format === "number" && (format & 2) === 2
}
function isUnderline(format: number | string | undefined) {
  return typeof format === "number" && (format & 8) === 8
}

function renderNode(node: LexicalNode, i: number): React.ReactNode {
  if (!node) return null

  if (node.type === "text") {
    let el: React.ReactNode = node.text
    if (isBold(node.format)) el = <strong key={i}>{el}</strong>
    if (isItalic(node.format)) el = <em key={i}>{el}</em>
    if (isUnderline(node.format)) el = <u key={i}>{el}</u>
    return el
  }

  const children = (node.children ?? []).map(renderNode)

  switch (node.type) {
    case "heading": {
      const Tag = (node.tag as "h1" | "h2" | "h3" | "h4" | "h5") ?? "h2"
      return (
        <Tag key={i} className="font-serif text-2xl tracking-tight sm:text-3xl">
          {children}
        </Tag>
      )
    }
    case "list":
      return node.listType === "number" ? (
        <ol key={i} className="ml-6 list-decimal space-y-2">
          {children}
        </ol>
      ) : (
        <ul key={i} className="ml-6 list-disc space-y-2">
          {children}
        </ul>
      )
    case "listitem":
      return <li key={i}>{children}</li>
    case "quote":
      return (
        <blockquote
          key={i}
          className="my-6 border-l-2 border-[color:var(--accent)] pl-5 font-serif text-xl leading-snug text-foreground/80"
        >
          {children}
        </blockquote>
      )
    case "link": {
      const url = node.fields?.url ?? node.url ?? "#"
      return (
        <a
          key={i}
          href={url}
          className="underline underline-offset-4 hover:text-[color:var(--primary)]"
        >
          {children}
        </a>
      )
    }
    case "paragraph":
    default:
      return (
        <p key={i} className="leading-[1.7]">
          {children}
        </p>
      )
  }
}

export function RichText({ content }: { content: unknown }) {
  if (!content || typeof content !== "object") return null
  const root = (content as { root?: LexicalNode }).root
  if (!root?.children) return null
  return (
    <div className="prose-anatomy space-y-5 text-[15px] text-foreground/85">
      {root.children.map(renderNode)}
    </div>
  )
}
