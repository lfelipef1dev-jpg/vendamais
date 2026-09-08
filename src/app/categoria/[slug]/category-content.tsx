"use client";

import { useState, useMemo } from "react";
import { ProductGrid } from "@/components/section";
import type { Product } from "@/lib/catalog";
import { SlidersHorizontal, X } from "lucide-react";

type SortOption = "relevance" | "price-asc" | "price-desc" | "name-asc";

export function CategoryContent({
  products,
  offers,
  subcategories,
  categoryName,
}: {
  products: Product[];
  offers: Product[];
  subcategories: string[];
  categoryName: string;
}) {
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [filterOffer, setFilterOffer] = useState(false);
  const [filterPremium, setFilterPremium] = useState(false);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeSub) result = result.filter((p) => p.subcategory === activeSub);
    if (filterOffer) result = result.filter((p) => p.promotion === "oferta");
    if (filterPremium) result = result.filter((p) => p.tags.includes("premium"));

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return result;
  }, [products, sortBy, filterOffer, filterPremium, activeSub]);

  const activeFilters = (filterOffer ? 1 : 0) + (filterPremium ? 1 : 0) + (activeSub ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Ofertas da categoria */}
      {offers.length > 0 && (
        <section className="mb-10" aria-label="Ofertas da categoria">
          <h2 className="mb-4 text-xl font-bold text-[#e11d48]">Ofertas em {categoryName}</h2>
          <ProductGrid products={offers} />
        </section>
      )}

      {/* Filtros e grid principal */}
      <section aria-label="Produtos da categoria">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0f172a]">{activeSub ? activeSub : "Todos os produtos"}</h2>
            <p className="text-sm text-[#94a3b8]">{filtered.length} produto(s)</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm font-medium text-[#475569] transition-colors hover:bg-[#f8fafc]"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtrar e ordenar
            {activeFilters > 0 && (
              <span className="rounded-full bg-[#e11d48] px-1.5 text-xs font-bold text-white">{activeFilters}</span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 space-y-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#475569]">Ordenar:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-sm font-medium text-[#0f172a] focus:border-[#e11d48] focus:outline-none"
              >
                <option value="relevance">Relevância</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name-asc">A-Z</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterOffer(!filterOffer)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  filterOffer ? "bg-[#e11d48] text-white" : "bg-white text-[#475569] border border-[#e2e8f0] hover:bg-[#fef9f0]"
                }`}
              >
                Ofertas
              </button>
              <button
                onClick={() => setFilterPremium(!filterPremium)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  filterPremium ? "bg-[#0f172a] text-white" : "bg-white text-[#475569] border border-[#e2e8f0] hover:bg-[#fef9f0]"
                }`}
              >
                Seleção
              </button>
              {activeFilters > 0 && (
                <button
                  onClick={() => { setFilterOffer(false); setFilterPremium(false); setActiveSub(null); }}
                  className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-[#94a3b8] hover:text-[#e11d48]"
                >
                  <X className="h-3 w-3" /> Limpar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Subcategorias como filtros rápidos */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-[#94a3b8]">Subcategorias:</span>
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSub(activeSub === sub ? null : sub)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                activeSub === sub
                  ? "bg-[#e11d48] text-white"
                  : "bg-[#f8fafc] text-[#475569] border border-[#e2e8f0] hover:bg-[#fef9f0]"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <ProductGrid products={filtered} />
      </section>
    </div>
  );
}
