"use client";

import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { ProductGrid } from "@/components/section";
import { searchProducts } from "@/lib/catalog";
import { Search } from "lucide-react";

export default function BuscaPage() {
  const [query, setQuery] = useState("");
  const results = query.trim() ? searchProducts(query) : [];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Buscar produtos</h1>
        <div className="relative mt-4 max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94a3b8]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            placeholder="O que você procura?"
            aria-label="Buscar produtos"
            className="w-full rounded-xl border border-[#e2e8f0] bg-white py-3 pl-10 pr-4 text-base focus:border-[#e11d48] focus:outline-none focus:ring-2 focus:ring-[#e11d48]/20"
          />
        </div>

        {query.trim() && (
          <p className="mt-4 text-sm text-[#94a3b8]">
            {results.length > 0
              ? `${results.length} produto(s) encontrado(s) para "${query}"`
              : `Nenhum produto encontrado para "${query}". Tente outro termo.`}
          </p>
        )}

        {results.length > 0 && (
          <div className="mt-6">
            <ProductGrid products={results} />
          </div>
        )}

        {!query.trim() && (
          <div className="mt-8 text-center text-[#94a3b8]">
            <Search className="mx-auto h-12 w-12 opacity-40" />
            <p className="mt-2">Digite algo para buscar em nosso catálogo.</p>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
