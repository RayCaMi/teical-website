import { useState, useRef, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GavelIcon from '@mui/icons-material/Gavel';
import LaunchIcon from '@mui/icons-material/Launch';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import BedIcon from '@mui/icons-material/Bed';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ReactMarkdown from 'react-markdown';

import { useNavigate } from 'react-router-dom';
import type { PropertyData } from '../types';
import { formatCurrency } from '../types';
import { supabase } from '../supabase';
import { API_URL } from '../config';

interface ImovelProps {
  data: PropertyData;
}

const formatarMoeda = (digitos: string) => {
  const numero = parseInt(digitos || "0", 10) / 100;
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export default function Imovel({ data }: ImovelProps) {
    const navigate = useNavigate();
    const [showManualAnalysis, setShowManualAnalysis] = useState(false);
    const analysisRef = useRef<HTMLDivElement>(null);

    // GERENCIAMENTO: admin edita qualquer imóvel; leiloeiro, apenas os seus
    const [podeGerenciar, setPodeGerenciar] = useState(false);
    const [editando, setEditando] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erroEdicao, setErroEdicao] = useState<string | null>(null);
    const [form, setForm] = useState({
        title: data.title,
        location: data.location,
        endereco: data.endereco ?? "",
        precoDigitos: String(Math.round((data.price || 0) * 100)),
        link_leiloeiro: data.link_leiloeiro ?? "",
        quartos: String(data.quartos ?? 0),
        vagas: String(data.vagas ?? 0),
        area: String(data.area ?? 0),
        categoria: data.categoria ?? "Outros",
        status: data.status,
        analise_manual: data.analise_manual ?? "",
    });

    useEffect(() => {
        const verificar = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const role = session.user.app_metadata?.role ?? session.user.user_metadata?.role;
            const dono = data.owner_id && data.owner_id === session.user.id;
            setPodeGerenciar(role === "admin" || (role === "leiloeiro" && !!dono));
        };
        verificar();
    }, [data.owner_id]);

    const salvarEdicao = async () => {
        setSalvando(true);
        setErroEdicao(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch(`${API_URL}/imoveis/${data.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                    title: form.title,
                    location: form.location,
                    endereco: form.endereco,
                    price: parseInt(form.precoDigitos || "0", 10) / 100,
                    link_leiloeiro: form.link_leiloeiro,
                    quartos: parseInt(form.quartos || "0", 10),
                    vagas: parseInt(form.vagas || "0", 10),
                    area: parseFloat(form.area || "0"),
                    categoria: form.categoria,
                    status: form.status,
                    analise_manual: form.analise_manual,
                }),
            });
            if (!response.ok) {
                const corpo = await response.json().catch(() => null);
                setErroEdicao(corpo?.detail ?? "Não foi possível salvar. Tente novamente.");
                return;
            }
            // Recarrega para refletir os dados novos em todo o site
            window.location.reload();
        } catch {
            setErroEdicao("Falha ao comunicar com o servidor. Tente novamente.");
        } finally {
            setSalvando(false);
        }
    };

    const excluirImovel = async () => {
        if (!window.confirm(`Excluir definitivamente "${data.title}"? As fotos também serão apagadas.`)) return;
        setSalvando(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch(`${API_URL}/imoveis/${data.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${session?.access_token}` },
            });
            if (!response.ok) throw new Error();
            window.location.href = "/imoveis";
        } catch {
            setErroEdicao("Não foi possível excluir. Tente novamente.");
            setSalvando(false);
        }
    };

    // SISTEMA DE GALERIA DE FOTOS
    // Se existir uma galeria com fotos, usamos. Se não, criamos uma lista só com a foto de capa.
    const fotosGaleria = data.galeria && data.galeria.length > 0 ? data.galeria : [data.image_url];
    const [fotoIndex, setFotoIndex] = useState(0);
    const fotoAtiva = fotosGaleria[fotoIndex];
    const irFoto = (delta: number) => setFotoIndex(i => (i + delta + fotosGaleria.length) % fotosGaleria.length);

    const handleManualClick = () => {
        setShowManualAnalysis(!showManualAnalysis);
        if (!showManualAnalysis) {
            setTimeout(() => {
                analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    return (
        <div className="bg-background min-h-screen p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-muted hover:text-secondary transition-colors mb-6 font-bold"
                >
                    <ArrowBackIcon fontSize="small" /> Voltar
                </button>

                <div className="flex flex-col lg:flex-row gap-10 mb-16">
                    
                    {/* LADO ESQUERDO: GALERIA DE FOTOS */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        {/* Foto Principal Grande com navegação */}
                        <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden rounded-2xl shadow-2xl border border-border/20 group">
                            <img
                                src={fotoAtiva}
                                alt={`${data.title} — foto ${fotoIndex + 1}`}
                                className="w-full h-full object-cover transition-all duration-500"
                            />
                            {fotosGaleria.length > 1 && (
                                <>
                                    {/* Seta anterior */}
                                    <button
                                        onClick={() => irFoto(-1)}
                                        aria-label="Foto anterior"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeftIcon />
                                    </button>
                                    {/* Seta próxima */}
                                    <button
                                        onClick={() => irFoto(1)}
                                        aria-label="Próxima foto"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRightIcon />
                                    </button>
                                    {/* Contador */}
                                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                                        {fotoIndex + 1} / {fotosGaleria.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Miniaturas (Só aparece se houver mais de 1 foto) */}
                        {fotosGaleria.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto py-2 scrollbar-thin">
                                {fotosGaleria.map((foto, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setFotoIndex(index)}
                                        className={`shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${
                                            fotoIndex === index
                                            ? 'ring-2 ring-secondary scale-105 shadow-lg'
                                            : 'opacity-50 hover:opacity-100 border border-border'
                                        }`}
                                    >
                                        <img src={foto} alt={`Foto ${index + 1}`} className="w-24 h-24 object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* LADO DIREITO: INFORMAÇÕES DO IMÓVEL */}
                    <div className="flex flex-col gap-4 w-full lg:w-1/2">
                        <h1 className="text-text font-black text-3xl leading-tight mb-2">
                            {data.title}
                        </h1>

                        {/* INFORMAÇÕES BÁSICAS COM DADOS REAIS DA IA */}
                        <div className="grid grid-cols-3 gap-3 mb-2">
                            <div className="bg-surface/60 border border-border p-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm">
                                <BedIcon className="text-secondary" fontSize="small" />
                                <span className="text-text font-bold text-xs uppercase tracking-wider text-center">
                                    {data.quartos ? `${data.quartos} Quartos` : 'Sem info'}
                                </span>
                            </div>
                            <div className="bg-surface/60 border border-border p-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm">
                                <DirectionsCarIcon className="text-secondary" fontSize="small" />
                                <span className="text-text font-bold text-xs uppercase tracking-wider text-center">
                                    {data.vagas ? `${data.vagas} Vagas` : 'Sem Vaga'}
                                </span>
                            </div>
                            <div className="bg-surface/60 border border-border p-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm">
                                <SquareFootIcon className="text-secondary" fontSize="small" />
                                <span className="text-text font-bold text-xs uppercase tracking-wider text-center">
                                    {data.area ? `${data.area} m²` : 'Não informada'}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-surface/95 w-full h-auto rounded-2xl border border-border py-4 px-5 shadow-sm">
                            <h3 className="text-secondary-dark flex items-center font-bold text-sm">
                                <LocationPinIcon className="mr-3" fontSize="small" /> Endereço
                            </h3>
                            <h3 className="text-text font-bold text-sm text-right">
                                {data.endereco ? `${data.endereco} · ${data.location}` : data.location}
                            </h3>
                        </div>

                        <div className="flex justify-between items-center bg-surface/95 w-full h-auto rounded-2xl border border-border py-4 px-5 shadow-sm">
                            <h3 className="text-secondary-dark flex items-center font-bold text-sm">
                                <AttachMoneyIcon className="mr-3" fontSize="small" /> Lance Inicial
                            </h3>
                            <div className="flex flex-col items-end">
                                <span className="text-green-500 text-2xl font-black leading-none">
                                    {formatCurrency(data.price)}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between border w-full h-auto rounded-2xl py-3 px-5 transition-colors bg-yellow-900/20 border-yellow-500/50 text-yellow-500">
                            <h3 className="flex items-center font-bold text-sm">
                                <div className="w-2.5 h-2.5 rounded-full inline-block mr-3 animate-pulse bg-yellow-400"/>
                                Status: {data.status}
                            </h3>
                        </div>

                        <div className="flex flex-col justify-between bg-surface/95 w-full h-auto rounded-2xl border border-border py-4 px-5 shadow-sm mt-2">
                            <h3 className="text-secondary-dark flex items-center mb-3 font-bold text-sm">
                                <TextSnippetIcon className="mr-3" fontSize="small" /> Análise Teical AI
                            </h3>
                            <button 
                                onClick={handleManualClick}
                                className={`w-full rounded-xl font-bold border transition-all py-3 ${
                                    showManualAnalysis 
                                    ? 'bg-contrast/50 text-text border-contrast' 
                                    : 'text-contrast border-contrast bg-contrast/5 hover:bg-contrast/10 hover:shadow-md'
                                }`}
                            >
                                Ler Parecer Jurídico da IA
                            </button>
                        </div>

                        {data.link_leiloeiro && (
                          <a href={data.link_leiloeiro} target="_blank" rel="noreferrer" className="mt-2 relative flex justify-center items-center gap-3 bg-secondary hover:bg-secondary-light text-background w-full h-auto rounded-2xl py-4 px-3 transition-all duration-300 shadow-lg shadow-secondary/20 group">
                              <h3 className="font-black text-lg flex items-center tracking-wide">
                                  <GavelIcon className="mr-3" /> ACESSAR LEILÃO OFICIAL
                                  <LaunchIcon className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity" fontSize="small"/>
                              </h3>
                          </a>
                        )}

                        {/* GERENCIAMENTO (admin ou leiloeiro dono) */}
                        {podeGerenciar && (
                            <div className="mt-4 border border-dashed border-border rounded-2xl p-4">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-muted text-xs font-bold uppercase tracking-widest">Gerenciar Imóvel</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditando(!editando); setErroEdicao(null); }} className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/10 transition-colors">
                                            <EditIcon fontSize="small" /> {editando ? "Fechar edição" : "Editar"}
                                        </button>
                                        <button onClick={excluirImovel} disabled={salvando} className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors disabled:opacity-50">
                                            <DeleteIcon fontSize="small" /> Excluir
                                        </button>
                                    </div>
                                </div>

                                {editando && (
                                    <div className="mt-4 flex flex-col gap-3">
                                        {erroEdicao && <p className="text-red-400 text-sm font-medium">{erroEdicao}</p>}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider">Título
                                                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-background border border-border rounded-xl px-3 py-2 text-text text-sm font-normal normal-case outline-none focus:border-secondary" />
                                            </label>
                                            <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider">Cidade - UF
                                                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="bg-background border border-border rounded-xl px-3 py-2 text-text text-sm font-normal normal-case outline-none focus:border-secondary" />
                                            </label>
                                            <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider sm:col-span-2">Endereço
                                                <input type="text" value={form.endereco} onChange={e => setForm({ ...form, endereco: e.target.value })} className="bg-background border border-border rounded-xl px-3 py-2 text-text text-sm font-normal normal-case outline-none focus:border-secondary" />
                                            </label>
                                            <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider">Lance Mínimo
                                                <input type="text" inputMode="numeric" value={form.precoDigitos ? formatarMoeda(form.precoDigitos) : ""} onChange={e => setForm({ ...form, precoDigitos: e.target.value.replace(/\D/g, "").slice(0, 15) })} className="bg-background border border-border rounded-xl px-3 py-2 text-text text-sm font-normal normal-case outline-none focus:border-secondary" />
                                            </label>
                                            <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider">Link do Leiloeiro
                                                <input type="url" value={form.link_leiloeiro} onChange={e => setForm({ ...form, link_leiloeiro: e.target.value })} className="bg-background border border-border rounded-xl px-3 py-2 text-text text-sm font-normal normal-case outline-none focus:border-secondary" />
                                            </label>
                                            <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider">Quartos
                                                <input type="number" min="0" value={form.quartos} onChange={e => setForm({ ...form, quartos: e.target.value })} className="bg-background border border-border rounded-xl px-3 py-2 text-text text-sm font-normal normal-case outline-none focus:border-secondary" />
                                            </label>
                                            <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider">Vagas
                                                <input type="number" min="0" value={form.vagas} onChange={e => setForm({ ...form, vagas: e.target.value })} className="bg-background border border-border rounded-xl px-3 py-2 text-text text-sm font-normal normal-case outline-none focus:border-secondary" />
                                            </label>
                                            <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider">Área (m²)
                                                <input type="number" min="0" step="0.01" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} className="bg-background border border-border rounded-xl px-3 py-2 text-text text-sm font-normal normal-case outline-none focus:border-secondary" />
                                            </label>
                                            <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider">Categoria
                                                <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} className="bg-background border border-border rounded-xl px-3 py-2 text-text text-sm font-normal normal-case outline-none focus:border-secondary">
                                                    <option value="Casa">Casa</option>
                                                    <option value="Apartamento">Apartamento</option>
                                                    <option value="Galpão">Galpão</option>
                                                    <option value="Lajes">Lajes</option>
                                                    <option value="Outros">Outros</option>
                                                </select>
                                            </label>
                                            <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider">Status
                                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="bg-background border border-border rounded-xl px-3 py-2 text-text text-sm font-normal normal-case outline-none focus:border-secondary">
                                                    <option value="Em Leilão">Em Leilão</option>
                                                    <option value="Desocupado">Desocupado</option>
                                                    <option value="Arrematado">Arrematado</option>
                                                </select>
                                            </label>
                                        </div>
                                        <label className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-wider">Parecer do Especialista
                                            <textarea rows={5} value={form.analise_manual} onChange={e => setForm({ ...form, analise_manual: e.target.value })} placeholder="Parecer manual exibido junto à análise da IA (aceita Markdown)" className="bg-background border border-border rounded-xl px-3 py-2 text-text text-sm font-normal normal-case outline-none focus:border-secondary resize-y" />
                                        </label>
                                        <button onClick={salvarEdicao} disabled={salvando} className="bg-secondary hover:bg-secondary/90 text-background font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50">
                                            {salvando ? "Salvando..." : "Salvar alterações"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ABA DE ANÁLISE DA IA */}
                {showManualAnalysis && (
                    <div ref={analysisRef} className="animate-in fade-in slide-in-from-top-4 duration-500 max-w-4xl mx-auto pb-20">
                        <div className="bg-contrast/10 border border-contrast/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-contrast/5 blur-[100px] rounded-full pointer-events-none" />
                            <h2 className="text-contrast font-display text-2xl text-center mb-8 uppercase tracking-widest font-black">
                                Parecer de Inteligência Artificial
                            </h2>
                            <div className="text-text leading-relaxed prose prose-invert max-w-none text-sm md:text-base">
                                <ReactMarkdown>{data.memorial_analise || "Análise não disponível para este ativo."}</ReactMarkdown>
                            </div>
                        </div>

                        {/* PARECER MANUAL DO ESPECIALISTA (só aparece quando o leiloeiro escreveu um) */}
                        {data.analise_manual && (
                            <div className="mt-8 bg-secondary/10 border border-secondary/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                                <h2 className="text-secondary font-display text-2xl text-center mb-8 uppercase tracking-widest font-black">
                                    Parecer do Especialista
                                </h2>
                                <div className="text-text leading-relaxed prose prose-invert max-w-none text-sm md:text-base">
                                    <ReactMarkdown>{data.analise_manual}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}