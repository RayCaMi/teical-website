import { useEffect, useRef, useState } from 'react';

// Lista oficial de municípios do IBGE, carregada uma única vez e mantida em cache
let cacheCidades: string[] | null = null;

async function carregarCidades(): Promise<string[]> {
  if (cacheCidades) return cacheCidades;
  const resposta = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?view=nivelado');
  const dados = await resposta.json();
  cacheCidades = dados.map((m: Record<string, string>) => `${m['municipio-nome']} - ${m['UF-sigla']}`);
  return cacheCidades!;
}

// Compara ignorando acentos e maiúsculas ("sao" encontra "São Paulo")
function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

interface CidadeAutocompleteProps {
  value: string;
  onChange: (valor: string) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export default function CidadeAutocomplete({ value, onChange, required, className, placeholder }: CidadeAutocompleteProps) {
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [aberto, setAberto] = useState(false);
  const caixaRef = useRef<HTMLDivElement>(null);

  // Fecha a lista ao clicar fora
  useEffect(() => {
    const fechar = (e: MouseEvent) => {
      if (caixaRef.current && !caixaRef.current.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener('mousedown', fechar);
    return () => document.removeEventListener('mousedown', fechar);
  }, []);

  const aoDigitar = async (texto: string) => {
    onChange(texto);
    if (texto.trim().length < 2) {
      setSugestoes([]);
      setAberto(false);
      return;
    }
    try {
      const cidades = await carregarCidades();
      const alvo = normalizar(texto);
      const achadas = cidades.filter(c => normalizar(c).includes(alvo)).slice(0, 8);
      setSugestoes(achadas);
      setAberto(achadas.length > 0);
    } catch {
      // Se o IBGE estiver fora do ar, o campo continua funcionando como texto livre
      setSugestoes([]);
      setAberto(false);
    }
  };

  return (
    <div ref={caixaRef} className="relative">
      <input
        type="text"
        required={required}
        value={value}
        onChange={e => aoDigitar(e.target.value)}
        onFocus={() => sugestoes.length > 0 && setAberto(true)}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {aberto && (
        <ul className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-border bg-surface shadow-xl">
          {sugestoes.map(cidade => (
            <li key={cidade}>
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-text hover:bg-secondary/10 transition-colors"
                onClick={() => { onChange(cidade); setAberto(false); }}
              >
                {cidade}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
