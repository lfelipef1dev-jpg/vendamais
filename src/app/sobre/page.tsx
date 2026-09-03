import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";

export const metadata: Metadata = {
  title: "Sobre o VendaMais",
  description: "Conheça o VendaMais — seu hipermercado digital completo.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <h1 className="text-3xl font-black text-[#0f172a]">Sobre o VendaMais</h1>
        <div className="mt-6 space-y-4 text-[#475569] leading-relaxed">
          <p>
            O VendaMais é um hipermercado digital completo. Reunimos em um só lugar tudo que sua casa precisa —
            hortifruti, açougue, padaria, mercearia e muito mais.
          </p>
          <p>
            Nossa proposta é simples: oferecer variedade, economia e conveniência com a confiança de uma grande rede.
            Desde a compra até a entrega na sua porta, cada etapa foi pensada para ser rápida, fácil e segura.
          </p>
          <p>
            <strong className="text-[#0f172a]">Variedade.</strong> Doze categorias para abastecer toda a casa,
            do hortifruti ao pet, da mercearia à higiene.
          </p>
          <p>
            <strong className="text-[#0f172a]">Economia.</strong> Ofertas reais e preços justos em todo o sortimento,
            com o programa de fidelidade Venda+ para quem compra com a gente.
          </p>
          <p>
            <strong className="text-[#0f172a]">Conveniência.</strong> Entrega em casa ou retirada na loja,
            pagamento via PIX ou cartão, e atendimento humano quando você precisar.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { n: "12", l: "Categorias" },
            { n: "48", l: "Produtos" },
            { n: "2", l: "Modalidades" },
            { n: "100%", l: "Online" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-[#e2e8f0] bg-white p-4 text-center">
              <p className="text-2xl font-black text-[#e11d48]">{s.n}</p>
              <p className="text-xs text-[#94a3b8]">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-xl border-2 border-dashed border-[#f59e0b] bg-[#fef9f0] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#d97706]">Ambiente demonstrativo</p>
          <p className="mt-1 text-sm text-[#475569]">
            O VendaMais é uma plataforma de demonstração de produto. Produtos, preços, pedidos e operações são
            fictícios e não representam transações comerciais reais.
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
