import { Link } from "react-router-dom";
import type { PropertyData } from "../types";
import { formatCurrency } from "../types";

export function PropertyListCard({ data }: { data: PropertyData }) {
  const statusColors = {
    green: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]',
    yellow: 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]',
    red: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
  };

  return (
    <Link to={`/imovel/${data.id}`} className="bg-surface rounded-xl overflow-hidden hover:border-2 border-border transition-all group flex h-auto w-full max-w-2xl relative">
      <div className="absolute top-3 right-3 z-20">
        <div className={`w-3 h-3 rounded-full ${statusColors[data.status]}`}></div>
      </div>

      <div className="relative w-1/3 min-h-40 bg-surface/80 shrink-0">
        <img src={data.fotos[0]} alt={data.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>

      <div className="p-4 flex flex-col justify-between w-full min-w-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-text font-bold text-base truncate">{data.nome}</h3>
          <p className="text-muted text-xs truncate mb-2">{data.bairro}, {data.cidade} - {data.uf}</p>
        </div>
        <div className="flex items-end justify-between border-t border-gray-800 pt-3">
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-[10px] line-through">{formatCurrency(data.precoAvaliacao)}</span>
            <span className="text-green-500 text-xl font-black mb-2">{formatCurrency(data.precoAtual)}</span>
            <div className="bg-contrast/10 text-contrast border border-contrast/30 font-black text-[10px] px-2 py-0.5 rounded w-fit">
              SCORE: {data.score}/100
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}