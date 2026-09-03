import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";
import { ProductGrid } from "@/components/section";
import { getOffers } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Ofertas | VendaMais",
  description: "Ofertas imperdíveis em todo o hipermercado. Frescor, economia e qualidade.",
  alternates: { canonical: "/ofertas" },
};

export default function OfertasPage() {
  const offers = getOffers();
  return (
    <SiteLayout>
      <section className="bg-gradient-to-r from-[#e11d48] to-[#be123c] py-12" aria-label="Ofertas">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="text-3xl font-black text-white sm:text-4xl md:text-5xl">Ofertas VendaMais</h1>
          <p className="mt-2 text-white/90 max-w-xl mx-auto">
            Economize em tudo que sua casa precisa. Ofertas por tempo limitado.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <p className="mb-4 text-sm text-[#94a3b8]">{offers.length} produtos em oferta</p>
        <ProductGrid products={offers} />
      </div>
    </SiteLayout>
  );
}
