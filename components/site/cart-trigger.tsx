"use client"

import { useCart } from "@/lib/cart"
import { cn } from "@/lib/utils"

export function CartTrigger({
  variant = "over-hero",
  className,
}: {
  variant?: "over-hero" | "solid"
  className?: string
}) {
  const { count, openDrawer, hydrated } = useCart()
  const overHero = variant === "over-hero"

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label="Open cart"
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium tracking-wide",
        overHero
          ? "bg-white text-foreground hover:bg-[color:var(--accent)] hover:text-white"
          : "bg-foreground text-background hover:bg-[color:var(--primary)]",
        className
      )}
    >
      <span>Cart</span>
      <span
        className={cn(
          "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] tabular-nums",
          overHero ? "bg-foreground/10" : "bg-background/15"
        )}
      >
        {hydrated ? count : 0}
      </span>
    </button>
  )
}
