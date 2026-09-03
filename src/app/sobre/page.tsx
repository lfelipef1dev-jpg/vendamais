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
            O VendaMais é o seu hipermercado digital completo. Reunimos em um só lugar tudo que sua casa precisa —
            hortifruti fresquinho, açougue premium, padaria artesanal, mercearia essencial e muito mais.
          </p>
          <p>
            Nossa missão é simples: oferecer variedade, economia e conveniência com a confiança de uma grande rede.
            Desde a compra até a entrega na sua porta, cada etapa foi pensada para ser rápida, fácil e segura.
          </p>
          <p>
            <strong className="text-[#0f172a]">Frescor que dá gosto de levar.</strong> Trabalhamos com produtos
            selecionados diariamente, parceiros de confiança e padrões de qualidade que você pode sentir.
          </p>
          <p>
            <strong className="text-[#0f172a]">Economia de verdade.</strong> Ofertas reais, preços justos e o
            programa Venda+ com benefícios exclusivos para quem compra com a gente.
          </p>
          <p>
            <strong className="text-[#0f172a]">Conveniência em primeiro lugar.</strong> Entrega em casa, retirada
            na loja, app mobile e atendimento humano quando você precisar.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { n: "12+", l: "Categorias" },
            { n: "60+", l: "Produtos" },
            { n: "2h", l: "Entrega expressa" },
            { n: "24h", l: "Disponível" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-[#e2e8f0] bg-white p-4 text-center">
              <p className="text-2xl font-black text-[#e11d48]">{s.n}</p>
              <p className="text-xs text-[#94a3b8]">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
