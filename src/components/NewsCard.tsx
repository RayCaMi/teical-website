import type { NewsData } from "../types";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from "react-router-dom";

export function NewsCard({ data, isHero = false }: { data: NewsData, isHero?: boolean }) {
    return (
        <Link to={`/noticia/${data.id}`}>
            <div className={`group cursor-pointer bg-surface/30 border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-secondary/50 
      ${isHero ? 'flex flex-col lg:flex-row h-auto lg:h-100' : 'flex flex-col h-full'}`}>

                <div className={`${isHero ? 'lg:w-1/2 h-64 lg:h-full' : 'h-48'} overflow-hidden relative`}>
                    <img
                        src={data.imagemUrl}
                        alt={data.titulo}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-secondary text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                            {data.categoria}
                        </span>
                        {data.isNovo && (
                            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                Novo
                            </span>
                        )}
                    </div>
                </div>

                <div className={`p-6 flex flex-col justify-between ${isHero ? 'lg:w-1/2' : 'flex-1'}`}>
                    <div>
                        <div className="flex items-center gap-4 text-muted text-[10px] mb-3 uppercase tracking-widest">
                            <span>{data.autor} • {data.data}</span>
                            <span className="flex items-center gap-1">
                                <AccessTimeIcon sx={{ fontSize: 12 }} /> {data.leituraMinutos} min de leitura
                            </span>
                        </div>

                        <h3 className={`${isHero ? 'text-2xl lg:text-3xl' : 'text-xl'} text-text font-bold mb-4 leading-tight group-hover:text-secondary-dark transition-colors`}>
                            {data.titulo}
                        </h3>

                        <p className="text-muted text-sm line-clamp-3 leading-relaxed">
                            {data.resumo}
                        </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <span className="text-secondary text-xs font-bold uppercase tracking-widest group-hover:underline">
                            Ler mais —
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}