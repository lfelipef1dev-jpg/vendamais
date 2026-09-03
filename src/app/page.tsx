import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroCarousel } from "@/components/hero-carousel";
import { CartDrawer } from "@/components/cart-drawer";
import { SectionHeader, ProductGrid, CategoryCircle, HorizontalScroll } from "@/components/section";
import {
  categories, getOffers, getProductsByCategory, getBestSellers, products,
} from "@/lib/catalog";
import { Truck, Store, Smartphone, Clock } from "lucide-react";

export default function HomePage() {
  const offers = getOffers().slice(0, 12);
  const bestSellers = getBestSellers().slice(0, 12);
  const hortifruti = getProductsByCategory("hortifruti").slice(0, 6);
  const acougue = getProductsByCategory("acougue").slice(0, 6);
  const bebidas = getProductsByCategory("bebidas").slice(0, 6);
  const mercearia = getProductsByCategory("mercearia").slice(0, 6);

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Skip link target */}

        {/* Hero */}
        <HeroCarousel />

        {/* Categories nav */}
        <section className="border-b border-[#e2e8f0] bg-white py-6" aria-label="Categorias">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="mb-4 text-lg font-bold text-[#0f172a]">Compre por categoria</h2>
            <HorizontalScroll>
              {categories.map((cat) => <CategoryCircle key={cat.id} category={cat} />)}
            </HorizontalScroll>
          </div>
        </section>

        {/* Benefits strip */}
        <section className="bg-[#fef9f0] py-4" aria-label="Benefícios">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-sm lg:px-8">
            <span className="flex items-center gap-2 text-[#475569]"><Truck className="h-4 w-4 text-[#16a34a]" /> Entrega em até 2h</span>
            <span className="flex items-center gap-2 text-[#475569]"><Store className="h-4 w-4 text-[#e11d48]" /> Retire na loja</span>
            <span className="flex items-center gap-2 text-[#475569]"><Clock className="h-4 w-4 text-[#f59e0b]" /> Aberto 24h</span>
            <span className="flex items-center gap-2 text-[#475569]"><Smartphone className="h-4 w-4 text-[#1e40af]" /> App VendaMais</span>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 lg:px-8 lg:py-10">
          {/* Ofertas do dia */}
          <section aria-labelledby="ofertas-heading">
            <SectionHeader
              title="Ofertas do dia"
              emoji="🔥"
              href="/ofertas"
              subtitle="Ofertas imperdíveis, por tempo limitado"
            />
            <ProductGrid products={offers} />
          </section>

          {/* Hortifruti */}
          <section aria-labelledby="hortifruti-heading">
            <SectionHeader
              title="Hortifruti fresquinho"
              emoji="🥬"
              href="/categoria/hortifruti"
              subtitle="Direto do produtor, selecionado todos os dias"
            />
            <ProductGrid products={hortifruti} />
          </section>

          {/* Açougue */}
          <section aria-labelledby="acougue-heading">
            <SectionHeader
              title="Açougue premium"
              emoji="🥩"
              href="/categoria/acougue"
              subtitle="Cortes selecionados e frescor garantido"
            />
            <ProductGrid products={acougue} />
          </section>

          {/* Bebidas */}
          <section aria-labelledby="bebidas-heading">
            <SectionHeader
              title="Bebidas geladas"
              emoji="🥤"
              href="/categoria/bebidas"
              subtitle="Refrigerantes, sucos, águas e mais"
            />
            <ProductGrid products={bebidas} />
          </section>

          {/* Mercearia */}
          <section aria-labelledby="mercearia-heading">
            <SectionHeader
              title="Mercearia essencial"
              emoji="🥫"
              href="/categoria/mercearia"
              subtitle="Tudo para a sua compra do mês"
            />
            <ProductGrid products={mercearia} />
          </section>

          {/* Mais vendidos */}
          <section aria-labelledby="vendidos-heading">
            <SectionHeader
              title="Mais vendidos"
              emoji="⭐"
              href="/mais-vendidos"
              subtitle="Os queridinhos dos nossos clientes"
            />
            <ProductGrid products={bestSellers} />
          </section>

          {/* Venda+ banner */}
          <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#e11d48] to-[#be123c] p-6 sm:p-8" aria-label="Programa Venda+">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-white/80">Programa de fidelidade</p>
                <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">Venda+ Benefícios</h2>
                <p className="mt-2 text-sm text-white/90 max-w-md">
                  Preços exclusivos, cupons, ofertas personalizadas e muito mais.
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

          {/* App / omnichannel */}
          <section className="grid gap-4 sm:grid-cols-2" aria-label="App e omnichannel">
            <div className="flex items-center gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-6">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#1e40af]/10">
                <Smartphone className="h-7 w-7 text-[#1e40af]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a]">App VendaMais</h3>
                <p className="text-sm text-[#475569]">Compre de onde estiver. iOS e Android.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-6">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#16a34a]/10">
                <Store className="h-7 w-7 text-[#16a34a]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a]">Retire na loja</h3>
                <p className="text-sm text-[#475569]">Compre online e retire quando quiser.</p>
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
