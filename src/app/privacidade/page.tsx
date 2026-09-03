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
          <section><h2 className="text-lg font-bold text-[#0f172a]">1. Coleta de dados</h2><p className="mt-2">Coletamos dados fornecidos voluntariamente (nome, e-mail, telefone, endereço, CEP) e dados de navegação (IP, páginas visitadas) para processar pedidos e melhorar a experiência.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">2. Uso das informações</h2><p className="mt-2">Utilizamos os dados para: processar pedidos, organizar entregas, enviar comunicações quando autorizado, recomendar produtos e melhorar o serviço.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">3. Base legal (LGPD)</h2><p className="mt-2">Tratamos dados com base no consentimento, execução de contrato e legítimo interesse comercial, conforme a Lei nº 13.709/2018.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">4. Compartilhamento</h2><p className="mt-2">Não vendemos dados. Compartilhamos apenas com prestadores essenciais (logística, pagamentos) sob confidencialidade, ou por obrigação legal.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">5. Retenção</h2><p className="mt-2">Mantemos os dados pelo tempo necessário para as finalidades descritas, salvo obrigações legais.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">6. Direitos do titular</h2><p className="mt-2">Você pode acessar, corrigir, eliminar, portar ou revogar o consentimento de seus dados a qualquer momento.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">7. Cookies</h2><p className="mt-2">Usamos cookies essenciais de navegação e carrinho. Não utilizamos rastreamento publicitário de terceiros sem consentimento.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">8. Contato</h2><p className="mt-2">Para exercer seus direitos: <a href="mailto:contato@vendamais.expostacker.com.br" className="text-[#e11d48] underline">contato@vendamais.expostacker.com.br</a></p></section>
        </div>
      </div>
    </SiteLayout>
  );
}
