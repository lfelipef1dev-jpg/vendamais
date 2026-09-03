"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { useCartStore, cn } from "@/lib/store";

export function ProductActions({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, isFavorite, items } = useCartStore();
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const fav = isFavorite(product.id);
  const cartItem = items.find((i) => i.product.id === product.id);
  const outOfStock = product.stock === 0;

  const handleAdd = () => {
    if (outOfStock) return;
    setLoading(true);
    addToCart(product, qty);
    setTimeout(() => setLoading(false), 400);
  };

  return (
    <div className="mt-4 space-y-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[#0f172a]">Quantidade:</span>
        <div className="flex items-center rounded-lg border border-[#e2e8f0]">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="flex h-10 w-10 items-center justify-center text-[#0f172a] hover:bg-[#f8fafc] focus-visible:outline-2 focus-visible:outline-[#e11d48]"
            aria-label="Diminuir quantidade"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center font-bold" aria-live="polite">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="flex h-10 w-10 items-center justify-center text-[#0f172a] hover:bg-[#f8fafc] focus-visible:outline-2 focus-visible:outline-[#e11d48]"
            aria-label="Aumentar quantidade"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          disabled={loading || outOfStock}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#e11d48] text-base font-bold text-white transition-colors hover:bg-[#be123c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d48] disabled:opacity-50"
        >
          {loading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : outOfStock ? (
            "Indisponível"
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" /> Adicionar ao carrinho
            </>
          )}
        </button>
        <button
          onClick={() => toggleFavorite(product.id)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d48]",
            fav ? "border-[#e11d48] bg-[#fef2f2]" : "border-[#e2e8f0] hover:border-[#e11d48]"
          )}
          aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={fav}
        >
          <Heart className={cn("h-5 w-5", fav ? "fill-[#e11d48] text-[#e11d48]" : "text-[#94a3b8]")} />
        </button>
      </div>

      {cartItem && (
        <p className="text-sm text-[#16a34a] font-medium" aria-live="polite">
          ✓ {cartItem.quantity} no carrinho
        </p>
      )}
    </div>
  );
}
