import { Link } from 'react-router-dom';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import type { PropertyData } from '../types';
import { formatCurrency } from '../types';

interface PropertyListCardProps {
  data: PropertyData;
}

export function PropertyListCard({ data }: PropertyListCardProps) {
  return (
    <Link to={`/imovel/${data.id}`} className="block group">
      <div className="bg-surface border border-border rounded-3xl overflow-hidden hover:border-secondary transition-all duration-300 shadow-lg">
        
        {/* Imagem e Etiquetas */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={data.image_url} 
            alt={data.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 bg-yellow-500/90 backdrop-blur-sm text-black text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
            {data.status}
          </div>
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md text-[#00ffcc] text-xs font-black px-3 py-1.5 rounded-full border border-[#00ffcc]/30 shadow-lg flex items-center gap-1">
            SCORE <span className="text-base">{data.score}</span>
          </div>
        </div>
        
        {/* Informações do Imóvel */}
        <div className="p-6">
          <h3 className="text-text font-bold text-xl mb-3 line-clamp-2 leading-tight">
            {data.title}
          </h3>
          
          <div className="flex items-center text-muted text-sm mb-6">
            <LocationPinIcon fontSize="small" className="mr-1 text-secondary" />
            <span className="truncate">{data.location}</span>
          </div>
          
          <div className="pt-5 border-t border-border flex justify-between items-center">
            <div className="flex items-center text-green-400 font-black text-xl">
              <AttachMoneyIcon fontSize="small" className="mr-1" />
              {formatCurrency(data.price)}
            </div>
            <div className="text-xs text-secondary font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300">
              Detalhes &rarr;
            </div>
          </div>
        </div>
        
      </div>
    </Link>
  );
}