import { Link } from "react-router-dom";
import type { PropertyData } from "../types";
import { formatCurrency } from "../types";

export function PropertyCard({ data }: { data: PropertyData }) {
  return (
    <Link to={`/imovel/${data.id}`} className="bg-white/80 rounded-xl overflow-hidden shadow-lg border border-slate-200/60 flex h-32 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <div className="relative w-32 min-w-[128px] h-full bg-surface/80 shrink-0">
        <img src={data.image_url} alt={data.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm p-1 rounded-full">
          <img src="/fire.svg" alt="Destaque" className="w-4 h-4" />
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between w-full min-w-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-primary font-bold text-sm truncate pr-6">{data.title}</h3>
          <p className="text-gray-600 text-[10px] truncate">{data.location}</p>
        </div>

        <div className="flex items-center gap-2 truncate">
          <span className="text-green-600 font-black text-sm tracking-tight truncate">
            {formatCurrency(data.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}