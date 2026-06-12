import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { supabase } from "../supabase";

export default function PainelEnvio() {
  const navigate = useNavigate();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successScore, setSuccessScore] = useState<number | null>(null);

  const [titulo, setTitulo] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [preco, setPreco] = useState("");
  const [linkLeiloeiro, setLinkLeiloeiro] = useState("");
  const [edital, setEdital] = useState<File | null>(null);
  const [fotos, setFotos] = useState<FileList | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      const role = session.user.user_metadata?.role;
      if (role !== "leiloeiro" && role !== "admin") {
        navigate("/");
        return;
      }
      setLoadingAuth(false);
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edital || !fotos || fotos.length === 0) {
      alert("Por favor, anexe o PDF do edital e pelo menos uma foto.");
      return;
    }
    setSubmitting(true);
    setSuccessScore(null);

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("localizacao", localizacao);
    formData.append("preco", preco);
    formData.append("link_leiloeiro", linkLeiloeiro);
    formData.append("edital", edital);
    Array.from(fotos).forEach(foto => formData.append("fotos", foto));

    try {
      const response = await fetch("http://127.0.0.1:8000/cadastrar-leilao/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Erro no servidor");
      const data = await response.json();
      setSuccessScore(data.score_extraido);
      
      setTitulo(""); setLocalizacao(""); setPreco(""); setLinkLeiloeiro("");
      setEdital(null); setFotos(null);
    } catch (error) {
      alert("Falha ao comunicar com a IA. Verifique se o backend Python está ligado.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingAuth) return <div className="min-h-screen bg-background flex items-center justify-center text-secondary font-bold">Verificando credenciais...</div>;

  return (
    <div className="bg-background min-h-screen text-text p-6 md:p-12">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-12 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-secondary/10 p-3 rounded-xl border border-secondary/20">
            <img src="/logo.svg" alt="Teical" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Painel do Leiloeiro</h1>
            <p className="text-muted text-sm">Cadastro oficial de ativos</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20">
          <LogoutIcon fontSize="small" /> Encerrar Sessão
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface/80 border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-6 text-secondary flex items-center gap-2"><CloudUploadIcon /> Detalhes do Imóvel</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-muted text-xs font-bold uppercase tracking-wider">Título do Anúncio</label>
                <input type="text" required value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Apartamento em Pinheiros" className="bg-background border border-border rounded-xl px-4 py-3 text-text outline-none focus:border-secondary transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-muted text-xs font-bold uppercase tracking-wider">Localização (Cidade - UF)</label>
                <input type="text" required value={localizacao} onChange={e => setLocalizacao(e.target.value)} placeholder="Ex: São Paulo - SP" className="bg-background border border-border rounded-xl px-4 py-3 text-text outline-none focus:border-secondary transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-muted text-xs font-bold uppercase tracking-wider">Lance Mínimo (R$)</label>
                <input type="number" required value={preco} onChange={e => setPreco(e.target.value)} placeholder="Apenas números" className="bg-background border border-border rounded-xl px-4 py-3 text-text outline-none focus:border-secondary transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-muted text-xs font-bold uppercase tracking-wider">Link Oficial do Leiloeiro</label>
                <input type="url" required value={linkLeiloeiro} onChange={e => setLinkLeiloeiro(e.target.value)} placeholder="https://..." className="bg-background border border-border rounded-xl px-4 py-3 text-text outline-none focus:border-secondary transition-colors" />
              </div>
            </div>
            <div className="h-px bg-border my-2 w-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 p-4 border border-dashed border-border rounded-xl bg-background/50 hover:border-secondary/50 transition-colors">
                <label className="text-secondary text-sm font-bold cursor-pointer block">📄 Anexar Edital (PDF)
                  <input type="file" required accept="application/pdf" onChange={e => setEdital(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-secondary/10 file:text-secondary cursor-pointer" />
                </label>
              </div>
              <div className="flex flex-col gap-2 p-4 border border-dashed border-border rounded-xl bg-background/50 hover:border-secondary/50 transition-colors">
                <label className="text-secondary text-sm font-bold cursor-pointer block">🖼️ Anexar Fotos
                  <input type="file" required accept="image/*" multiple onChange={e => setFotos(e.target.files)} className="mt-2 block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-secondary/10 file:text-secondary cursor-pointer" />
                </label>
              </div>
            </div>
            <button disabled={submitting} type="submit" className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-background font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg disabled:opacity-50">
              {submitting ? "Processando Análise com IA..." : "Analisar e Publicar Imóvel"}
            </button>
          </form>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-surface/80 border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-2">Status do Sistema</h3>
            <p className="text-sm text-muted mb-4">Servidor de Inteligência Artificial e Banco de Dados.</p>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
              Supabase Database: <span className="font-bold text-green-400">Online</span>
            </div>
          </div>
          {successScore !== null && (
            <div className="bg-[#00ffcc]/10 border border-[#00ffcc]/30 rounded-3xl p-8 shadow-xl animate-pulse">
              <h3 className="text-lg font-bold text-[#00ffcc] mb-2">✅ Imóvel Publicado!</h3>
              <p className="text-sm text-muted">A IA da Teical avaliou o edital e gerou o Score final.</p>
              <div className="mt-4 text-4xl font-black text-[#00ffcc]">Score: {successScore}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}