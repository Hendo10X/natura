import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"

// @ts-ignore: side-effect import for global CSS (no type declarations)
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Blue Hibiscus — Natural Remedies Ebooks for Restful Sleep",
  description:
    "A small library of natural remedy ebooks, with a focus on gentle sleep solutions for older adults.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", inter.variable, fraunces.variable)}
    >
      <body className="bg-background text-foreground">{children}</body>
    </html>
  )
}
