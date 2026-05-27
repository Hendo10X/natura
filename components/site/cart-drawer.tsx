"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import { useCart } from "@/lib/cart"

const EASE_OUT = [0.22, 1, 0.36, 1] as const

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, subtotal, hydrated } = useCart()

  const checkoutHref =
    items.length > 0
      ? `/api/checkout?${items
          .map((i) => `products=${encodeURIComponent(i.polarProductId)}`)
          .join("&")}`
      : "#"

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex h-full w-full flex-col bg-background text-foreground sm:max-w-md"
      >
        <SheetTitle className="sr-only">Cart</SheetTitle>
        <SheetDescription className="sr-only">
          Your selected ebooks. Continue to Polar to check out.
        </SheetDescription>

        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-lg tracking-tight">Cart</span>
            <span className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
              {hydrated
                ? `${items.length} ${items.length === 1 ? "item" : "items"}`
                : ""}
            </span>
          </div>
          <SheetClose
            render={
              <button
                type="button"
                aria-label="Close cart"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-foreground/5"
              />
            }
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </SheetClose>
        </header>

        <div className="flex-1 overflow-y-auto">
          {!hydrated ? null : items.length === 0 ? (
            <EmptyCart />
          ) : (
            <ul className="divide-y divide-border px-6">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.slug}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.24, ease: EASE_OUT },
                    }}
                    exit={{
                      opacity: 0,
                      x: 24,
                      transition: { duration: 0.2, ease: EASE_OUT },
                    }}
                    className="flex items-start gap-4 py-5"
                  >
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="relative aspect-3/4 w-16 shrink-0 overflow-hidden rounded-md bg-secondary/40"
                    >
                      {item.coverUrl ? (
                        <Image
                          src={item.coverUrl}
                          alt={item.coverAlt ?? item.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : null}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="font-serif text-base leading-tight hover:text-[color:var(--primary)]"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-1 text-xs tracking-wide text-muted-foreground">
                        Digital ebook
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="font-serif text-base">
                          ${item.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.slug)}
                          className="text-[11px] tracking-wide uppercase text-muted-foreground hover:text-foreground"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {hydrated && items.length > 0 ? (
          <footer className="border-t border-border bg-background px-6 py-6">
            <div className="flex items-baseline justify-between">
              <span className="text-sm tracking-wide text-muted-foreground">
                Subtotal
              </span>
              <span className="font-serif text-2xl">${subtotal}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Taxes calculated by Polar at checkout. Digital delivery, no
              shipping.
            </p>
            <a
              href={checkoutHref}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[color:var(--primary)]"
            >
              Checkout
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex w-full items-center justify-center text-xs tracking-wide uppercase text-muted-foreground hover:text-foreground"
            >
              Continue shopping
            </button>
          </footer>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function EmptyCart() {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-5 px-6 py-16">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground/60">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="21" r="1.4" />
          <circle cx="18" cy="21" r="1.4" />
        </svg>
      </div>
      <div>
        <p className="font-serif text-2xl leading-tight">Your cart is quiet.</p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Add an ebook from the library and it will rest here until you’re
          ready to check out.
        </p>
      </div>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[color:var(--primary)]"
      >
        Browse the library
      </Link>
    </div>
  )
}
