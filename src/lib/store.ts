"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./catalog";

export type CartItem = {
  product: Product;
  quantity: number;
  observation?: string;
};

type CartState = {
  items: CartItem[];
  favorites: string[];
  cep: string;
  address: string;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setObservation: (productId: string, obs: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  setCep: (cep: string) => void;
  setAddress: (address: string) => void;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  getSubtotal: () => number;
  getSavings: () => number;
  getItemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      favorites: [],
      cep: "",
      address: "",
      isCartOpen: false,
      isSearchOpen: false,

      addToCart: (product, quantity = 1) => {
        set((s) => {
          const existing = s.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
              isCartOpen: true,
            };
          }
          return { items: [...s.items, { product, quantity }], isCartOpen: true };
        });
      },

      removeFromCart: (productId) => {
        set((s) => ({ items: s.items.filter((i) => i.product.id !== productId) }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      setObservation: (productId, obs) => {
        set((s) => ({
          items: s.items.map((i) =>
            i.product.id === productId ? { ...i, observation: obs } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleFavorite: (productId) => {
        set((s) => ({
          favorites: s.favorites.includes(productId)
            ? s.favorites.filter((f) => f !== productId)
            : [...s.favorites, productId],
        }));
      },

      isFavorite: (productId) => get().favorites.includes(productId),

      setCep: (cep) => set({ cep }),
      setAddress: (address) => set({ address }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),

      getSubtotal: () => {
        return get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      },

      getSavings: () => {
        return get().items.reduce((sum, i) => {
          const prev = i.product.previousPrice ?? i.product.price;
          return sum + (prev - i.product.price) * i.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    { name: "vendamais-cart" }
  )
);

export function cn(...inputs: (string | undefined | false | null)[]) {
  return inputs.filter(Boolean).join(" ");
}
