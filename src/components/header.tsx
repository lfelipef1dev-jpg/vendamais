"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Search, ShoppingCart, Heart, User, Menu, X, ChevronRight, Clock } from "lucide-react";
import { categories, searchProducts, popularSearches, type Product } from "@/lib/catalog";
import { useCartStore, cn } from "@/lib/store";
import { formatBRL } from "@/lib/catalog";
import { CategoryIcon } from "./category-icon";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [cepModalOpen, setCepModalOpen] = useState(false);
  const [cepInput, setCepInput] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const { getItemCount, openCart, cep, setCep, favorites } = useCartStore();
  const cartCount = getItemCount();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setSearchResults(searchProducts(searchQuery).slice(0, 8));
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

  useEffect(() => {
    if (!cepModalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setCepModalOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [cepModalOpen]);

  const isActive = (href: string) => pathname === href;
  const showPopular = searchFocused && !searchQuery.trim();

  const handleCepSubmit = () => {
    const clean = cepInput.replace(/\D/g, "");
    if (clean.length === 8) {
      setCep(clean);
      setCepModalOpen(false);
    }
  };

  return (
    <>
      {/* Announcement bar — sem claims operacionais falsos */}
      <div className="bg-[#0f172a] text-center text-xs font-medium text-white py-1.5 px-4">
        <Clock className="inline h-3 w-3 mr-1 -mt-0.5" aria-hidden="true" />
        Receba em casa ou retire na loja · Programa de fidelidade Venda+
      </div>

      <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white shadow-sm">
        {/* Top row */}
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 lg:gap-4 lg:px-8">
          {/* Mobile menu */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#0f172a] hover:bg-[#f8fafc] lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 flex-shrink-0" aria-label="VendaMais — Início">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-header.webp"
              alt="VendaMais"
              width={120}
              height={40}
              className="h-8 w-auto sm:h-9"
            />
          </Link>

          {/* CEP — protagonista */}
          <button
            className="hidden md:flex items-center gap-2 rounded-lg border-2 border-[#e2e8f0] px-3 py-2 text-sm hover:border-[#e11d48] transition-colors flex-shrink-0 min-w-[180px]"
            onClick={() => { setCepInput(cep); setCepModalOpen(true); }}
            aria-label="Definir endereço de entrega"
          >
            <MapPin className="h-5 w-5 text-[#e11d48] flex-shrink-0" />
            <div className="text-left overflow-hidden">
              <p className="text-[10px] text-[#94a3b8] leading-none uppercase tracking-wide">Entregar em</p>
              <p className="text-xs font-bold text-[#0f172a] leading-tight truncate">
                {cep ? `CEP ${cep.slice(0,5)}-${cep.slice(5)}` : "Definir CEP"}
              </p>
            </div>
          </button>

          {/* Search — protagonista */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94a3b8]" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                placeholder="O que você precisa hoje?"
                aria-label="Buscar produtos"
                className="w-full rounded-xl border-2 border-[#e2e8f0] bg-[#f8fafc] py-2.5 pl-10 pr-4 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#e11d48] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e11d48]/20 transition-all"
              />
            </div>
            {/* Dropdown */}
            {searchFocused && (searchQuery.trim() || showPopular) && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-[28rem] overflow-y-auto rounded-xl border border-[#e2e8f0] bg-white shadow-2xl z-50">
                {/* Buscas populares */}
                {showPopular && (
                  <div className="p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#94a3b8] mb-2">Buscas populares</p>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="rounded-full bg-[#f8fafc] px-3 py-1.5 text-sm text-[#475569] hover:bg-[#fef9f0] hover:text-[#e11d48] transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#94a3b8] mb-2">Categorias</p>
                    <div className="grid grid-cols-2 gap-1">
                      {categories.slice(0, 6).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/categoria/${cat.slug}`}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[#475569] hover:bg-[#f8fafc] transition-colors"
                          onClick={() => setSearchFocused(false)}
                        >
                          <CategoryIcon name={cat.iconName} className="h-4 w-4 text-[#94a3b8]" />
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {/* Resultados */}
                {searchQuery.trim() && searchResults.length > 0 && (
                  <ul role="listbox" aria-label="Resultados da busca">
                    {searchResults.map((p) => (
                      <li key={p.id} role="option" aria-selected="false">
                        <Link
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
                      </li>
                    ))}
                  </ul>
                )}
                {searchQuery.trim() && searchResults.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-[#94a3b8]">Nenhum produto encontrado para &quot;{searchQuery}&quot;</p>
                    <Link href={`/busca?q=${encodeURIComponent(searchQuery)}`} className="mt-2 inline-block text-sm font-semibold text-[#e11d48] hover:underline">
                      Ver todos os resultados
                    </Link>
                  </div>
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

        {/* Category nav (desktop) — SVG icons */}
        <nav className="hidden lg:block border-t border-[#e2e8f0] bg-white" aria-label="Categorias">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-8 overflow-x-auto no-scrollbar">
            <Link
              href="/ofertas"
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-sm font-bold transition-colors hover:text-[#e11d48]",
                isActive("/ofertas") ? "text-[#e11d48]" : "text-[#e11d48]"
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
                <CategoryIcon name={cat.iconName} className="h-4 w-4" />
                {cat.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 top-[calc(1.75rem+4rem)] z-40 bg-white overflow-y-auto">
            {/* CEP mobile */}
            <button
              className="flex items-center gap-3 w-full border-b border-[#e2e8f0] px-4 py-3"
              onClick={() => { setMobileOpen(false); setCepInput(cep); setCepModalOpen(true); }}
            >
              <MapPin className="h-5 w-5 text-[#e11d48]" />
              <div className="text-left">
                <p className="text-[10px] text-[#94a3b8] uppercase">Entregar em</p>
                <p className="text-sm font-bold text-[#0f172a]">{cep ? `CEP ${cep.slice(0,5)}-${cep.slice(5)}` : "Definir CEP"}</p>
              </div>
            </button>
            <nav className="flex flex-col p-4 gap-1" aria-label="Navegação mobile">
              <Link href="/ofertas" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-bold text-[#e11d48] hover:bg-[#fef9f0]">
                🔥 Ofertas
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.slug}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-[#0f172a] hover:bg-[#f8fafc]"
                >
                  <CategoryIcon name={cat.iconName} className="h-5 w-5 text-[#475569]" />
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

      {/* CEP Modal */}
      {cepModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Definir endereço de entrega">
          <div className="absolute inset-0 bg-black/50 vm-fade-in" onClick={() => setCepModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl vm-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fef2f2]">
                <MapPin className="h-6 w-6 text-[#e11d48]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0f172a]">Onde você está?</h2>
                <p className="text-sm text-[#94a3b8]">Informe seu CEP para ver disponibilidade e prazos</p>
              </div>
            </div>
            <input
              type="text"
              value={cepInput}
              onChange={(e) => setCepInput(e.target.value.replace(/\D/g, "").slice(0, 8))}
              onKeyDown={(e) => e.key === "Enter" && handleCepSubmit()}
              placeholder="00000-000"
              autoFocus
              aria-label="CEP"
              className="w-full rounded-xl border-2 border-[#e2e8f0] px-4 py-3 text-base focus:border-[#e11d48] focus:outline-none focus:ring-2 focus:ring-[#e11d48]/20"
            />
            <p className="mt-2 text-xs text-[#94a3b8]">
              Ambiente demonstrativo — CEP usado apenas para simular contexto de localização.
            </p>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setCepModalOpen(false)} className="flex-1 rounded-xl border border-[#e2e8f0] py-3 text-sm font-medium text-[#475569] hover:bg-[#f8fafc]">
                Cancelar
              </button>
              <button onClick={handleCepSubmit} disabled={cepInput.replace(/\D/g, "").length !== 8} className="flex-1 rounded-xl bg-[#e11d48] py-3 text-sm font-bold text-white hover:bg-[#be123c] disabled:opacity-50">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
