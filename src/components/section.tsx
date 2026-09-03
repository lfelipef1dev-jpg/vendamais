import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "./product-card";
import { CategoryIcon } from "./category-icon";
import type { Product, Category } from "@/lib/catalog";

/* === SECTION HEADER === */
export function SectionHeader({
  title, href, emoji, subtitle,
}: { title: string; href?: string; emoji?: string; subtitle?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-[#0f172a] sm:text-2xl flex items-center gap-2">
          {emoji && <span aria-hidden="true">{emoji}</span>}
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-sm text-[#94a3b8]">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="flex flex-shrink-0 items-center gap-1 text-sm font-semibold text-[#e11d48] hover:underline"
        >
          Ver tudo <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

/* === PRODUCT RAIL — scroll horizontal, não grid completo === */
export function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
      {products.map((p) => (
        <div key={p.id} className="w-40 flex-shrink-0 snap-start sm:w-48 md:w-52">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}

/* === PRODUCT GRID — para páginas de categoria/listagem === */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

/* === CATEGORY CARD — SVG icon, não emoji === */
export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categoria/${category.slug}`}
      className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-all hover:bg-[#f8fafc]"
      aria-label={`Ver ${category.name}`}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all group-hover:scale-105 sm:h-16 sm:w-16"
        style={{ borderColor: category.color + "30", backgroundColor: category.color + "0a" }}
      >
        <CategoryIcon name={category.iconName} className="h-6 w-6 sm:h-7 sm:w-7" />
        <span className="sr-only">{category.name}</span>
      </div>
      <span className="text-xs font-semibold text-[#0f172a] text-center leading-tight sm:text-sm">
        {category.name}
      </span>
    </Link>
  );
}
