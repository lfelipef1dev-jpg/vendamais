"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, Truck, Tag } from "lucide-react";
import { useCartStore, cn } from "@/lib/store";
import { formatBRL } from "@/lib/catalog";

export function CartDrawer() {
  const {
    items, isCartOpen, closeCart,
    updateQuantity, removeFromCart, clearCart,
    getSubtotal, getSavings, getItemCount,
  } = useCartStore();

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const itemCount = getItemCount();
  const subtotal = getSubtotal();
  const savings = getSavings();
  const freeShippingThreshold = 200;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // ESC + scroll lock + focus
  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Carrinho de compras">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity vm-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col vm-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-4 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#e11d48]" />
            <h2 className="text-lg font-bold text-[#0f172a]">
              Carrinho {itemCount > 0 && <span className="text-[#94a3b8] font-normal">({itemCount})</span>}
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#475569] hover:bg-[#f8fafc] focus-visible:outline-2 focus-visible:outline-[#e11d48]"
            aria-label="Fechar carrinho"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f8fafc]">
              <ShoppingBag className="h-10 w-10 text-[#94a3b8]" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#0f172a]">Seu carrinho está vazio</h3>
            <p className="mt-1 text-sm text-[#94a3b8]">
              Adicione produtos e aproveite nossas ofertas.
            </p>
            <Link
              href="/ofertas"
              onClick={closeCart}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#e11d48] px-6 text-sm font-bold text-white hover:bg-[#be123c] transition-colors"
            >
              <Tag className="h-4 w-4" /> Ver ofertas
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b border-[#e2e8f0] bg-[#fef9f0] px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-[#16a34a]" />
                {remaining > 0 ? (
                  <span className="text-[#475569]">
                    Faltam <strong className="text-[#0f172a]">{formatBRL(remaining)}</strong> para frete grátis
                  </span>
                ) : (
                  <span className="font-semibold text-[#16a34a]">Você ganhou frete grátis! 🎉</span>
                )}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e2e8f0]">
                <div
                  className="h-full rounded-full bg-[#16a34a] transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <ul className="space-y-3" role="list">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-3 rounded-xl border border-[#e2e8f0] p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-[#94a3b8]">{item.product.brand}</p>
                          <h4 className="truncate text-sm font-semibold text-[#0f172a]">{item.product.name}</h4>
                          <p className="text-xs text-[#94a3b8]">{item.product.weight}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[#94a3b8] hover:bg-[#fef2f2] hover:text-[#e11d48] focus-visible:outline-2 focus-visible:outline-[#e11d48]"
                          aria-label={`Remover ${item.product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-[#e2e8f0]">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-[#0f172a] hover:bg-[#f8fafc] focus-visible:outline-2 focus-visible:outline-[#e11d48]"
                            aria-label="Diminuir"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold" aria-live="polite">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-[#0f172a] hover:bg-[#f8fafc] focus-visible:outline-2 focus-visible:outline-[#e11d48]"
                            aria-label="Aumentar"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#0f172a]">
                            {formatBRL(item.product.price * item.quantity)}
                          </p>
                          {item.product.previousPrice && (
                            <p className="text-xs text-[#94a3b8] line-through">
                              {formatBRL(item.product.previousPrice * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Clear cart */}
              <button
                onClick={clearCart}
                className="mt-4 w-full rounded-lg border border-[#e2e8f0] py-2 text-xs font-medium text-[#94a3b8] hover:bg-[#f8fafc] hover:text-[#e11d48] transition-colors"
              >
                Esvaziar carrinho
              </button>
            </div>

            {/* Footer */}
            <div className="border-t border-[#e2e8f0] bg-white px-4 py-4 space-y-3">
              {savings > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#16a34a] font-medium">Você economiza</span>
                  <span className="font-bold text-[#16a34a]">{formatBRL(savings)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-[#0f172a]">Subtotal</span>
                <span className="text-xl font-black text-[#0f172a]">{formatBRL(subtotal)}</span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                Ou em até 12x de {formatBRL(subtotal / 12)} sem juros
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#16a34a] text-base font-bold text-white transition-colors hover:bg-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
              >
                Finalizar compra
              </Link>
              <button
                onClick={closeCart}
                className="w-full rounded-lg py-2 text-sm font-medium text-[#475569] hover:text-[#0f172a] transition-colors"
              >
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
