import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";

export const metadata: Metadata = {
  title: "Termos de Uso | VendaMais",
  description: "Termos e condições de uso da plataforma VendaMais.",
  alternates: { canonical: "/termos" },
};

export default function TermosPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <h1 className="text-3xl font-black text-[#0f172a]">Termos de Uso</h1>
        <div className="mt-6 space-y-6 text-[#475569]">
          <section><h2 className="text-lg font-bold text-[#0f172a]">1. Aceitação</h2><p className="mt-2">Ao acessar o VendaMais, você concorda com estes termos. Se não concordar, não utilize a plataforma.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">2. Cadastro e conta</h2><p className="mt-2">Você é responsável pela veracidade dos dados fornecidos e pela segurança de sua conta.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">3. Pedidos</h2><p className="mt-2">Pedidos estão sujeitos a disponibilidade e confirmação. Preços e promoções podem ser alterados sem aviso prévio.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">4. Pagamentos</h2><p className="mt-2">Aceitamos PIX (com 5% de desconto) e cartão de crédito em até 12x sem juros. O pagamento é processado em ambiente seguro.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">5. Entrega</h2><p className="mt-2">Prazos de entrega são estimados. Oferecemos entrega em casa e retirada na loja. Frete grátis acima de R$ 200.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">6. Trocas e devoluções</h2><p className="mt-2">As condições de troca e devolução variam conforme o tipo de produto. Produtos não perecíveis seguem o Código de Defesa do Consumidor. Produtos perecíveis (hortifruti, açougue, padaria, laticínios) estão sujeitos a regras específicas de qualidade e frescor.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">7. Ambiente demonstrativo</h2><p className="mt-2">Esta é uma plataforma de demonstração de produto. Produtos, preços, pedidos, pagamentos e entregas são fictícios para fins de demonstração. Nenhuma transação comercial real é processada.</p></section>
          <section><h2 className="text-lg font-bold text-[#0f172a]">8. Lei aplicável</h2><p className="mt-2">Estes termos são regidos pela legislação brasileira. Fica eleito o foro de São Paulo/SP.</p></section>
        </div>
      </div>
    </SiteLayout>
  );
}
