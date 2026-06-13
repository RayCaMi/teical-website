import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from "../supabase";
import { API_URL } from "../config";
import { mapNews, type NewsData, type NewsRow } from "../types";

const CATEGORIAS = ['Leilões', 'Direito Imobiliário', 'Mercado', 'Jurisprudência', 'Tributário', 'Tecnologia'];

const formVazio = {
  titulo: "", resumo: "", conteudo: "", categoria: "Leilões",
  autor: "", imagem_url: "", leitura_minutos: "3",
  is_novo: false, is_tendencia: false,
};

export default function GerenciarNoticias() {
  const navigate = useNavigate();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [noticias, setNoticias] = useState<NewsData[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const [editandoId, setEditandoId] = useState<string | null>(null); // null = nenhum form aberto
  const [form, setForm] = useState(formVazio);
  const [imagem, setImagem] = useState<File | null>(null);

  const obterToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  };

  const carregar = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (data) setNoticias((data as NewsRow[]).map(mapNews));
    setLoading(false);
  }, []);

  useEffect(() => {
    const iniciar = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      const role = session.user.app_metadata?.role ?? session.user.user_metadata?.role;
      if (role !== "leiloeiro" && role !== "admin") { navigate("/"); return; }
      setLoadingAuth(false);
      carregar();
    };
    iniciar();
  }, [navigate, carregar]);

  const abrirNova = () => {
    setForm(formVazio);
    setImagem(null);
    setEditandoId("nova");
    setErro(null);
  };

  const abrirEdicao = (n: NewsData) => {
    setForm({
      titulo: n.titulo, resumo: n.resumo, conteudo: n.conteudo ?? "",
      categoria: n.categoria, autor: n.autor, imagem_url: n.imagemUrl,
      leitura_minutos: String(n.leituraMinutos), is_novo: !!n.isNovo, is_tendencia: !!n.isTendencia,
    });
    setImagem(null);
    setEditandoId(n.id);
    setErro(null);
    window.scrollTo(0, 0);
  };

  const lerErro = async (r: Response, padrao: string) => {
    try { const c = await r.json(); return typeof c.detail === "string" ? c.detail : padrao; }
    catch { return padrao; }
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo || !form.resumo || !form.conteudo || !form.autor) {
      setErro("Preencha título, resumo, conteúdo e autor.");
      return;
    }
    if (editandoId === "nova" && !imagem && !form.imagem_url.trim()) {
      setErro("Adicione uma imagem de capa (arquivo ou URL).");
      return;
    }
    setSalvando(true);
    setErro(null);
    try {
      const token = await obterToken();
      let response: Response;

      if (editandoId === "nova") {
        // Criação: multipart (permite upload de arquivo)
        const fd = new FormData();
        fd.append("titulo", form.titulo);
        fd.append("resumo", form.resumo);
        fd.append("conteudo", form.conteudo);
        fd.append("categoria", form.categoria);
        fd.append("autor", form.autor);
        fd.append("leitura_minutos", form.leitura_minutos || "3");
        fd.append("is_novo", String(form.is_novo));
        fd.append("is_tendencia", String(form.is_tendencia));
        fd.append("imagem_url", form.imagem_url);
        if (imagem) fd.append("imagem", imagem);
        response = await fetch(`${API_URL}/noticias/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      } else {
        // Edição: JSON (capa alterável por URL)
        response = await fetch(`${API_URL}/noticias/${editandoId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            titulo: form.titulo, resumo: form.resumo, conteudo: form.conteudo,
            categoria: form.categoria, autor: form.autor, imagem_url: form.imagem_url,
            leitura_minutos: parseInt(form.leitura_minutos || "3", 10),
            is_novo: form.is_novo, is_tendencia: form.is_tendencia,
          }),
        });
      }

      if (!response.ok) { setErro(await lerErro(response, "Não foi possível salvar.")); return; }
      setEditandoId(null);
      await carregar();
    } catch {
      setErro("Falha ao comunicar com o servidor. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id: string, titulo: string) => {
    if (!window.confirm(`Excluir a notícia "${titulo}"?`)) return;
    try {
      const token = await obterToken();
      const r = await fetch(`${API_URL}/noticias/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error();
      await carregar();
    } catch {
      setErro("Não foi possível excluir a notícia.");
    }
  };

  if (loadingAuth) return <div className="min-h-screen bg-background flex items-center justify-center text-secondary font-bold">Verificando credenciais...</div>;

  const inputClasse = "bg-background border border-border rounded-xl px-4 py-3 text-text outline-none focus:border-secondary transition-colors w-full";

  return (
    <div className="bg-background min-h-screen text-text p-6 md:p-12">
      <header className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-10 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Gerenciar Notícias</h1>
          <p className="text-muted text-sm">Crie, edite e remova artigos do portal</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {editandoId === null && (
            <button onClick={abrirNova} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-secondary text-background rounded-lg hover:bg-secondary/90 transition-colors">
              <AddIcon fontSize="small" /> Nova notícia
            </button>
          )}
          <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors">
            <ArrowBackIcon fontSize="small" /> Voltar ao site
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {erro && <div className="mb-6 bg-red-400/10 border border-red-400/30 text-red-400 rounded-2xl px-6 py-4 font-medium">{erro}</div>}

        {editandoId !== null ? (
          <form onSubmit={salvar} className="bg-surface/80 border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-5">
            <h2 className="text-xl font-bold text-secondary">{editandoId === "nova" ? "Nova notícia" : "Editar notícia"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="flex flex-col gap-2 text-muted text-xs font-bold uppercase tracking-wider md:col-span-2">Título
                <input type="text" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} className={`${inputClasse} normal-case font-normal`} />
              </label>
              <label className="flex flex-col gap-2 text-muted text-xs font-bold uppercase tracking-wider">Categoria
                <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} className={`${inputClasse} normal-case font-normal`}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-muted text-xs font-bold uppercase tracking-wider">Autor
                <input type="text" value={form.autor} onChange={e => setForm({ ...form, autor: e.target.value })} className={`${inputClasse} normal-case font-normal`} />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-muted text-xs font-bold uppercase tracking-wider">Resumo <span className="normal-case font-normal">(aparece nos cards)</span>
              <textarea rows={2} value={form.resumo} onChange={e => setForm({ ...form, resumo: e.target.value })} className={`${inputClasse} normal-case font-normal resize-y`} />
            </label>
            <label className="flex flex-col gap-2 text-muted text-xs font-bold uppercase tracking-wider">Conteúdo <span className="normal-case font-normal">(corpo do artigo — aceita Markdown: ## títulos, **negrito**, listas)</span>
              <textarea rows={12} value={form.conteudo} onChange={e => setForm({ ...form, conteudo: e.target.value })} className={`${inputClasse} normal-case font-normal resize-y font-mono text-sm`} />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="flex flex-col gap-2 text-muted text-xs font-bold uppercase tracking-wider">Tempo de leitura (min)
                <input type="number" min="1" value={form.leitura_minutos} onChange={e => setForm({ ...form, leitura_minutos: e.target.value })} className={`${inputClasse} normal-case font-normal`} />
              </label>
              <div className="flex items-end gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_novo} onChange={e => setForm({ ...form, is_novo: e.target.checked })} className="w-4 h-4 accent-secondary" /> Marcar como "Novo"
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_tendencia} onChange={e => setForm({ ...form, is_tendencia: e.target.checked })} className="w-4 h-4 accent-secondary" /> Tendência
                </label>
              </div>
            </div>

            {/* Imagem de capa: upload (só na criação) ou URL */}
            <div className="border border-dashed border-border rounded-xl p-4">
              <p className="text-muted text-xs font-bold uppercase tracking-wider mb-3">Imagem de capa</p>
              {editandoId === "nova" && (
                <input type="file" accept="image/*" onChange={e => setImagem(e.target.files?.[0] || null)} className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-secondary/10 file:text-secondary cursor-pointer mb-3" />
              )}
              <input type="url" value={form.imagem_url} onChange={e => setForm({ ...form, imagem_url: e.target.value })} placeholder={editandoId === "nova" ? "...ou cole uma URL de imagem" : "URL da imagem de capa"} className={`${inputClasse} normal-case font-normal`} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button type="submit" disabled={salvando} className="flex-1 bg-secondary hover:bg-secondary/90 text-background font-bold py-4 px-6 rounded-2xl transition-all shadow-lg disabled:opacity-50">
                {salvando ? "Salvando..." : "Salvar notícia"}
              </button>
              <button type="button" onClick={() => setEditandoId(null)} className="flex-1 border border-border text-muted hover:text-text font-bold py-4 px-6 rounded-2xl transition-all">
                Cancelar
              </button>
            </div>
          </form>
        ) : loading ? (
          <div className="py-20 text-center text-secondary font-bold">Carregando...</div>
        ) : noticias.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl">
            <p className="text-muted mb-4">Nenhuma notícia ainda.</p>
            <button onClick={abrirNova} className="text-secondary font-bold hover:underline">Criar a primeira →</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {noticias.map(n => (
              <div key={n.id} className="bg-surface/80 border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
                <img src={n.imagemUrl} alt={n.titulo} className="w-full sm:w-24 h-28 sm:h-16 object-cover rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-secondary">{n.categoria}</span>
                  <h3 className="font-bold truncate">{n.titulo}</h3>
                  <p className="text-muted text-xs">{n.autor} · {n.data}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => abrirEdicao(n)} className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/10 transition-colors">
                    <EditIcon fontSize="small" /> Editar
                  </button>
                  <button onClick={() => excluir(n.id, n.titulo)} className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors">
                    <DeleteIcon fontSize="small" /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
