"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Search, ShoppingCart, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { categories, searchProducts, type Product } from "@/lib/catalog";
import { useCartStore, cn } from "@/lib/store";
import { formatBRL } from "@/lib/catalog";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { getItemCount, openCart, cep, address, setCep, setAddress, favorites } = useCartStore();
  const cartCount = getItemCount();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setSearchResults(searchProducts(searchQuery).slice(0, 6));
  }, [searchQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#e11d48] text-center text-xs font-medium text-white py-1.5 px-4">
        🚚 Frete grátis acima de R$ 200 · 📱 Baixe o app VendaMais · ⚡ PIX com 5% de desconto
      </div>

      <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white shadow-sm">
        {/* Top row: logo, CEP, search, actions */}
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:gap-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#0f172a] hover:bg-[#f8fafc] lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="VendaMais - Início">
            <span className="text-2xl font-black tracking-tight text-[#e11d48]">Venda</span>
            <span className="text-2xl font-black tracking-tight text-[#16a34a]">Mais</span>
          </Link>

          {/* CEP / Endereço */}
          <button
            className="hidden md:flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm hover:border-[#cbd5e1] transition-colors flex-shrink-0"
            onClick={() => {
              const c = prompt("Digite seu CEP (apenas números):", cep);
              if (c) setCep(c);
            }}
            aria-label="Definir endereço de entrega"
          >
            <MapPin className="h-4 w-4 text-[#e11d48]" />
            <div className="text-left">
              <p className="text-[10px] text-[#94a3b8] leading-none">Entregar em:</p>
              <p className="text-xs font-semibold text-[#0f172a] leading-tight">
                {cep ? `CEP ${cep}` : "Definir CEP"}
              </p>
            </div>
          </button>

          {/* Search */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94a3b8]" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                placeholder="Buscar no VendaMais..."
                aria-label="Buscar produtos"
                className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-2.5 pl-10 pr-4 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#e11d48] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]/20 transition-all"
              />
            </div>
            {/* Autocomplete dropdown */}
            {searchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-96 overflow-y-auto rounded-xl border border-[#e2e8f0] bg-white shadow-xl z-50">
                {searchResults.length > 0 ? (
                  searchResults.map((p) => (
                    <Link
                      key={p.id}
                      href={`/produto/${p.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f8fafc] transition-colors"
                      onClick={() => { setSearchQuery(""); setSearchFocused(false); }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#0f172a]">{p.name}</p>
                        <p className="text-xs text-[#94a3b8]">{p.brand} · {p.unitPrice}</p>
                      </div>
                      <span className="text-sm font-bold text-[#e11d48]">{formatBRL(p.price)}</span>
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-6 text-center text-sm text-[#94a3b8]">
                    Nenhum produto encontrado para &quot;{searchQuery}&quot;
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
            <Link
              href="/favoritos"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-[#0f172a] hover:bg-[#f8fafc] transition-colors"
              aria-label={`Favoritos (${favorites.length})`}
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e11d48] px-1 text-[10px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              href="/conta"
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg text-[#0f172a] hover:bg-[#f8fafc] transition-colors"
              aria-label="Minha conta"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={openCart}
              className="relative flex h-10 items-center gap-2 rounded-lg bg-[#16a34a] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#15803d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
              aria-label={`Carrinho (${cartCount} itens)`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e11d48] px-1.5 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category nav (desktop) */}
        <nav className="hidden lg:block border-t border-[#e2e8f0] bg-white" aria-label="Categorias">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-8 overflow-x-auto no-scrollbar">
            <Link
              href="/ofertas"
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-sm font-semibold transition-colors hover:text-[#e11d48]",
                isActive("/ofertas") ? "text-[#e11d48]" : "text-[#0f172a]"
              )}
            >
              🔥 Ofertas
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors hover:text-[#e11d48]",
                  isActive(`/categoria/${cat.slug}`) ? "text-[#e11d48]" : "text-[#475569]"
                )}
              >
                <span aria-hidden="true">{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 top-[calc(2.25rem+4rem)] z-40 bg-white overflow-y-auto">
            <nav className="flex flex-col p-4 gap-1" aria-label="Navegação mobile">
              <Link href="/ofertas" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold text-[#e11d48] hover:bg-[#fef9f0]">
                🔥 Ofertas
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.slug}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-[#0f172a] hover:bg-[#f8fafc]"
                >
                  <span className="text-xl" aria-hidden="true">{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
              <hr className="my-2 border-[#e2e8f0]" />
              <Link href="/conta" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-[#0f172a] hover:bg-[#f8fafc]">
                <User className="h-5 w-5" /> Minha conta
              </Link>
              <Link href="/favoritos" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-[#0f172a] hover:bg-[#f8fafc]">
                <Heart className="h-5 w-5" /> Favoritos ({favorites.length})
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
