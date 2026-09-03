"use client";

import { useState } from "react";
import { Heart, Plus, Minus, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { formatBRL, calcDiscount } from "@/lib/catalog";
import { useCartStore, cn } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, isFavorite, items, updateQuantity } = useCartStore();
  const [loading, setLoading] = useState(false);
  const fav = isFavorite(product.id);
  const cartItem = items.find((i) => i.product.id === product.id);
  const discount = calcDiscount(product.price, product.previousPrice);
  const outOfStock = product.stock === 0;

  const handleAdd = () => {
    if (outOfStock) return;
    setLoading(true);
    addToCart(product, 1);
    setTimeout(() => setLoading(false), 400);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-[#e2e8f0] bg-white transition-all hover:shadow-lg hover:border-[#cbd5e1] focus-within:shadow-lg">
      {/* Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {discount > 0 && (
          <span className="rounded-md bg-[#e11d48] px-2 py-0.5 text-xs font-bold text-white shadow-sm">
            -{discount}%
          </span>
        )}
        {product.byWeight && (
          <span className="rounded-md bg-[#f59e0b] px-2 py-0.5 text-xs font-bold text-white shadow-sm">
            Por kg
          </span>
        )}
      </div>

      {/* Favoritar */}
      <button
        onClick={() => toggleFavorite(product.id)}
        className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d48]"
        aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={fav}
      >
        <Heart
          className={cn("h-5 w-5 transition-colors", fav ? "fill-[#e11d48] text-[#e11d48]" : "text-[#94a3b8]")}
          aria-hidden="true"
        />
      </button>

      {/* Imagem */}
      <div className="relative aspect-square overflow-hidden bg-[#f8fafc]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className={cn(
            "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
            outOfStock && "opacity-50 grayscale"
          )}
        />
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-md bg-[#0f172a]/80 px-3 py-1 text-sm font-semibold text-white">
              Indisponível
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-3">
        <p className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[#0f172a] leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Peso / tipo de venda */}
        <p className="mt-1 text-xs text-[#94a3b8]">{product.weight}</p>

        {/* Preço */}
        {product.previousPrice && (
          <p className="mt-2 text-xs text-[#94a3b8] line-through">{formatBRL(product.previousPrice)}</p>
        )}
        <div className="flex items-baseline gap-1">
          <span className={cn("text-lg font-bold", discount > 0 ? "text-[#e11d48]" : "text-[#0f172a]")}>
            {formatBRL(product.price)}
          </span>
        </div>
        {/* Preço por kg — separado do preço total */}
        {product.byWeight && product.pricePerKg ? (
          <p className="text-xs text-[#16a34a] font-medium">
            Preço por kg: {formatBRL(product.pricePerKg)}
          </p>
        ) : (
          <p className="text-xs text-[#475569] font-medium">{product.unitPrice}</p>
        )}

        {/* Controles */}
        <div className="mt-3 flex-1" />

        {cartItem ? (
          <div className="flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-1">
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#0f172a] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-[#e11d48]"
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="text-sm font-bold text-[#0f172a]" aria-live="polite">
              {cartItem.quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#0f172a] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-[#e11d48]"
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={outOfStock || loading}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#e11d48] text-sm font-semibold text-white transition-colors hover:bg-[#be123c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d48] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                Adicionar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
