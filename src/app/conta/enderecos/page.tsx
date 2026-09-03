import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Endereços | VendaMais",
  robots: { index: false },
};

export default function EnderecosPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Meus endereços</h1>
        <div className="mt-8 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f8fafc]">
            <MapPin className="h-10 w-10 text-[#94a3b8]" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[#0f172a]">Nenhum endereço cadastrado</h2>
          <p className="mt-1 text-sm text-[#94a3b8] max-w-sm">
            Cadastre um endereço para acelerar suas compras e verificar disponibilidade de entrega.
          </p>
          <button className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#e11d48] px-6 text-sm font-bold text-white hover:bg-[#be123c]">
            + Adicionar endereço
          </button>
        </div>
      </div>
    </SiteLayout>
  );
}
