import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { products, getProductBySlug, getProductsByCategory, formatBRL, calcDiscount } from "@/lib/catalog";
import { ChevronRight, Star, Heart, ShoppingCart, Truck, Store, Shield } from "lucide-react";
import { ProductActions } from "./product-actions";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then((p) => {
    const product = getProductBySlug(p.slug);
    if (!product) return { title: "Produto não encontrado" };
    return {
      title: `${product.name} | VendaMais`,
      description: `${product.name} ${product.weight} — ${formatBRL(product.price)}. ${product.unitPrice}.`,
      alternates: { canonical: `/produto/${product.slug}` },
      openGraph: { title: product.name, description: formatBRL(product.price), images: [product.image] },
    };
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = getProductsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 6);
  const discount = calcDiscount(product.price, product.previousPrice);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-[#94a3b8]">
            <li><Link href="/" className="hover:text-[#e11d48]">Início</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
            <li><Link href={`/categoria/${product.category}`} className="hover:text-[#e11d48] capitalize">{product.category}</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
            <li aria-current="page" className="text-[#0f172a] font-medium truncate">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Gallery */}
          <div className="relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-lg bg-[#e11d48] px-3 py-1.5 text-sm font-bold text-white shadow-lg">
                -{discount}%
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-[#94a3b8] uppercase tracking-wide">{product.brand}</p>
            <h1 className="mt-1 text-2xl font-black text-[#0f172a] sm:text-3xl">{product.name}</h1>

            {product.rating && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex" aria-label={`Avaliação ${product.rating} de 5`}>
                  {[1,2,3,4,5].map((s) => (
                    <Star
                      key={s}
                      className={s <= Math.round(product.rating!) ? "h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" : "h-4 w-4 text-[#e2e8f0]"}
                    />
                  ))}
                </div>
                <span className="text-sm text-[#475569]">{product.rating.toFixed(1)} ({product.ratingCount} avaliações)</span>
              </div>
            )}

            <p className="mt-3 text-sm text-[#475569]">{product.weight} · {product.subcategory}</p>

            {/* Price */}
            <div className="mt-4 rounded-xl bg-[#fef9f0] p-4">
              {product.previousPrice && (
                <p className="text-sm text-[#94a3b8] line-through">{formatBRL(product.previousPrice)}</p>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#e11d48]">{formatBRL(product.price)}</span>
                {discount > 0 && <span className="text-sm font-bold text-[#e11d48]">-{discount}%</span>}
              </div>
              <p className="mt-1 text-sm font-medium text-[#16a34a]">{product.unitPrice}</p>
              {product.byWeight && (
                <p className="mt-2 text-xs text-[#94a3b8]">
                  ⚖️ Produto vendido por peso. Valor final pode variar conforme o peso efetivamente separado.
                </p>
              )}
            </div>

            {/* Actions (client) */}
            <ProductActions product={product} />

            {/* Delivery info */}
            <div className="mt-6 space-y-3 rounded-xl border border-[#e2e8f0] p-4">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-[#16a34a]" />
                <div>
                  <p className="font-semibold text-[#0f172a]">Entrega em casa</p>
                  <p className="text-xs text-[#94a3b8]">Em até 2h ou agende seu horário</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Store className="h-5 w-5 text-[#e11d48]" />
                <div>
                  <p className="font-semibold text-[#0f172a]">Retire na loja</p>
                  <p className="text-xs text-[#94a3b8]">Pronto em 1h, sem fila</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-[#1e40af]" />
                <div>
                  <p className="font-semibold text-[#0f172a]">Compra segura</p>
                  <p className="text-xs text-[#94a3b8]">Pagamento protegido</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12" aria-label="Produtos relacionados">
            <h2 className="mb-4 text-xl font-bold text-[#0f172a]">Quem comprou, também levou</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
