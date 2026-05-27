import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"

// @ts-ignore: side-effect import for global CSS (no type declarations)
import "./globals.css"
import { cn } from "@/lib/utils"
import { CartProvider } from "@/lib/cart"
import { CartDrawer } from "@/components/site/cart-drawer"

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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Blue Hibiscus — Natural Remedies Ebooks for Restful Sleep",
    template: "%s · Blue Hibiscus",
  },
  description:
    "A small library of natural remedy ebooks, with a focus on gentle sleep solutions for older adults.",
  applicationName: "Blue Hibiscus",
  keywords: [
    "natural remedies",
    "herbal ebooks",
    "sleep",
    "older adults",
    "lavender",
    "chamomile",
  ],
  authors: [{ name: "Blue Hibiscus Editions" }],
  openGraph: {
    type: "website",
    siteName: "Blue Hibiscus",
    title: "Blue Hibiscus — Natural Remedies Ebooks for Restful Sleep",
    description:
      "A small library of natural remedy ebooks, with a focus on gentle sleep solutions for older adults.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Blue Hibiscus",
    description:
      "A small library of natural remedy ebooks, with a focus on gentle sleep solutions for older adults.",
  },
  robots: { index: true, follow: true },
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
      <body className="bg-background text-foreground">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
