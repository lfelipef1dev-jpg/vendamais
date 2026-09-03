import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";
import { Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Meus pedidos | VendaMais",
  robots: { index: false },
};

export default function PedidosPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Meus pedidos</h1>
        <div className="mt-8 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f8fafc]">
            <Package className="h-10 w-10 text-[#94a3b8]" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[#0f172a]">Nenhum pedido ainda</h2>
          <p className="mt-1 text-sm text-[#94a3b8] max-w-sm">
            Quando você fizer sua primeira compra, ela aparecerá aqui com rastreio e opção de comprar novamente.
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
