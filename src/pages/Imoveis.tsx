import { useState, useMemo } from 'react';
import { PropertyListCard } from "../components/PropertyListCard";
import type { PropertyData } from "../types";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';

interface ImoveisProps {
  allProperties: PropertyData[];
  loading: boolean;
}

// Busca ignorando acentos e maiúsculas ("sao" encontra "São Paulo")
function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

const formatarMoeda = (digitos: string) => {
  const numero = parseInt(digitos || "0", 10) / 100;
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export default function Imoveis({ allProperties, loading }: ImoveisProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // FILTROS
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precoMinDigitos, setPrecoMinDigitos] = useState("");
  const [precoMaxDigitos, setPrecoMaxDigitos] = useState("");
  const [quartosMin, setQuartosMin] = useState("");

  const filtrados = useMemo(() => {
    const alvo = normalizar(busca.trim());
    const precoMin = precoMinDigitos ? parseInt(precoMinDigitos, 10) / 100 : null;
    const precoMax = precoMaxDigitos ? parseInt(precoMaxDigitos, 10) / 100 : null;
    const qMin = quartosMin ? parseInt(quartosMin, 10) : null;

    return allProperties.filter(p => {
      if (alvo && !normalizar(`${p.title} ${p.location} ${p.endereco ?? ""}`).includes(alvo)) return false;
      if (categoria && p.categoria !== categoria) return false;
      if (precoMin !== null && p.price < precoMin) return false;
      if (precoMax !== null && p.price > precoMax) return false;
      if (qMin !== null && (p.quartos ?? 0) < qMin) return false;
      return true;
    });
  }, [allProperties, busca, categoria, precoMinDigitos, precoMaxDigitos, quartosMin]);

  const temFiltroAtivo = busca || categoria || precoMinDigitos || precoMaxDigitos || quartosMin;

  const limparFiltros = () => {
    setBusca(""); setCategoria(""); setPrecoMinDigitos(""); setPrecoMaxDigitos(""); setQuartosMin("");
    setCurrentPage(1);
  };

  // Qualquer mudança de filtro volta para a primeira página
  const aoFiltrar = (atualiza: () => void) => {
    atualiza();
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="bg-background min-h-screen pt-24 text-center text-text">A atualizar a montra de leilões...</div>;
  }

  // PAGINAÇÃO
  const totalPages = Math.ceil(filtrados.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtrados.slice(indexOfFirstItem, indexOfLastItem);

  const inputClasse = "bg-background border border-border rounded-xl px-3 py-2 text-text text-sm outline-none focus:border-secondary transition-colors w-full";

  return (
    <div className="bg-background min-h-screen px-4 py-6 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-text text-3xl font-bold mb-8 sm:mb-10">A inteligência que arremata.</h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          <div className="flex-1 w-full">
            {/* BUSCA POR NOME */}
            <div className="relative mb-6">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" fontSize="small" />
              <input
                type="text"
                value={busca}
                onChange={e => aoFiltrar(() => setBusca(e.target.value))}
                placeholder="Buscar por nome, cidade ou endereço..."
                className="w-full bg-surface/80 border border-border rounded-2xl pl-12 pr-4 py-4 text-text outline-none focus:border-secondary transition-colors shadow-sm"
              />
            </div>

            {temFiltroAtivo && (
              <p className="text-muted text-sm mb-4">
                {filtrados.length} {filtrados.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
                <button onClick={limparFiltros} className="ml-3 text-secondary font-bold hover:underline">Limpar filtros</button>
              </p>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {currentItems.length > 0 ? (
                currentItems.map(item => (
                  <PropertyListCard key={item.id} data={item} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-2xl">
                  <p className="text-muted">{temFiltroAtivo ? "Nenhum imóvel corresponde aos filtros." : "Nenhum imóvel disponível no momento."}</p>
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
            {/* FILTROS */}
            <div className="bg-secondary-dark/10 border border-secondary/10 p-6 rounded-2xl shadow-xl">
              <h2 className="text-text font-bold mb-6 text-xl border-b border-border pb-2">Filtros</h2>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider">Categoria
                  <select value={categoria} onChange={e => aoFiltrar(() => setCategoria(e.target.value))} className={inputClasse}>
                    <option value="">Todas</option>
                    <option value="Casa">Casa</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Galpão">Galpão</option>
                    <option value="Lajes">Lajes</option>
                    <option value="Outros">Outros</option>
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider">Preço mín.
                    <input type="text" inputMode="numeric" value={precoMinDigitos ? formatarMoeda(precoMinDigitos) : ""} onChange={e => aoFiltrar(() => setPrecoMinDigitos(e.target.value.replace(/\D/g, "").slice(0, 15)))} placeholder="R$ 0,00" className={inputClasse} />
                  </label>
                  <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider">Preço máx.
                    <input type="text" inputMode="numeric" value={precoMaxDigitos ? formatarMoeda(precoMaxDigitos) : ""} onChange={e => aoFiltrar(() => setPrecoMaxDigitos(e.target.value.replace(/\D/g, "").slice(0, 15)))} placeholder="Sem limite" className={inputClasse} />
                  </label>
                </div>
                <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider">Quartos (mínimo)
                  <select value={quartosMin} onChange={e => aoFiltrar(() => setQuartosMin(e.target.value))} className={inputClasse}>
                    <option value="">Qualquer</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </label>
                {temFiltroAtivo && (
                  <button onClick={limparFiltros} className="text-secondary text-sm font-bold hover:underline text-left">Limpar todos os filtros</button>
                )}
              </div>
            </div>

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
