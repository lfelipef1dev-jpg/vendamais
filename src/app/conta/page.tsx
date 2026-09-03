import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";
import { User, Package, Heart, MapPin, CreditCard, Tag, Settings, Shield } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Minha conta | VendaMais",
  description: "Gerencie seus dados, pedidos, endereços e preferências.",
  alternates: { canonical: "/conta" },
  robots: { index: false },
};

const menu = [
  { href: "/conta/pedidos", icon: Package, label: "Meus pedidos", desc: "Acompanhe e compre novamente" },
  { href: "/favoritos", icon: Heart, label: "Favoritos", desc: "Seus produtos salvos" },
  { href: "/conta/enderecos", icon: MapPin, label: "Endereços", desc: "Cadastre e gerencie endereços" },
  { href: "/conta", icon: CreditCard, label: "Pagamentos", desc: "Cartões e métodos de pagamento" },
  { href: "/conta", icon: Tag, label: "Cupons", desc: "Seus cupons e descontos" },
  { href: "/conta", icon: Settings, label: "Preferências", desc: "Notificações e preferências" },
  { href: "/conta", icon: Shield, label: "Privacidade", desc: "Dados e privacidade" },
];

export default function ContaPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e11d48]/10">
            <User className="h-8 w-8 text-[#e11d48]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">Minha conta</h1>
            <p className="text-sm text-[#94a3b8]">Bem-vindo ao VendaMais</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {menu.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 rounded-xl border border-[#e2e8f0] bg-white p-4 transition-all hover:border-[#e11d48] hover:shadow-md"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#f8fafc]">
                <item.icon className="h-5 w-5 text-[#e11d48]" />
              </div>
              <div>
                <p className="font-semibold text-[#0f172a]">{item.label}</p>
                <p className="text-xs text-[#94a3b8]">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-[#e2e8f0] bg-[#fef9f0] p-6 text-center">
          <h2 className="font-bold text-[#0f172a]">Venda+ Benefícios</h2>
          <p className="mt-1 text-sm text-[#475569]">
            Ainda não assinante? Tenha preços exclusivos, cupons e ofertas personalizadas.
          </p>
          <button className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[#e11d48] px-5 text-sm font-bold text-white hover:bg-[#be123c]">
            Conhecer Venda+
          </button>
        </div>
      </div>
    </SiteLayout>
  );
}
