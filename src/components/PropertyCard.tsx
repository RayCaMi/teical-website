import { Link } from "react-router-dom";

import type { PropertyData } from "../types";
import { formatCurrency } from "../types";

export function PropertyCard({ data }: { data: PropertyData }) {
  return (
    <Link to={`/imovel/${data.id}`} className="bg-secondary-dark/10 rounded-lg overflow-hidden border border-transparent hover:border-secondary transition-all group flex h-36 w-80 relative">


      <div className="relative w-32 h-full bg-gray-800 shrink-0">
        <img src={data.fotos[0]} alt={data.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm p-1 rounded-md z-10">
            <img src="/fire.svg" alt="Destaque" className="w-4 h-4" />
          </div>
      </div>

      <div className="p-3 flex flex-col justify-between w-full min-w-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-white font-bold text-sm truncate pr-6">{data.nome}</h3>
          <p className="text-gray-500 text-[10px] truncate">{data.cidade}, {data.uf}</p>
        </div>
        <div className="bg-secondary text-primary font-black text-[10px] w-10 h-5 rounded-full flex items-center justify-center shadow-lg border border-black/10">
          {data.score}/100
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-[9px] line-through">{formatCurrency(data.precoAvaliacao)}</span>
          <span className="text-green-500 text-lg font-black leading-none">{formatCurrency(data.precoAtual)}</span>
        </div>
      </div>
    </Link>
  );
}