"use client";

import Link from "next/link";
import { SiteLayout } from "@/components/site-layout";
import { ProductGrid } from "@/components/section";
import { products } from "@/lib/catalog";
import { useCartStore } from "@/lib/store";
import { Heart } from "lucide-react";

export default function FavoritosPage() {
  const { favorites } = useCartStore();
  const favProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <h1 className="text-2xl font-bold text-[#0f172a] flex items-center gap-2">
          <Heart className="h-6 w-6 fill-[#e11d48] text-[#e11d48]" /> Favoritos
        </h1>

        {favProducts.length > 0 ? (
          <>
            <p className="mt-2 text-sm text-[#94a3b8]">{favProducts.length} produto(s) favoritado(s)</p>
            <div className="mt-6">
              <ProductGrid products={favProducts} />
            </div>
          </>
        ) : (
          <div className="mt-12 flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f8fafc]">
              <Heart className="h-10 w-10 text-[#94a3b8]" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-[#0f172a]">Nenhum favorito ainda</h2>
            <p className="mt-1 text-sm text-[#94a3b8] max-w-sm">
              Toque no coração nos produtos que você ama para salvá-los aqui.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#e11d48] px-6 text-sm font-bold text-white hover:bg-[#be123c]"
            >
              Explorar produtos
            </Link>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
