import { Link } from 'react-router-dom';
import { PropertyCard } from './PropertyCard';

import type { PropertyData } from "../types";

export function Hero({ allProperties }: { allProperties: PropertyData[] }) {
  // Ordena por score decrescente e pega os 6 primeiros
  const topProperties = [...allProperties]
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return (
    <div className="flex h-screen w-full"
         style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/hero-bg.jpg')`, backgroundSize: 'cover' }}>
        
        {/* Coluna da Esquerda: Textos */}
        <div className="flex flex-col px-12 w-1/2 justify-center">
            <h1 className="mb-5 text-5xl font-extrabold text-white leading-tight">
                A inteligência <br /> que arremata.
            </h1>
            <p className="text-sm text-muted mb-10 max-w-md leading-relaxed">
                Centralizamos os leilões imobiliários do Brasil e transformamos editais complexos
                em oportunidades claras de investimento. Com o Teical Score, você analisa risco 
                jurídico, desconto real e encontra as melhores oportunidades do mercado.
            </p>
            <Link to="/imoveis" className="btn-primary w-fit px-12 py-3 text-lg">
                Ver imóveis
            </Link>
        </div>

        {/* Coluna da Direita: Cards de Destaque */}
        <div className="flex flex-col w-1/2 items-center justify-center pr-12">
            <span className="text-3xl font-bold text-white mb-8 border-b-2 border-secondary pb-2">Destaques</span>
            
            <div className="flex gap-6">
                {/* Coluna 1 dos Cards (0, 1, 2) */}
                <div className="flex flex-col gap-6">
                    {topProperties.slice(0, 3).map(prop => <PropertyCard key={prop.id} data={prop} />)}
                </div>
                {/* Coluna 2 dos Cards (3, 4, 5) */}
                <div className="flex flex-col gap-6">
                    {topProperties.slice(3, 6).map(prop => <PropertyCard key={prop.id} data={prop} />)}
                </div>
            </div>
        </div>
    </div>
  ); 
}