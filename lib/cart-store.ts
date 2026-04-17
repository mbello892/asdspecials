"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

/**
 * Cart state — lives client-side in localStorage.
 * Items are only sent to WC when the user hits "Finalizar compra"
 * (via POST /api/orders/create, which resolves to a real WC order).
 */

export type CartItem = {
  productId: number
  name: string
  slug: string
  price: number
  image: string | null
  stock: number
  quantity: number
}

type CartState = {
  items: CartItem[]
  hydrated: boolean
  lastAddedAt: number | null
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQty: (productId: number, delta: number) => void
  setQty: (productId: number, quantity: number) => void
  syncItem: (productId: number, patch: Partial<CartItem>) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      lastAddedAt: null,
      addItem: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === item.productId)
        if (existing) {
          const nextQty = Math.min(existing.quantity + quantity, item.stock || Infinity)
          set({
            items: get().items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: nextQty } : i,
            ),
            lastAddedAt: Date.now(),
          })
          return
        }
        const qty = Math.min(quantity, item.stock || Infinity)
        if (qty <= 0) return
        set({
          items: [...get().items, { ...item, quantity: qty }],
          lastAddedAt: Date.now(),
        })
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      updateQty: (productId, delta) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? {
                  ...i,
                  quantity: Math.max(1, Math.min(i.quantity + delta, i.stock || Infinity)),
                }
              : i,
          ),
        }),
      setQty: (productId, quantity) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock || Infinity)) }
              : i,
          ),
        }),
      syncItem: (productId, patch) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, ...patch } : i,
          ),
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "asdspecials-cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true
      },
    },
  ),
)

// Selector helpers (avoid re-renders when unrelated state changes)
export const selectSubtotal = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

export const selectCount = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0)
