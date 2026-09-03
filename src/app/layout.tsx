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

const SITE_URL = "https://vendamais.expostacker.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  creator: "VendaMais",
  publisher: "VendaMais",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon-32.png"],
  },
  openGraph: {
    title: "VendaMais | Seu hipermercado completo",
    description: "Frescor, economia e conveniência. Tudo que sua casa precisa em um só lugar.",
    type: "website",
    locale: "pt_BR",
    siteName: "VendaMais",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VendaMais — Seu hipermercado completo, onde você estiver",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VendaMais | Seu hipermercado completo",
    description: "Frescor, economia e conveniência. Tudo que sua casa precisa em um só lugar.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  themeColor: "#e11d48",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
