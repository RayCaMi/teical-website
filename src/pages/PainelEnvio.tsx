import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ReactMarkdown from 'react-markdown';
import { supabase } from "../supabase";
import { API_URL } from "../config";
import CidadeAutocomplete from "../components/CidadeAutocomplete";

// Máscara de moeda brasileira: o usuário digita só números e vê "R$ 1.234,56"
const formatarMoeda = (digitos: string) => {
  const numero = parseInt(digitos || "0", 10) / 100;
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

interface PreviewAnalise {
  imovelId: string;
  score: number;
  analise: string;
  quartos: number;
  vagas: number;
  area: number;
  categoria: string;
}

export default function PainelEnvio() {
  const navigate = useNavigate();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewAnalise | null>(null);
  const [publicado, setPublicado] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [precoDigitos, setPrecoDigitos] = useState("");
  const [linkLeiloeiro, setLinkLeiloeiro] = useState("");
  const [edital, setEdital] = useState<File | null>(null);
  const [fotos, setFotos] = useState<FileList | null>(null);

  // Correção manual (opcional): quando preenchida, tem prioridade sobre a extração da IA
  const [quartosManual, setQuartosManual] = useState("");
  const [vagasManual, setVagasManual] = useState("");
  const [areaManual, setAreaManual] = useState("");
  const [categoriaManual, setCategoriaManual] = useState("");
  const [analiseManual, setAnaliseManual] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
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
      setLoadingAuth(false);
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const obterToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  };

  const limparFormulario = () => {
    setTitulo(""); setLocalizacao(""); setEndereco(""); setPrecoDigitos(""); setLinkLeiloeiro("");
    setEdital(null); setFotos(null);
    setQuartosManual(""); setVagasManual(""); setAreaManual("");
    setCategoriaManual(""); setAnaliseManual("");
  };

  // Lê a mensagem de erro da API quando houver; senão usa uma genérica
  const lerErro = async (response: Response, padrao: string) => {
    try {
      const corpo = await response.json();
      return typeof corpo.detail === "string" ? corpo.detail : padrao;
    } catch {
      return padrao;
    }
  };

  // ETAPA 1: envia para análise da IA (o imóvel fica Pendente, fora do site)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edital || !fotos || fotos.length === 0) {
      setErro("Por favor, anexe o PDF do edital e pelo menos uma foto.");
      return;
    }
    if (!precoDigitos || parseInt(precoDigitos, 10) === 0) {
      setErro("Informe o lance mínimo.");
      return;
    }
    setSubmitting(true);
    setErro(null);

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("localizacao", localizacao);
    formData.append("endereco", endereco);
    formData.append("preco", (parseInt(precoDigitos, 10) / 100).toFixed(2));
    formData.append("link_leiloeiro", linkLeiloeiro);
    formData.append("quartos_manual", quartosManual);
    formData.append("vagas_manual", vagasManual);
    formData.append("area_manual", areaManual);
    formData.append("categoria_manual", categoriaManual);
    formData.append("analise_manual", analiseManual);
    formData.append("edital", edital);
    Array.from(fotos).forEach(foto => formData.append("fotos", foto));

    try {
      const token = await obterToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/cadastrar-leilao/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        setErro(await lerErro(response, "Falha ao comunicar com a IA. Tente novamente."));
        return;
      }
      const data = await response.json();
      setPreview({
        imovelId: data.imovel_id,
        score: data.score_extraido,
        analise: data.analise,
        quartos: data.dados_finais_infraestrutura?.quartos ?? 0,
        vagas: data.dados_finais_infraestrutura?.vagas ?? 0,
        area: data.dados_finais_infraestrutura?.area ?? 0,
        categoria: data.dados_finais_infraestrutura?.categoria ?? "Outros",
      });
      window.scrollTo(0, 0);
    } catch {
      setErro("Falha ao comunicar com o servidor. Se for o primeiro envio do dia, o servidor pode estar acordando — aguarde um minuto e tente de novo.");
    } finally {
      setSubmitting(false);
    }
  };

  // ETAPA 2: confirma e publica no site
  const handleConfirmar = async () => {
    if (!preview) return;
    setSubmitting(true);
    setErro(null);
    try {
      const token = await obterToken();
      const response = await fetch(`${API_URL}/confirmar-leilao/${preview.imovelId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        setErro(await lerErro(response, "Não foi possível publicar. Tente novamente."));
        return;
      }
      setPublicado(true);
      setPreview(null);
      limparFormulario();
      window.scrollTo(0, 0);
    } catch {
      setErro("Falha ao comunicar com o servidor. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // Descarta o rascunho (apaga do banco e do storage)
  const handleDescartar = async () => {
    if (!preview) return;
    setSubmitting(true);
    setErro(null);
    try {
      const token = await obterToken();
      await fetch(`${API_URL}/imoveis/${preview.imovelId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Mesmo se falhar, volta ao formulário: o rascunho fica em Meus Imóveis para excluir depois
    } finally {
      setPreview(null);
      setSubmitting(false);
    }
  };

  if (loadingAuth) return <div className="min-h-screen bg-background flex items-center justify-center text-secondary font-bold">Verificando credenciais...</div>;

  const inputClasse = "bg-background border border-border rounded-xl px-4 py-3 text-text outline-none focus:border-secondary transition-colors";

  return (
    <div className="bg-background min-h-screen text-text p-6 md:p-12">
      <header className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-12 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-secondary/10 p-3 rounded-xl border border-secondary/20">
            <img src="/logo.svg" alt="Teical" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Painel do Leiloeiro</h1>
            <p className="text-muted text-sm">Cadastro oficial de ativos</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors">
            <ArrowBackIcon fontSize="small" /> Voltar ao site
          </Link>
          <Link to="/meus-imoveis" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-secondary hover:bg-secondary/10 rounded-lg transition-colors border border-secondary/30">
            <HomeWorkIcon fontSize="small" /> Meus Imóveis
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20">
            <LogoutIcon fontSize="small" /> Encerrar Sessão
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        {erro && (
          <div className="mb-8 bg-red-400/10 border border-red-400/30 text-red-400 rounded-2xl px-6 py-4 font-medium">
            {erro}
          </div>
        )}

        {publicado && !preview && (
          <div className="mb-8 bg-[#00ffcc]/10 border border-[#00ffcc]/30 rounded-2xl px-6 py-4">
            <span className="font-bold text-[#00ffcc]">✅ Imóvel publicado no site!</span>
            <span className="text-muted text-sm ml-2">Você pode vê-lo na página de imóveis ou cadastrar outro abaixo.</span>
          </div>
        )}

        {preview ? (
          /* ETAPA DE REVISÃO: mostra a análise da IA antes de publicar */
          <div className="bg-surface/80 border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-2 text-secondary">Revise a análise antes de publicar</h2>
            <p className="text-muted text-sm mb-8">O imóvel ainda <strong>não está no site</strong>. Confira a avaliação da IA abaixo e confirme a publicação — ou descarte e cadastre novamente.</p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-background border border-border rounded-2xl p-4 text-center">
                <div className="text-3xl font-black text-[#00ffcc]">{preview.score}</div>
                <div className="text-muted text-xs font-bold uppercase tracking-wider mt-1">Score Teical</div>
              </div>
              <div className="bg-background border border-border rounded-2xl p-4 text-center">
                <div className="text-3xl font-black">{preview.quartos}</div>
                <div className="text-muted text-xs font-bold uppercase tracking-wider mt-1">Quartos</div>
              </div>
              <div className="bg-background border border-border rounded-2xl p-4 text-center">
                <div className="text-3xl font-black">{preview.vagas}</div>
                <div className="text-muted text-xs font-bold uppercase tracking-wider mt-1">Vagas</div>
              </div>
              <div className="bg-background border border-border rounded-2xl p-4 text-center">
                <div className="text-3xl font-black">{preview.area}</div>
                <div className="text-muted text-xs font-bold uppercase tracking-wider mt-1">m²</div>
              </div>
              <div className="bg-background border border-border rounded-2xl p-4 text-center col-span-2 md:col-span-1">
                <div className="text-xl font-black mt-1">{preview.categoria}</div>
                <div className="text-muted text-xs font-bold uppercase tracking-wider mt-1">Categoria</div>
              </div>
            </div>

            <div className="bg-background/60 border border-border rounded-2xl p-6 mb-8 max-h-[28rem] overflow-y-auto">
              <h3 className="text-contrast font-bold uppercase tracking-widest text-sm mb-4">Parecer da IA</h3>
              <div className="prose prose-invert max-w-none text-sm">
                <ReactMarkdown>{preview.analise || "Sem parecer."}</ReactMarkdown>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleConfirmar} disabled={submitting} className="flex-1 bg-secondary hover:bg-secondary/90 text-background font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg disabled:opacity-50">
                {submitting ? "Publicando..." : "✅ Confirmar e Publicar no Site"}
              </button>
              <button onClick={handleDescartar} disabled={submitting} className="flex-1 border border-red-400/40 text-red-400 hover:bg-red-400/10 font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50">
                Descartar Rascunho
              </button>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO DE CADASTRO */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-surface/80 border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-6 text-secondary flex items-center gap-2"><CloudUploadIcon /> Detalhes do Imóvel</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-muted text-xs font-bold uppercase tracking-wider">Título do Anúncio</label>
                    <input type="text" required value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Apartamento em Pinheiros" className={inputClasse} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-muted text-xs font-bold uppercase tracking-wider">Cidade</label>
                    <CidadeAutocomplete required value={localizacao} onChange={setLocalizacao} placeholder="Comece a digitar... Ex: São Paulo - SP" className={`${inputClasse} w-full`} />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-muted text-xs font-bold uppercase tracking-wider">Endereço <span className="normal-case font-normal">(rua, número, bairro)</span></label>
                    <input type="text" value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Ex: Rua das Flores, 123 - Centro" className={inputClasse} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-muted text-xs font-bold uppercase tracking-wider">Lance Mínimo</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={precoDigitos ? formatarMoeda(precoDigitos) : ""}
                      onChange={e => setPrecoDigitos(e.target.value.replace(/\D/g, "").slice(0, 15))}
                      placeholder="R$ 0,00"
                      className={inputClasse}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-muted text-xs font-bold uppercase tracking-wider">Link Oficial do Leiloeiro</label>
                    <input type="url" required value={linkLeiloeiro} onChange={e => setLinkLeiloeiro(e.target.value)} placeholder="https://..." className={inputClasse} />
                  </div>
                </div>
                <div className="h-px bg-border my-2 w-full"></div>

                {/* CORREÇÃO MANUAL (OPCIONAL) — tem prioridade sobre a extração da IA */}
                <div>
                  <h3 className="text-muted text-xs font-bold uppercase tracking-wider mb-1">Correção Manual <span className="normal-case font-normal">(opcional — deixe em branco para a IA extrair do edital)</span></h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-muted text-xs font-bold uppercase tracking-wider">Quartos</label>
                      <input type="number" min="0" value={quartosManual} onChange={e => setQuartosManual(e.target.value)} placeholder="Auto" className={inputClasse} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-muted text-xs font-bold uppercase tracking-wider">Vagas</label>
                      <input type="number" min="0" value={vagasManual} onChange={e => setVagasManual(e.target.value)} placeholder="Auto" className={inputClasse} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-muted text-xs font-bold uppercase tracking-wider">Área (m²)</label>
                      <input type="number" min="0" step="0.01" value={areaManual} onChange={e => setAreaManual(e.target.value)} placeholder="Auto" className={inputClasse} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-muted text-xs font-bold uppercase tracking-wider">Categoria</label>
                      <select value={categoriaManual} onChange={e => setCategoriaManual(e.target.value)} className={inputClasse}>
                        <option value="">Auto (IA)</option>
                        <option value="Casa">Casa</option>
                        <option value="Apartamento">Apartamento</option>
                        <option value="Galpão">Galpão</option>
                        <option value="Lajes">Lajes</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <label className="text-muted text-xs font-bold uppercase tracking-wider">Parecer do Especialista <span className="normal-case font-normal">(opcional — exibido junto à análise da IA)</span></label>
                    <textarea rows={4} value={analiseManual} onChange={e => setAnaliseManual(e.target.value)} placeholder="Observações próprias sobre o imóvel, o edital ou a oportunidade..." className={`${inputClasse} resize-y`} />
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
                  {submitting ? "Processando Análise com IA..." : "Analisar com IA (revisão antes de publicar)"}
                </button>
              </form>
            </div>
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-surface/80 border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-2">Como funciona</h3>
                <ol className="text-sm text-muted flex flex-col gap-3 list-decimal list-inside">
                  <li>Preencha os dados e anexe o edital em PDF</li>
                  <li>A IA analisa o documento e gera o score</li>
                  <li><strong className="text-text">Você revisa a análise</strong> antes de qualquer publicação</li>
                  <li>Só depois da sua confirmação o imóvel entra no site</li>
                </ol>
              </div>
              <div className="bg-surface/80 border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-2">Status do Sistema</h3>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
                  Supabase Database: <span className="font-bold text-green-400">Online</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
