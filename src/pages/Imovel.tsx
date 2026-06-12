import { useState, useRef } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GavelIcon from '@mui/icons-material/Gavel';
import LaunchIcon from '@mui/icons-material/Launch';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import BedIcon from '@mui/icons-material/Bed';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import ReactMarkdown from 'react-markdown';

import { useNavigate } from 'react-router-dom';
import type { PropertyData } from '../types';
import { formatCurrency } from '../types';

interface ImovelProps {
  data: PropertyData;
}

export default function Imovel({ data }: ImovelProps) {
    const navigate = useNavigate();
    const [showManualAnalysis, setShowManualAnalysis] = useState(false);
    const analysisRef = useRef<HTMLDivElement>(null);

    // SISTEMA DE GALERIA DE FOTOS
    // Se existir uma galeria com fotos, usamos. Se não, criamos uma lista só com a foto de capa.
    const fotosGaleria = data.galeria && data.galeria.length > 0 ? data.galeria : [data.image_url];
    const [fotoAtiva, setFotoAtiva] = useState(fotosGaleria[0]);

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
                        {/* Foto Principal Grande */}
                        <div className="w-full h-[400px] lg:h-[500px] overflow-hidden rounded-2xl shadow-2xl border border-border/20">
                            <img
                                src={fotoAtiva}
                                alt={data.title}
                                className="w-full h-full object-cover transition-all duration-500"
                            />
                        </div>
                        
                        {/* Miniaturas (Só aparece se houver mais de 1 foto) */}
                        {fotosGaleria.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto py-2 scrollbar-thin">
                                {fotosGaleria.map((foto, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setFotoAtiva(foto)}
                                        className={`shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${
                                            fotoAtiva === foto 
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
                                {data.location}
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
                    </div>
                )}
            </div>
        </div>
    );
}