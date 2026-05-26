"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export type NavLink = { label: string; href: string }

export type NavbarProps = {
  links: NavLink[]
  variant?: "over-hero" | "solid"
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const

export function Navbar({ links, variant = "over-hero" }: NavbarProps) {
  const [open, setOpen] = React.useState(false)
  const overHero = variant === "over-hero"

  return (
    <header
      className={cn(
        overHero
          ? "absolute inset-x-0 top-0 z-50 text-white"
          : "sticky top-0 z-50 border-b border-border bg-background/90 text-foreground navbar-blur"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight sm:text-xl"
        >
          <span className="font-medium">Blue Hibiscus</span>
          <span className="ml-[1px] text-[color:var(--accent)]">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <DesktopLink
              key={link.href}
              href={link.href}
              label={link.label}
              overHero={overHero}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className={cn(
              "hidden h-9 w-9 items-center justify-center rounded-full md:flex",
              overHero
                ? "text-white/85 hover:bg-white/10 hover:text-white"
                : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
          <Link
            href="/shop"
            className={cn(
              "hidden items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium tracking-wide md:inline-flex",
              overHero
                ? "bg-white text-foreground hover:bg-[color:var(--accent)] hover:text-white"
                : "bg-foreground text-background hover:bg-[color:var(--primary)]"
            )}
          >
            <span>Cart</span>
            <span
              className={cn(
                "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px]",
                overHero ? "bg-foreground/10" : "bg-background/15"
              )}
            >
              0
            </span>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label="Open menu"
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden",
                    overHero
                      ? "text-white hover:bg-white/10"
                      : "text-foreground hover:bg-foreground/5"
                  )}
                />
              }
            >
              <Hamburger open={open} />
            </SheetTrigger>

            <SheetContent
              side="top"
              showCloseButton={false}
              className="h-auto border-b border-border bg-background text-foreground"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Browse Blue Hibiscus ebooks
              </SheetDescription>

              <div className="flex items-center justify-between px-6 pt-5 pb-2">
                <span className="font-serif text-lg tracking-tight">
                  <span className="font-medium">Blue Hibiscus</span>
                  <span className="ml-[1px] text-[color:var(--accent)]">.</span>
                </span>
                <SheetClose
                  render={
                    <button
                      type="button"
                      aria-label="Close menu"
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
              </div>

              <motion.nav
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
                  },
                }}
                className="flex flex-col px-6 py-6"
              >
                {links.map((link) => (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, y: -10 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.28, ease: EASE_OUT },
                      },
                    }}
                  >
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href={link.href}
                          className="group block border-b border-border py-5"
                        />
                      }
                    >
                      <MobileLinkLabel label={link.label} />
                    </SheetClose>
                  </motion.div>
                ))}

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: -10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.32, ease: EASE_OUT },
                    },
                  }}
                  className="mt-8 flex items-center gap-3"
                >
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        href="/shop"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors duration-200 [transition-timing-function:var(--ease-out)] hover:bg-[color:var(--primary)]"
                      />
                    }
                  >
                    Browse the library
                  </SheetClose>
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        href="/shop"
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-200 [transition-timing-function:var(--ease-out)] hover:bg-foreground/5"
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
                      <path
                        d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="9" cy="21" r="1.4" />
                      <circle cx="18" cy="21" r="1.4" />
                    </svg>
                  </SheetClose>
                </motion.div>
              </motion.nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function DesktopLink({
  href,
  label,
  overHero,
}: {
  href: string
  label: string
  overHero: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative text-[13px] tracking-wide",
        overHero
          ? "text-white/85 hover:text-white"
          : "text-foreground/80 hover:text-foreground"
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-hover:scale-x-100",
          overHero ? "bg-white" : "bg-foreground"
        )}
      />
    </Link>
  )
}

function MobileLinkLabel({ label }: { label: string }) {
  return (
    <span className="flex w-full items-center justify-between">
      <span className="relative inline-block overflow-hidden font-serif text-3xl leading-none tracking-tight text-foreground">
        <span className="block transition-transform duration-[420ms] [transition-timing-function:var(--ease-out)] group-hover:-translate-y-full">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full text-[color:var(--primary)] transition-transform duration-[420ms] [transition-timing-function:var(--ease-out)] group-hover:translate-y-0"
        >
          {label}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-hover:translate-x-1 group-hover:text-foreground"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" />
        </svg>
      </span>
    </span>
  )
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-3 w-5">
      <span
        className={cn(
          "absolute left-0 right-0 h-px bg-current transition-transform duration-[280ms] [transition-timing-function:var(--ease-out)]",
          open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
        )}
      />
      <span
        className={cn(
          "absolute left-0 right-0 h-px bg-current transition-transform duration-[280ms] [transition-timing-function:var(--ease-out)]",
          open ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0"
        )}
      />
    </span>
  )
}
