import { Header } from "./header";
import { Footer } from "./footer";
import { CartDrawer } from "./cart-drawer";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-[#e11d48] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
