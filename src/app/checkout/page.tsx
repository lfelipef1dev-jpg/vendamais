"use client";

import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { useCartStore } from "@/lib/store";
import { formatBRL } from "@/lib/catalog";
import { Check, Truck, Store, CreditCard, MapPin, Shield } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, getSubtotal, getSavings, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [delivery, setDelivery] = useState<"entrega" | "retirada">("entrega");
  const [payment, setPayment] = useState<"pix" | "cartao">("pix");
  const [placed, setPlaced] = useState(false);
  const subtotal = getSubtotal();
  const savings = getSavings();
  const shipping = subtotal >= 200 ? 0 : 12.90;
  const pixDiscount = payment === "pix" ? subtotal * 0.05 : 0;
  const total = subtotal + shipping - pixDiscount;

  if (placed) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#16a34a]">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-[#0f172a]">Pedido confirmado!</h1>
          <p className="mt-2 text-[#475569]">
            Seu pedido foi recebido. Em breve você receberá a confirmação por e-mail.
          </p>
          <p className="mt-4 text-2xl font-bold text-[#e11d48]">{formatBRL(total)}</p>
          <p className="mt-3 text-xs text-[#94a3b8]">
            Ambiente demonstrativo — pedido fictício, nenhuma transação real foi processada.
          </p>
          <Link href="/" className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-[#e11d48] px-8 text-base font-bold text-white hover:bg-[#be123c]">
            Continuar comprando
          </Link>
        </div>
      </SiteLayout>
    );
  }

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-[#0f172a]">Carrinho vazio</h1>
          <p className="mt-2 text-[#475569]">Adicione produtos antes de finalizar a compra.</p>
          <Link href="/" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#e11d48] px-6 text-sm font-bold text-white hover:bg-[#be123c]">
            Ver produtos
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const steps = ["Endereço", "Entrega", "Pagamento", "Revisão"];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Checkout</h1>

        {/* Steps */}
        <div className="mt-6 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i + 1 === step ? "bg-[#e11d48] text-white" : i + 1 < step ? "bg-[#16a34a] text-white" : "bg-[#e2e8f0] text-[#94a3b8]"}`}>
                {i + 1 < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:inline ${i + 1 === step ? "text-[#0f172a]" : "text-[#94a3b8]"}`}>{s}</span>
              {i < steps.length - 1 && <div className="h-px w-4 sm:w-8 bg-[#e2e8f0]" />}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2 space-y-4">
            {step === 1 && (
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 space-y-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-[#0f172a]"><MapPin className="h-5 w-5 text-[#e11d48]" /> Endereço de entrega</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input placeholder="CEP" className="rounded-lg border border-[#e2e8f0] px-3 py-2.5 text-sm focus:border-[#e11d48] focus:outline-none" />
                  <input placeholder="Rua" className="rounded-lg border border-[#e2e8f0] px-3 py-2.5 text-sm focus:border-[#e11d48] focus:outline-none sm:col-span-2" />
                  <input placeholder="Número" className="rounded-lg border border-[#e2e8f0] px-3 py-2.5 text-sm focus:border-[#e11d48] focus:outline-none" />
                  <input placeholder="Complemento" className="rounded-lg border border-[#e2e8f0] px-3 py-2.5 text-sm focus:border-[#e11d48] focus:outline-none" />
                  <input placeholder="Bairro" className="rounded-lg border border-[#e2e8f0] px-3 py-2.5 text-sm focus:border-[#e11d48] focus:outline-none" />
                  <input placeholder="Cidade" className="rounded-lg border border-[#e2e8f0] px-3 py-2.5 text-sm focus:border-[#e11d48] focus:outline-none" />
                </div>
                <button onClick={() => setStep(2)} className="w-full rounded-xl bg-[#e11d48] py-3 text-sm font-bold text-white hover:bg-[#be123c]">Continuar</button>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 space-y-4">
                <h2 className="text-lg font-bold text-[#0f172a]">Modalidade</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button onClick={() => setDelivery("entrega")} className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors ${delivery === "entrega" ? "border-[#e11d48] bg-[#fef2f2]" : "border-[#e2e8f0] hover:border-[#cbd5e1]"}`}>
                    <Truck className="h-6 w-6 text-[#16a34a]" />
                    <div>
                      <p className="font-semibold text-[#0f172a]">Entrega em casa</p>
                      <p className="text-xs text-[#94a3b8]">Em até 2h ou agende</p>
                    </div>
                  </button>
                  <button onClick={() => setDelivery("retirada")} className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors ${delivery === "retirada" ? "border-[#e11d48] bg-[#fef2f2]" : "border-[#e2e8f0] hover:border-[#cbd5e1]"}`}>
                    <Store className="h-6 w-6 text-[#e11d48]" />
                    <div>
                      <p className="font-semibold text-[#0f172a]">Retirada na loja</p>
                      <p className="text-xs text-[#94a3b8]">Pronto em 1h</p>
                    </div>
                  </button>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="rounded-xl border border-[#e2e8f0] px-5 py-3 text-sm font-medium text-[#475569] hover:bg-[#f8fafc]">Voltar</button>
                  <button onClick={() => setStep(3)} className="flex-1 rounded-xl bg-[#e11d48] py-3 text-sm font-bold text-white hover:bg-[#be123c]">Continuar</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 space-y-4">
                <h2 className="text-lg font-bold text-[#0f172a]">Pagamento</h2>
                <div className="grid gap-3">
                  <button onClick={() => setPayment("pix")} className={`flex items-center justify-between rounded-xl border-2 p-4 transition-colors ${payment === "pix" ? "border-[#e11d48] bg-[#fef2f2]" : "border-[#e2e8f0] hover:border-[#cbd5e1]"}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">⚡</span>
                      <div><p className="font-semibold text-[#0f172a]">PIX — 5% de desconto <span className="text-xs font-normal text-[#94a3b8]">(demo)</span></p><p className="text-xs text-[#94a3b8]">Aprovação imediata</p></div>
                    </div>
                    <span className="font-bold text-[#16a34a]">-{formatBRL(pixDiscount)}</span>
                  </button>
                  <button onClick={() => setPayment("cartao")} className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-colors ${payment === "cartao" ? "border-[#e11d48] bg-[#fef2f2]" : "border-[#e2e8f0] hover:border-[#cbd5e1]"}`}>
                    <CreditCard className="h-6 w-6 text-[#1e40af]" />
                    <div><p className="font-semibold text-[#0f172a]">Cartão de crédito <span className="text-xs font-normal text-[#94a3b8]">(demo)</span></p><p className="text-xs text-[#94a3b8]">Em até 12x sem juros</p></div>
                  </button>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="rounded-xl border border-[#e2e8f0] px-5 py-3 text-sm font-medium text-[#475569] hover:bg-[#f8fafc]">Voltar</button>
                  <button onClick={() => setStep(4)} className="flex-1 rounded-xl bg-[#e11d48] py-3 text-sm font-bold text-white hover:bg-[#be123c]">Revisar pedido</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 space-y-4">
                <h2 className="text-lg font-bold text-[#0f172a]">Revisar pedido</h2>
                <div className="space-y-2 text-sm">
                  <p><strong>Modalidade:</strong> {delivery === "entrega" ? "Entrega em casa" : "Retirada na loja"}</p>
                  <p><strong>Pagamento:</strong> {payment === "pix" ? "PIX (5% off)" : "Cartão em 12x"}</p>
                  <p><strong>Itens:</strong> {items.length}</p>
                </div>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {items.map((i) => (
                    <li key={i.product.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{i.quantity}x {i.product.name}</span>
                      <span className="font-semibold">{formatBRL(i.product.price * i.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <button onClick={() => setStep(3)} className="rounded-xl border border-[#e2e8f0] px-5 py-3 text-sm font-medium text-[#475569] hover:bg-[#f8fafc]">Voltar</button>
                  <button onClick={() => { setPlaced(true); clearCart(); }} className="flex-1 rounded-xl bg-[#16a34a] py-3 text-sm font-bold text-white hover:bg-[#15803d]">Confirmar pedido</button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-[#e2e8f0] bg-white p-5 space-y-3">
              <h2 className="font-bold text-[#0f172a]">Resumo</h2>
              <div className="flex justify-between text-sm"><span className="text-[#475569]">Subtotal</span><span className="font-semibold">{formatBRL(subtotal)}</span></div>
              {savings > 0 && <div className="flex justify-between text-sm"><span className="text-[#16a34a]">Economia</span><span className="font-semibold text-[#16a34a]">-{formatBRL(savings)}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-[#475569]">Frete</span><span className="font-semibold">{shipping === 0 ? "Grátis" : formatBRL(shipping)}</span></div>
              {pixDiscount > 0 && <div className="flex justify-between text-sm"><span className="text-[#16a34a]">Desconto PIX</span><span className="font-semibold text-[#16a34a]">-{formatBRL(pixDiscount)}</span></div>}
              <div className="border-t border-[#e2e8f0] pt-3 flex justify-between"><span className="font-bold text-[#0f172a]">Total</span><span className="text-xl font-black text-[#e11d48]">{formatBRL(total)}</span></div>
              <div className="flex items-center gap-2 text-xs text-[#94a3b8] pt-2"><Shield className="h-4 w-4" /> Compra 100% segura</div>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
