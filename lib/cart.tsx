"use client"

import * as React from "react"

export type CartItem = {
  slug: string
  polarProductId: string
  title: string
  price: number
  coverUrl?: string
  coverAlt?: string
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
}

type CartContextValue = CartState & {
  hydrated: boolean
  count: number
  subtotal: number
  isInCart: (slug: string) => boolean
  addItem: (item: CartItem, options?: { openDrawer?: boolean }) => void
  removeItem: (slug: string) => void
  clear: () => void
  openDrawer: () => void
  closeDrawer: () => void
  setOpen: (open: boolean) => void
}

const STORAGE_KEY = "blue-hibiscus-cart-v1"

const CartContext = React.createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])
  const [isOpen, setOpen] = React.useState(false)
  const [hydrated, setHydrated] = React.useState(false)

  // Hydrate from localStorage once on mount.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {
      // ignore — fresh cart
    }
    setHydrated(true)
  }, [])

  // Persist on every change (after hydration so we don't clobber storage on
  // first render).
  React.useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // quota / privacy mode — ignore silently
    }
  }, [items, hydrated])

  const addItem = React.useCallback(
    (item: CartItem, options: { openDrawer?: boolean } = {}) => {
      setItems((prev) => {
        if (prev.some((i) => i.slug === item.slug)) return prev
        return [...prev, item]
      })
      if (options.openDrawer !== false) setOpen(true)
    },
    []
  )

  const removeItem = React.useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug))
  }, [])

  const clear = React.useCallback(() => {
    setItems([])
  }, [])

  const openDrawer = React.useCallback(() => setOpen(true), [])
  const closeDrawer = React.useCallback(() => setOpen(false), [])

  const value = React.useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, i) => sum + (i.price ?? 0), 0)
    return {
      items,
      isOpen,
      hydrated,
      count: items.length,
      subtotal,
      isInCart: (slug) => items.some((i) => i.slug === slug),
      addItem,
      removeItem,
      clear,
      openDrawer,
      closeDrawer,
      setOpen,
    }
  }, [items, isOpen, hydrated, addItem, removeItem, clear, openDrawer, closeDrawer])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = React.useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>")
  }
  return ctx
}
