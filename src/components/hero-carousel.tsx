"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/store";

interface Slide {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  align: "left" | "center";
  theme: "green" | "red" | "orange";
}

const slides: Slide[] = [
  {
    id: "feira",
    image: "https://images.unsplash.com/photo-1542838132-25c8eb958dd2?w=1600&h=700&fit=crop&q=80",
    eyebrow: "Hortifruti",
    title: "Frescor que dá gosto de levar",
    subtitle: "Frutas, legumes e verduras selecionados todos os dias direto do produtor.",
    cta: "Comprar hortifruti",
    href: "/categoria/hortifruti",
    align: "left",
    theme: "green",
  },
  {
    id: "mes",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1600&h=700&fit=crop&q=80",
    eyebrow: "Economia",
    title: "Encha o carrinho. Economize de verdade.",
    subtitle: "Ofertas imperdíveis em tudo que sua casa precisa. Compre do mês com até 40% OFF.",
    cta: "Ver ofertas da semana",
    href: "/ofertas",
    align: "left",
    theme: "red",
  },
  {
    id: "churrasco",
    image: "https://images.unsplash.com/photo-1607623814075-e51dfba4d609?w=1600&h=700&fit=crop&q=80",
    eyebrow: "Churrasco",
    title: "Seu churrasco começa aqui",
    subtitle: "Carnes premium, acompanhamentos e tudo para o seu final de semana perfeito.",
    cta: "Montar churrasco",
    href: "/categoria/acougue",
    align: "left",
    theme: "orange",
  },
];

const themeColors: Record<Slide["theme"], { bg: string; text: string; btn: string }> = {
  green: { bg: "from-[#15803d]/90", text: "text-white", btn: "bg-[#16a34a] hover:bg-[#15803d]" },
  red: { bg: "from-[#be123c]/90", text: "text-white", btn: "bg-[#e11d48] hover:bg-[#be123c]" },
  orange: { bg: "from-[#92400e]/90", text: "text-white", btn: "bg-[#f59e0b] hover:bg-[#d97706]" },
};

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (!isPlaying || prefersReduced || !mounted) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [isPlaying, prefersReduced, mounted, next]);

  const goTo = (idx: number) => { setCurrent(idx); setIsPlaying(false); };
  const theme = themeColors[slides[current].theme];

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx > 0 ? prev() : next(); }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0f172a]"
      aria-label="Campanhas VendaMais"
      aria-roledescription="carousel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <h2 className="sr-only">Campanhas em destaque</h2>
      <div className="relative aspect-[16/10] sm:aspect-[16/8] md:aspect-[16/7] lg:aspect-[16/6] xl:aspect-[21/7]">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            aria-hidden={idx !== current}
            aria-roledescription="slide"
            aria-label={`${idx + 1} de ${slides.length}: ${slide.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.title}
              loading={idx === 0 ? "eager" : "lazy"}
              fetchPriority={idx === 0 ? "high" : "low"}
              className="h-full w-full object-cover"
            />
            <div className={cn("absolute inset-0 bg-gradient-to-r to-transparent", theme.bg)} />
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                <div className={cn("max-w-lg", slide.align === "center" && "mx-auto text-center")}>
                  <span className={cn("inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm", theme.text)}>
                    {slide.eyebrow}
                  </span>
                  <h3 className={cn("mt-3 text-2xl font-black leading-tight sm:text-3xl md:text-4xl lg:text-5xl text-balance", theme.text)}>
                    {slide.title}
                  </h3>
                  <p className={cn("mt-2 text-sm sm:text-base md:text-lg max-w-md", theme.text, "opacity-90")}>
                    {slide.subtitle}
                  </p>
                  <a
                    href={slide.href}
                    className={cn(
                      "mt-4 inline-flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                      theme.btn
                    )}
                  >
                    {slide.cta}
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        <button
          onClick={prev}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-1.5" role="tablist" aria-label="Selecionar campanha">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => goTo(idx)}
              role="tab"
              aria-selected={idx === current}
              aria-label={`Ir para campanha: ${slide.eyebrow}`}
              className={cn(
                "h-2 rounded-full transition-all",
                idx === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
              )}
            />
          ))}
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors focus-visible:outline-2 focus-visible:outline-white"
          aria-label={isPlaying ? "Pausar" : "Reproduzir"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>
    </section>
  );
}
