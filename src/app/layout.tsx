import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vendamais.expostacker.com.br"),
  title: {
    default: "VendaMais | Seu hipermercado completo, onde você estiver",
    template: "%s | VendaMais",
  },
  description:
    "VendaMais — seu hipermercado digital. Hortifruti, açougue, padaria, bebidas, mercearia e muito mais. Frescor, economia e conveniência em um só lugar.",
  keywords: [
    "supermercado", "hipermercado", "compra online", "hortifruti", "açougue",
    "padaria", "bebidas", "mercearia", "delivery", "VendaMais",
  ],
  authors: [{ name: "VendaMais" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "VendaMais | Seu hipermercado completo",
    description: "Frescor, economia e conveniência. Tudo que sua casa precisa em um só lugar.",
    type: "website",
    locale: "pt_BR",
    siteName: "VendaMais",
    url: "https://vendamais.expostacker.com.br",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
