import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PropertyCard } from './PropertyCard';
import heroBg from '/hero.jpeg';

import type { PropertyData } from "../types";

export function Hero({ allProperties }: { allProperties: PropertyData[] }) {
  const [showDestaques, setShowDestaques] = useState(false);

  // Ordena por score decrescente e pega os 6 primeiros
  const topProperties = [...allProperties]
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

useEffect(() => {
    // Se os destaques já apareceram ou se a página já foi rolada (ex: ao recarregar a página),
    // mostra os destaques imediatamente e não bloqueia nada.
    if (showDestaques || window.scrollY > 10) {
      if (!showDestaques) setShowDestaques(true);
      return;
    }

    let touchStartY = 0;

    // 1. Controle do Mouse (Scroll Wheel)
    const handleWheel = (e: WheelEvent) => {
      // deltaY > 0 significa que a rodinha está indo para baixo
      if (e.deltaY > 0) {
        e.preventDefault();
        setShowDestaques(true);
      }
    };

    // 2. Controle do Touch (Celulares/Tablets)
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchCurrentY = e.touches[0].clientY;
      // Se o dedo começou mais embaixo e foi para cima, a tela rolaria para baixo
      if (touchStartY > touchCurrentY) {
        e.preventDefault();
        setShowDestaques(true);
      }
    };

    // 3. Controle do Teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' ', 'End'].includes(e.key)) {
        e.preventDefault();
        setShowDestaques(true);
      }
    };

    // Usamos passive: false para permitir o cancelamento do evento com preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDestaques]);

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="absolute inset-0 bg-slate-50/0" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-16 sm:px-8 lg:px-12 md:flex-row md:items-center md:gap-12">

        {/* Coluna da Esquerda: Textos */}
        <div className="flex flex-col justify-center gap-6 text-slate-950 md:w-5/12 bg-[radial-gradient(circle,_theme(colors.white)_20%,_transparent_100%)]">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl text-slate-950">
            A inteligência <br /> que arremata.
          </h1>
          <p className="max-w-lg text-sm font-medium leading-relaxed text-slate-800 sm:text-base">
            Centralizamos os leilões imobiliários do Brasil e transformamos editais complexos
            em oportunidades claras de investimento. Com o Teical Score, você analisa risco
            jurídico, desconto real e encontra as melhores oportunidades do mercado.
          </p>
          <Link to="/imoveis" className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-lg font-bold text-white shadow-xl shadow-primary/20 transition hover:bg-primary-dark">
            Ver imóveis
          </Link>
        </div>

        {/* Coluna da Direita: Cards de Destaque - Desktop only with scroll animation */}
        <div className={`hidden md:flex md:w-7/12 md:pr-12 transition-all duration-700 ease-out ${
          showDestaques
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8 pointer-events-none'
        }`}>
          <div className="flex w-full flex-col items-start justify-center gap-8">
            <span className="text-3xl font-bold text-slate-950 mb-4 border-b-2 border-slate-950 pb-2">Destaques</span>

            <div className="grid w-full gap-6 md:gap-8 sm:grid-cols-2">
              {topProperties.map(prop => (
                <PropertyCard key={prop.id} data={prop} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Destaques - Always visible */}
        <div className="flex w-full flex-col items-start justify-center gap-8 md:hidden">
          <span className="text-3xl font-bold text-slate-950 mb-4 border-b-2 border-slate-950 pb-2">Destaques</span>

          <div className="grid w-full gap-6 md:gap-8 sm:grid-cols-2">
            {topProperties.map(prop => (
              <PropertyCard key={prop.id} data={prop} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}