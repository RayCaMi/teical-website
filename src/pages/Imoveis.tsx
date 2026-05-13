import { useState, useMemo } from 'react';
import { PropertyListCard } from "../components/PropertyListCard";
import type { PropertyData } from "../types";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Imoveis({ allProperties }: { allProperties: PropertyData[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const itemsPerPage = 10;

  const categorias = ['Casa', 'Apartamento', 'Galpão', 'Lajes', 'Outros'];

  // 1. FILTRAGEM (O useMemo garante que isso só mude quando o filtro mudar)
  const filteredProperties = useMemo(() => {
    if (selectedCategories.length === 0) return allProperties;
    return allProperties.filter(item => selectedCategories.includes(item.categoria));
  }, [allProperties, selectedCategories]);

  // 2. PAGINAÇÃO (Calculada sobre os itens já filtrados)
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);

  const toggleCategory = (cat: string) => {
    setCurrentPage(1); // Sempre volta para a página 1 ao filtrar
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="bg-background min-h-screen px-4 py-6 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-text text-3xl font-bold mb-8 sm:mb-10">
          A inteligência que arremata.
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

          {/* COLUNA DA ESQUERDA: LISTA E PAGINAÇÃO */}
          <div className="flex-1">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {currentItems.length > 0 ? (
                currentItems.map(item => (
                  <PropertyListCard key={item.id} data={item} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-2xl">
                  <p className="text-muted">Nenhum imóvel encontrado nestas categorias.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-col gap-4 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0, 0); }}
                  className={`text-muted hover:text-secondary transition-all duration-300 flex items-center gap-2 font-bold ${currentPage === 1 ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
                >
                  <ArrowBackIcon sx={{ fontWeight: 'bold' }} />
                  Anterior
                </button>

                <span className="text-muted text-sm font-bold tracking-widest uppercase">
                  Página {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0, 0); }}
                  className={`text-muted hover:text-secondary transition-all duration-300 flex items-center gap-2 font-bold ${currentPage === totalPages ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
                >
                  Próxima
                  <ArrowForwardIcon sx={{ fontWeight: 'bold' }} />
                </button>
              </div>
            )}
          </div>

          <aside className="w-full lg:w-80 flex flex-col gap-6">

            <div className="bg-secondary-dark/10 border border-secondary/10 p-6 rounded-2xl shadow-xl">
              <h2 className="text-text font-bold mb-6 text-xl border-b border-border pb-2">Glossário</h2>
              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-3 text-muted text-xs leading-relaxed">
                  <div className="w-3 h-3 rounded-full bg-green-500 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  Imóvel de documentação regular
                </li>
                <li className="flex items-center gap-3 text-muted text-xs leading-relaxed">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shrink-0 shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                  Imóvel ocupado
                </li>
                <li className="flex items-center gap-3 text-muted text-xs leading-relaxed">
                  <div className="w-3 h-3 rounded-full bg-red-500 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                  Imóvel de financiamento não permitido
                </li>
              </ul>
            </div>

            <div className="bg-secondary-dark/10 border border-secondary/10 p-6 rounded-2xl shadow-xl">
              <h2 className="text-text font-bold mb-6 text-xl border-b border-border pb-2">Categorias</h2>
              <div className="grid grid-cols-1 gap-3">
                {categorias.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 text-muted text-xs cursor-pointer hover:text-text transition-colors group">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${selectedCategories.includes(cat) ? 'bg-secondary border-secondary' : 'border-border bg-surface group-hover:border-secondary'}`}>
                      {selectedCategories.includes(cat) && <div className="w-2 h-2 bg-primary rounded-sm" />}
                    </div>
                    {cat}
                  </label>
                ))}
              </div>
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => { setSelectedCategories([]); setCurrentPage(1); }}
                  className="mt-6 text-[10px] text-secondary underline uppercase font-bold hover:text-secondary-light"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}