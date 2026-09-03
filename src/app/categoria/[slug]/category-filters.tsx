"use client";

import { useState, useMemo } from "react";
import { ProductGrid } from "@/components/section";
import type { Product } from "@/lib/catalog";
import { SlidersHorizontal, X } from "lucide-react";

type SortOption = "relevance" | "price-asc" | "price-desc" | "name-asc";

export function CategoryFilters({ products }: { products: Product[] }) {
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [filterOffer, setFilterOffer] = useState(false);
  const [filterPremium, setFilterPremium] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];
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
  }, [products, sortBy, filterOffer, filterPremium]);

  const activeFilters = (filterOffer ? 1 : 0) + (filterPremium ? 1 : 0);

  return (
    <section className="mt-12 border-t border-[#e2e8f0] pt-8" aria-label="Filtrar e ordenar">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#0f172a]">Todos os produtos</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm font-medium text-[#475569] transition-colors hover:bg-[#f8fafc]"
          aria-expanded={showFilters}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtrar
          {activeFilters > 0 && (
            <span className="rounded-full bg-[#e11d48] px-1.5 text-xs font-bold text-white">{activeFilters}</span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
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

          <div className="flex items-center gap-2">
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
                onClick={() => { setFilterOffer(false); setFilterPremium(false); }}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-[#94a3b8] hover:text-[#e11d48]"
              >
                <X className="h-3 w-3" /> Limpar
              </button>
            )}
          </div>
        </div>
      )}

      <p className="mb-4 text-sm text-[#94a3b8]">{filtered.length} produto(s)</p>
      <ProductGrid products={filtered} />
    </section>
  );
}
