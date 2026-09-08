import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";

export const metadata: Metadata = {
  title: "Política de Privacidade | VendaMais",
  description: "Política de privacidade e proteção de dados pessoais.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <h1 className="text-3xl font-black text-[#0f172a]">Política de Privacidade</h1>
        <div className="mt-6 space-y-6 text-[#475569]">
          <section><h2 className="text-lg font-bold text-[#0f172a]">1. Coleta de dados</h2><p className="mt-2">Nesta demonstração, nenhum dado pessoal é coletado, processado ou armazenado em servidor. O carrinho e favoritos são salvos localmente no navegador do usuário. Os endereços e CEP inseridos são apenas preenchimento ilustrativo e não são transmitidos.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">2. Uso das informações</h2><p className="mt-2">Como se trata de um portfólio/projeto demonstrativo, não há processamento de pedidos, entregas, comunicações ou recomendações baseadas em dados reais.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">3. Base legal (LGPD)</h2><p className="mt-2">Se a plataforma for lançada comercialmente, o tratamento de dados seguirá a Lei nº 13.709/2018 (LGPD), com base no consentimento, execução de contrato e legítimo interesse comercial. Na versão atual, nenhum dado pessoal é coletado.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">4. Compartilhamento</h2><p className="mt-2">Não há compartilhamento de dados com terceiros nesta demonstração. Logística, pagamentos e prestadores são apenas elementos ilustrativos.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">5. Retenção</h2><p className="mt-2">Como os dados são armazenados apenas no navegador, sua retenção é controlada pelo próprio usuário e pode ser removida ao limpar os dados locais.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">6. Direitos do titular</h2><p className="mt-2">Em uma operação real, você terá direito de acessar, corrigir, eliminar, portar e revogar consentimentos. Nesta demonstração, nenhum dado pessoal é coletado.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">7. Cookies</h2><p className="mt-2">Esta demonstração pode usar cookies ou localStorage essenciais apenas para manter o carrinho e favoritos durante a navegação. Não há rastreamento publicitário.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">8. Contato</h2><p className="mt-2">Este é um projeto de portfólio. Para dúvidas comerciais futuras, o canal de contato será definido quando houver operação real.</p></section>
        </div>
      </div>
    </SiteLayout>
  );
}
