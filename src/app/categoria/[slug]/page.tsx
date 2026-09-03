import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/site-layout";
import { ProductGrid } from "@/components/section";
import { categories, getProductsByCategory } from "@/lib/catalog";

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

  return (
    <SiteLayout>
      {/* Hero da categoria */}
      <section className="relative h-48 sm:h-64 overflow-hidden" aria-label={cat.name}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cat.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-2">
              <ol className="flex items-center gap-2 text-xs text-white/80">
                <li><Link href="/" className="hover:underline">Início</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-white font-medium">{cat.name}</li>
              </ol>
            </nav>
            <h1 className="text-3xl font-black text-white sm:text-4xl">
              {cat.name}
            </h1>
            <p className="mt-1 text-sm text-white/90">
              {products.length} produtos · {cat.subcategories.join(" · ")}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <ProductGrid products={products} />
      </div>
    </SiteLayout>
  );
}
