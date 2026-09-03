import Link from "next/link";
import { SiteLayout } from "@/components/site-layout";

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
        <span className="text-8xl font-black text-[#e11d48]">404</span>
        <h1 className="mt-4 text-2xl font-bold text-[#0f172a]">Página não encontrada</h1>
        <p className="mt-2 text-[#475569]">
          O conteúdo que você procura não está disponível ou foi movido.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#e11d48] px-6 text-sm font-bold text-white hover:bg-[#be123c]">
            Voltar para home
          </Link>
          <Link href="/ofertas" className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#e11d48] px-6 text-sm font-bold text-[#e11d48] hover:bg-[#fef2f2]">
            Ver ofertas
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
