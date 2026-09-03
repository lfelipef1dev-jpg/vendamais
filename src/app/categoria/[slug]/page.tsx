import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/site-layout";
import { ProductGrid } from "@/components/section";
import { CategoryIcon } from "@/components/category-icon";
import { categories, getProductsByCategory, getOffers } from "@/lib/catalog";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { CategoryFilters } from "./category-filters";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then((p) => {
    const cat = categories.find((c) => c.slug === p.slug);
    if (!cat) return { title: "Categoria não encontrada" };
    return {
      title: `${cat.name} | VendaMais`,
      description: `Compre ${cat.name.toLowerCase()} no VendaMais. ${cat.subcategories.join(", ")}.`,
      alternates: { canonical: `/categoria/${cat.slug}` },
    };
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();
  const products = getProductsByCategory(cat.id);
  const offers = getOffers().filter((p) => p.category === cat.id);
  const subcategories = cat.subcategories;

  // Agrupar por subcategoria
  const bySubcat: Record<string, typeof products> = {};
  for (const p of products) {
    if (!bySubcat[p.subcategory]) bySubcat[p.subcategory] = [];
    bySubcat[p.subcategory].push(p);
  }

  return (
    <SiteLayout>
      {/* Hero da categoria */}
      <section className="relative h-40 sm:h-56 overflow-hidden" aria-label={cat.name}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cat.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-2">
              <ol className="flex items-center gap-2 text-xs text-white/80">
                <li><Link href="/" className="hover:underline">Início</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
                <li aria-current="page" className="text-white font-medium">{cat.name}</li>
              </ol>
            </nav>
            <h1 className="text-3xl font-black text-white sm:text-4xl">{cat.name}</h1>
            <p className="mt-1 text-sm text-white/90">
              {products.length} produtos · {subcategories.join(" · ")}
            </p>
          </div>
        </div>
      </section>

      {/* Subcategorias — pills */}
      <div className="border-b border-[#e2e8f0] bg-white sticky top-[calc(1.75rem+4rem+2.75rem)] z-30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3">
            <span className="text-xs font-bold uppercase tracking-wide text-[#94a3b8] flex-shrink-0">
              <CategoryIcon name={cat.iconName} className="inline h-4 w-4 mr-1" />
              {cat.name}:
            </span>
            {subcategories.map((sub) => (
              <a
                key={sub}
                href={`#sub-${sub.toLowerCase().replace(/\s/g, "-")}`}
                className="flex-shrink-0 rounded-full bg-[#f8fafc] px-3 py-1.5 text-sm font-medium text-[#475569] transition-colors hover:bg-[#fef9f0] hover:text-[#e11d48]"
              >
                {sub}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Ofertas da categoria */}
        {offers.length > 0 && (
          <section className="mb-10" aria-label="Ofertas da categoria">
            <h2 className="mb-4 text-xl font-bold text-[#e11d48]">Ofertas em {cat.name}</h2>
            <ProductGrid products={offers} />
          </section>
        )}

        {/* Produtos por subcategoria */}
        {subcategories.map((sub) => {
          const subProducts = bySubcat[sub];
          if (!subProducts || subProducts.length === 0) return null;
          const anchor = `sub-${sub.toLowerCase().replace(/\s/g, "-")}`;
          return (
            <section key={sub} id={anchor} className="mb-10 scroll-mt-32" aria-label={sub}>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#0f172a]">{sub}</h2>
                  <p className="text-sm text-[#94a3b8]">{subProducts.length} produto(s)</p>
                </div>
              </div>
              <ProductGrid products={subProducts} />
            </section>
          );
        })}

        {/* Filtros (client component) */}
        <CategoryFilters products={products} />
      </div>
    </SiteLayout>
  );
}
