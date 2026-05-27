"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { useCart } from "@/lib/cart"
import { cn } from "@/lib/utils"

const EASE_OUT = [0.22, 1, 0.36, 1] as const

export type AddToCartButtonProps = {
  slug: string
  polarProductId?: string
  title: string
  price: number
  coverUrl?: string
  coverAlt?: string
  className?: string
}

export function AddToCartButton({
  slug,
  polarProductId,
  title,
  price,
  coverUrl,
  coverAlt,
  className,
}: AddToCartButtonProps) {
  const { addItem, isInCart, openDrawer, hydrated } = useCart()
  const inCart = hydrated && isInCart(slug)

  // No Polar product wired in Sanity — disable instead of breaking checkout later.
  if (!polarProductId) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-dashed border-border px-6 py-3 text-sm font-medium text-muted-foreground",
          className
        )}
        title="Not yet available for purchase."
      >
        Coming soon
      </span>
    )
  }

  if (inCart) {
    return (
      <button
        type="button"
        onClick={openDrawer}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-foreground bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background",
          className
        )}
      >
        <Check />
        In cart — view
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() =>
        addItem(
          { slug, polarProductId, title, price, coverUrl, coverAlt },
          { openDrawer: true }
        )
      }
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-foreground bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background",
        className
      )}
    >
      <span className="relative inline-block h-4 w-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key="plus"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </motion.span>
        </AnimatePresence>
      </span>
      Add to cart
    </button>
  )
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m4 12 5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
