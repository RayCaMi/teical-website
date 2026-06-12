import { useState } from 'react';
import { PropertyListCard } from "../components/PropertyListCard";
import type { PropertyData } from "../types";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ImoveisProps {
  allProperties: PropertyData[];
  loading: boolean;
}

export default function Imoveis({ allProperties, loading }: ImoveisProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) {
    return <div className="bg-background min-h-screen pt-24 text-center text-text">A atualizar a montra de leilões...</div>;
  }

  // PAGINAÇÃO
  const totalPages = Math.ceil(allProperties.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allProperties.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-background min-h-screen px-4 py-6 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-text text-3xl font-bold mb-8 sm:mb-10">A inteligência que arremata.</h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          <div className="flex-1">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {currentItems.length > 0 ? (
                currentItems.map(item => (
                  <PropertyListCard key={item.id} data={item} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-2xl">
                  <p className="text-muted">Nenhum imóvel disponível no momento.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-col gap-4 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0, 0); }}
                  className={`text-muted hover:text-secondary transition-all duration-300 flex items-center gap-2 font-bold ${currentPage === 1 ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
                >
                  <ArrowBackIcon sx={{ fontWeight: 'bold' }} /> Anterior
                </button>
                <span className="text-muted text-sm font-bold tracking-widest uppercase">
                  Página {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0, 0); }}
                  className={`text-muted hover:text-secondary transition-all duration-300 flex items-center gap-2 font-bold ${currentPage === totalPages ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
                >
                  Próxima <ArrowForwardIcon sx={{ fontWeight: 'bold' }} />
                </button>
              </div>
            )}
          </div>

          <aside className="w-full lg:w-80 flex flex-col gap-6">
            <div className="bg-secondary-dark/10 border border-secondary/10 p-6 rounded-2xl shadow-xl">
              <h2 className="text-text font-bold mb-6 text-xl border-b border-border pb-2">Glossário</h2>
              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-3 text-muted text-xs leading-relaxed">
                  <div className="w-3 h-3 rounded-full bg-green-500 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.4)]" /> Imóvel Desocupado
                </li>
                <li className="flex items-center gap-3 text-muted text-xs leading-relaxed">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shrink-0 shadow-[0_0_8px_rgba(234,179,8,0.4)]" /> Em Leilão (Status Padrão)
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}