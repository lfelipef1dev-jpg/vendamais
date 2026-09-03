import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";
import { ProductGrid } from "@/components/section";
import { getBestSellers } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Mais vendidos | VendaMais",
  description: "Os produtos mais queridos pelos nossos clientes.",
  alternates: { canonical: "/mais-vendidos" },
};

export default function MaisVendidosPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] py-12" aria-label="Mais vendidos">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="text-3xl font-black text-white sm:text-4xl">⭐ Mais vendidos</h1>
          <p className="mt-2 text-white/90">Os queridinhos dos nossos clientes</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <ProductGrid products={getBestSellers()} />
      </div>
    </SiteLayout>
  );
}
