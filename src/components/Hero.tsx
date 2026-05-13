import { Link } from 'react-router-dom';
import { PropertyCard } from './PropertyCard';

import type { PropertyData } from "../types";

export function Hero({ allProperties }: { allProperties: PropertyData[] }) {
  // Ordena por score decrescente e pega os 6 primeiros
  const topProperties = [...allProperties]
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return (
    <div className="flex min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('/hero-bg.jpg')` }}>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-16 sm:px-8 lg:px-12 md:flex-row md:items-center md:gap-12">

        {/* Coluna da Esquerda: Textos */}
        <div className="flex flex-col justify-center gap-6 text-white md:w-5/12">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            A inteligência <br /> que arremata.
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            Centralizamos os leilões imobiliários do Brasil e transformamos editais complexos
            em oportunidades claras de investimento. Com o Teical Score, você analisa risco
            jurídico, desconto real e encontra as melhores oportunidades do mercado.
          </p>
          <Link to="/imoveis" className="btn-primary w-fit px-8 py-3 text-lg">
            Ver imóveis
          </Link>
        </div>

        {/* Coluna da Direita: Cards de Destaque */}
        <div className="flex w-full flex-col items-start justify-center gap-8 md:w-7/12 md:pr-12">
          <span className="text-3xl font-bold text-white mb-4 border-b-2 border-secondary pb-2">Destaques</span>

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