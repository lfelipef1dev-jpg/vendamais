import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroCarousel } from "@/components/hero-carousel";
import { CartDrawer } from "@/components/cart-drawer";
import { SectionHeader, ProductRail, CategoryCard } from "@/components/section";
import { CategoryIcon } from "@/components/category-icon";
import {
  categories, getOffers, getProductsByCategory, products,
} from "@/lib/catalog";
import { Truck, Store, Smartphone, Tag } from "lucide-react";

export default function HomePage() {
  // Seleções editoriais — sem repetição entre seções
  const offers = getOffers().slice(0, 10);
  const offerIds = new Set(offers.map((p) => p.id));

  // Para seções de categoria, pegar produtos que NÃO estão em ofertas
  const hortifruti = getProductsByCategory("hortifruti").filter((p) => !offerIds.has(p.id)).slice(0, 6);
  const acougue = getProductsByCategory("acougue").filter((p) => !offerIds.has(p.id)).slice(0, 6);
  const mercearia = getProductsByCategory("mercearia").filter((p) => !offerIds.has(p.id)).slice(0, 6);
  const bebidas = getProductsByCategory("bebidas").filter((p) => !offerIds.has(p.id)).slice(0, 6);

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <HeroCarousel />

        {/* Categories grid — ícones SVG, não emojis */}
        <section className="border-b border-[#e2e8f0] bg-white py-6" aria-label="Categorias">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="mb-4 text-lg font-bold text-[#0f172a]">Compre por categoria</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 lg:px-8 lg:space-y-10">
          {/* Ofertas do dia — rail horizontal */}
          <section aria-labelledby="ofertas-heading">
            <SectionHeader
              title="Ofertas do dia"
              emoji="🔥"
              href="/ofertas"
              subtitle="Ofertas por tempo limitado"
            />
            <ProductRail products={offers} />
          </section>

          {/* Hortifruti — rail */}
          {hortifruti.length > 0 && (
            <section aria-labelledby="hortifruti-heading">
              <SectionHeader
                title="Hortifruti"
                href="/categoria/hortifruti"
                subtitle="Frutas, legumes e verduras"
              />
              <ProductRail products={hortifruti} />
            </section>
          )}

          {/* Açougue — rail */}
          {acougue.length > 0 && (
            <section aria-labelledby="acougue-heading">
              <SectionHeader
                title="Açougue"
                href="/categoria/acougue"
                subtitle="Cortes selecionados"
              />
              <ProductRail products={acougue} />
            </section>
          )}

          {/* Mercearia — rail */}
          {mercearia.length > 0 && (
            <section aria-labelledby="mercearia-heading">
              <SectionHeader
                title="Mercearia"
                href="/categoria/mercearia"
                subtitle="Essenciais para sua despensa"
              />
              <ProductRail products={mercearia} />
            </section>
          )}

          {/* Bebidas — rail */}
          {bebidas.length > 0 && (
            <section aria-labelledby="bebidas-heading">
              <SectionHeader
                title="Bebidas"
                href="/categoria/bebidas"
                subtitle="Refrigerantes, sucos e águas"
              />
              <ProductRail products={bebidas} />
            </section>
          )}

          {/* Venda+ — masterbrand clara */}
          <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#e11d48] to-[#be123c] p-6 sm:p-8" aria-label="Programa Venda+">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-white/80">Programa de fidelidade</p>
                <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">Venda+ Benefícios</h2>
                <p className="mt-2 text-sm text-white/90 max-w-md">
                  Preços exclusivos, cupons e ofertas personalizadas para quem compra com a gente.
                </p>
              </div>
              <Link
                href="/conta"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#e11d48] transition-transform hover:scale-105"
              >
                Saiba mais
              </Link>
            </div>
          </section>

          {/* Omnichannel — sem claims falsos */}
          <section className="grid gap-4 sm:grid-cols-3" aria-label="Modalidades de compra">
            <div className="flex items-center gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-6">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#16a34a]/10">
                <Truck className="h-7 w-7 text-[#16a34a]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a]">Entrega</h3>
                <p className="text-sm text-[#475569]">Receba em casa no horário que preferir</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-6">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#e11d48]/10">
                <Store className="h-7 w-7 text-[#e11d48]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a]">Retire na loja</h3>
                <p className="text-sm text-[#475569]">Compre online e busque quando quiser</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-6">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#1e40af]/10">
                <Smartphone className="h-7 w-7 text-[#1e40af]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a]">App VendaMais</h3>
                <p className="text-sm text-[#475569]">Em breve para iOS e Android</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
