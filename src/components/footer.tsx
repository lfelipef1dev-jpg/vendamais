import Link from "next/link";
import { Truck, Shield, RefreshCw, CreditCard, Phone, Mail, MapPin } from "lucide-react";
import { categories } from "@/lib/catalog";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e2e8f0] bg-white">
      {/* Benefits bar */}
      <div className="border-b border-[#e2e8f0]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-4 lg:px-8">
          {[
            { icon: Truck, title: "Frete grátis", desc: "Acima de R$ 200" },
            { icon: Shield, title: "Compra segura", desc: "Ambiente protegido" },
            { icon: RefreshCw, title: "Troca facilitada", desc: "30 dias para trocar" },
            { icon: CreditCard, title: "PIX com 5% off", desc: "Ou 12x sem juros" },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#fef9f0]">
                <b.icon className="h-5 w-5 text-[#e11d48]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0f172a]">{b.title}</p>
                <p className="text-xs text-[#94a3b8]">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-1" aria-label="VendaMais">
              <span className="text-xl font-black text-[#e11d48]">Venda</span>
              <span className="text-xl font-black text-[#16a34a]">Mais</span>
            </Link>
            <p className="mt-3 text-sm text-[#475569] max-w-xs">
              Seu hipermercado completo, onde você estiver. Frescor, economia e conveniência em um só lugar.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <a href="tel:1313334444" className="flex items-center gap-2 text-[#475569] hover:text-[#e11d48]">
                <Phone className="h-4 w-4" /> (13) 3333-4444
              </a>
              <a href="mailto:contato@vendamais.expostacker.com.br" className="flex items-center gap-2 text-[#475569] hover:text-[#e11d48]">
                <Mail className="h-4 w-4" /> contato@vendamais
              </a>
              <p className="flex items-start gap-2 text-[#475569]">
                <MapPin className="h-4 w-4 mt-0.5" /> Av. Demonstração, 1000 — São Paulo — SP
              </p>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wide">Categorias</h3>
            <ul className="mt-3 space-y-2" role="list">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/categoria/${cat.slug}`} className="text-sm text-[#475569] hover:text-[#e11d48] transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wide">Institucional</h3>
            <ul className="mt-3 space-y-2" role="list">
              <li><Link href="/sobre" className="text-sm text-[#475569] hover:text-[#e11d48]">Sobre o VendaMais</Link></li>
              <li><Link href="/entrega" className="text-sm text-[#475569] hover:text-[#e11d48]">Entrega e retirada</Link></li>
              <li><Link href="/pagamentos" className="text-sm text-[#475569] hover:text-[#e11d48]">Formas de pagamento</Link></li>
              <li><Link href="/trocas-devolucoes" className="text-sm text-[#475569] hover:text-[#e11d48]">Trocas e devoluções</Link></li>
              <li><Link href="/faq" className="text-sm text-[#475569] hover:text-[#e11d48]">Perguntas frequentes</Link></li>
            </ul>
          </div>

          {/* Conta */}
          <div>
            <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wide">Minha conta</h3>
            <ul className="mt-3 space-y-2" role="list">
              <li><Link href="/conta" className="text-sm text-[#475569] hover:text-[#e11d48]">Meus dados</Link></li>
              <li><Link href="/conta/pedidos" className="text-sm text-[#475569] hover:text-[#e11d48]">Meus pedidos</Link></li>
              <li><Link href="/favoritos" className="text-sm text-[#475569] hover:text-[#e11d48]">Favoritos</Link></li>
              <li><Link href="/conta/enderecos" className="text-sm text-[#475569] hover:text-[#e11d48]">Endereços</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wide">Legal</h3>
            <ul className="mt-3 space-y-2" role="list">
              <li><Link href="/privacidade" className="text-sm text-[#475569] hover:text-[#e11d48]">Política de privacidade</Link></li>
              <li><Link href="/termos" className="text-sm text-[#475569] hover:text-[#e11d48]">Termos de uso</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#e2e8f0] bg-[#f8fafc]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-[#94a3b8] sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} VendaMais — Ambiente demonstrativo. Produtos e preços fictícios.</p>
          <div className="flex items-center gap-3">
            <span>🔒 SSL</span>
            <span>PIX</span>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Elo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
