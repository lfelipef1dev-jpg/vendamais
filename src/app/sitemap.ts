import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/catalog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://vendamais.expostacker.com.br";
  const staticRoutes = [
    "", "/ofertas", "/mais-vendidos", "/busca", "/favoritos", "/conta",
    "/conta/pedidos", "/conta/enderecos", "/checkout", "/sobre",
    "/privacidade", "/termos",
  ];

  const routes: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: r === "" ? "daily" : "weekly",
    priority: r === "" ? 1 : r === "/ofertas" ? 0.9 : 0.6,
  }));

  categories.forEach((c) => {
    routes.push({
      url: `${base}/categoria/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  products.forEach((p) => {
    routes.push({
      url: `${base}/produto/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  });

  return routes;
}
