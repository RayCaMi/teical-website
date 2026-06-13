import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import PublishIcon from '@mui/icons-material/Publish';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { supabase } from "../supabase";
import { API_URL } from "../config";
import type { PropertyData } from "../types";
import { formatCurrency } from "../types";

export default function MeusImoveis() {
  const navigate = useNavigate();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [imoveis, setImoveis] = useState<PropertyData[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [agindo, setAgindo] = useState<string | null>(null); // id do imóvel em ação
  const [isAdmin, setIsAdmin] = useState(false);

  const obterToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  };

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const token = await obterToken();
      const response = await fetch(`${API_URL}/meus-imoveis/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setImoveis(data.imoveis ?? []);
    } catch {
      setErro("Não foi possível carregar seus imóveis. Se for o primeiro acesso do dia, o servidor pode estar acordando — aguarde um minuto e recarregue.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const iniciar = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      const role = session.user.app_metadata?.role ?? session.user.user_metadata?.role;
      if (role !== "leiloeiro" && role !== "admin") {
        navigate("/");
        return;
      }
      setIsAdmin(role === "admin");
      setLoadingAuth(false);
      carregar();
    };
    iniciar();
  }, [navigate, carregar]);

  const publicar = async (id: string | number) => {
    setAgindo(String(id));
    try {
      const token = await obterToken();
      const response = await fetch(`${API_URL}/confirmar-leilao/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      await carregar();
    } catch {
      setErro("Não foi possível publicar o imóvel. Tente novamente.");
    } finally {
      setAgindo(null);
    }
  };

  const excluir = async (id: string | number, titulo: string) => {
    if (!window.confirm(`Excluir definitivamente "${titulo}"? As fotos também serão apagadas.`)) return;
    setAgindo(String(id));
    try {
      const token = await obterToken();
      const response = await fetch(`${API_URL}/imoveis/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      await carregar();
    } catch {
      setErro("Não foi possível excluir o imóvel. Tente novamente.");
    } finally {
      setAgindo(null);
    }
  };

  if (loadingAuth) return <div className="min-h-screen bg-background flex items-center justify-center text-secondary font-bold">Verificando credenciais...</div>;

  return (
    <div className="bg-background min-h-screen text-text p-6 md:p-12">
      <header className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-12 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{isAdmin ? "Todos os Imóveis" : "Meus Imóveis"}</h1>
          <p className="text-muted text-sm">{isAdmin ? "Como admin, você gerencia o catálogo inteiro" : "Imóveis que você cadastrou no site"}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/painel-envio" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-secondary hover:bg-secondary/10 rounded-lg transition-colors border border-secondary/30">
            + Cadastrar Imóvel
          </Link>
          <Link to="/gerenciar-noticias" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-secondary hover:bg-secondary/10 rounded-lg transition-colors border border-secondary/30">
            Notícias
          </Link>
          <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors">
            <ArrowBackIcon fontSize="small" /> Voltar ao site
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        {erro && (
          <div className="mb-8 bg-red-400/10 border border-red-400/30 text-red-400 rounded-2xl px-6 py-4 font-medium">{erro}</div>
        )}

        {loading ? (
          <div className="py-20 text-center text-secondary font-bold">Carregando imóveis...</div>
        ) : imoveis.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl">
            <p className="text-muted mb-4">Você ainda não cadastrou nenhum imóvel.</p>
            <Link to="/painel-envio" className="text-secondary font-bold hover:underline">Cadastrar o primeiro →</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {imoveis.map(imovel => {
              const pendente = imovel.status === "Pendente";
              const ocupado = agindo === String(imovel.id);
              return (
                <div key={imovel.id} className={`bg-surface/80 border rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4 shadow-sm ${pendente ? 'border-yellow-500/40' : 'border-border'}`}>
                  <img src={imovel.image_url} alt={imovel.title} className="w-full md:w-28 h-32 md:h-20 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold truncate">{imovel.title}</h3>
                      {pendente && <span className="text-[10px] font-black uppercase tracking-wider bg-yellow-500/15 text-yellow-500 border border-yellow-500/40 rounded-full px-2 py-0.5">Aguardando publicação</span>}
                    </div>
                    <p className="text-muted text-sm truncate">{imovel.location}{imovel.endereco ? ` · ${imovel.endereco}` : ""}</p>
                    <p className="text-sm mt-1"><span className="text-green-500 font-bold">{formatCurrency(imovel.price)}</span> <span className="text-muted">· Score <strong className="text-text">{imovel.score}</strong> · {imovel.status}</span></p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {pendente ? (
                      <button onClick={() => publicar(imovel.id)} disabled={ocupado} className="flex items-center gap-1 px-4 py-2 text-sm font-bold bg-secondary text-background rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50">
                        <PublishIcon fontSize="small" /> {ocupado ? "Publicando..." : "Publicar"}
                      </button>
                    ) : (
                      <a href={`/imovel/${imovel.id}`} className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/10 transition-colors">
                        <VisibilityIcon fontSize="small" /> Ver / Editar
                      </a>
                    )}
                    <button onClick={() => excluir(imovel.id, imovel.title)} disabled={ocupado} className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors disabled:opacity-50">
                      <DeleteIcon fontSize="small" /> Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
