import { useState, useRef } from 'react'; // Adicionado useRef para scroll suave
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GavelIcon from '@mui/icons-material/Gavel';
import LaunchIcon from '@mui/icons-material/Launch';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

import { Link, useNavigate } from 'react-router-dom';
import type { PropertyData } from '../types';
import { formatCurrency } from '../types';

interface ImovelProps {
  data: PropertyData;
}

export default function Imovel({ data }: ImovelProps) {
    const navigate = useNavigate();
    const [showManualAnalysis, setShowManualAnalysis] = useState(false);
    const analysisRef = useRef<HTMLDivElement>(null);

    const handleManualClick = () => {
        setShowManualAnalysis(!showManualAnalysis);
        if (!showManualAnalysis) {
            setTimeout(() => {
                analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    const statusInfo = {
        green: { label: 'Desocupado', class: 'bg-green-900 border-green-500 text-green-400', dot: 'bg-green-400' },
        yellow: { label: 'Ocupado', class: 'bg-yellow-900/30 border-yellow-500 text-yellow-400', dot: 'bg-yellow-400' },
        red: { label: 'Financiamento Indisponível', class: 'bg-red-900/30 border-red-500 text-red-400', dot: 'bg-red-400' }
    };

    const currentStatus = statusInfo[data.status];

    return (
        <div className="bg-background min-h-screen p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-muted hover:text-secondary transition-colors mb-6"
                >
                    <ArrowBackIcon fontSize="small" />
                    Voltar
                </button>

                <div className="flex flex-col lg:flex-row gap-10 mb-16">
                    <img
                        src={data.fotos[0]}
                        alt={data.nome}
                        className="w-full lg:w-125 h-100 object-cover rounded-2xl shadow-2xl border border-border/20"
                    />

                    <div className="flex flex-col gap-3 w-full">
                        <h1 className="text-text font-bold text-2xl leading-tight pr-4">
                            {data.nome}
                        </h1>

                        <div className="flex justify-between items-center bg-surface/95 w-full h-auto rounded-3xl border border-border py-3 px-5">
                            <h3 className="text-secondary-dark flex items-center">
                                <LocationPinIcon className="mr-3" fontSize="small" />
                                Localização
                            </h3>
                            <h3 className="text-text font-bold text-sm">
                                {data.bairro ? `${data.bairro}, ` : ''}{data.cidade}/{data.uf}
                            </h3>
                        </div>

                        <div className="flex justify-between items-center bg-surface/95 w-full h-auto rounded-3xl border border-border py-3 px-5">
                            <h3 className="text-secondary-dark flex items-center">
                                <AttachMoneyIcon className="mr-3" fontSize="small" />
                                Valor
                            </h3>
                            <div className="flex flex-col items-end">
                                <span className="text-muted text-xs line-through decoration-gray-500 leading-none">
                                    {formatCurrency(data.precoAvaliacao)}
                                </span>
                                <span className="text-green-500 text-2xl font-black leading-none mt-1">
                                    {formatCurrency(data.precoAtual)}
                                </span>
                            </div>
                        </div>

                        <div className={`flex justify-between border w-full h-auto rounded-3xl py-3 px-5 transition-colors ${currentStatus.class}`}>
                            <h3 className="flex items-center font-bold">
                                <div className={`w-3 h-3 rounded-full inline-block mr-3 animate-pulse ${currentStatus.dot}`}/>
                                {currentStatus.label}
                            </h3>
                        </div>

                        <div className="flex flex-col justify-between bg-surface/95 w-full h-auto rounded-3xl border border-border py-4 px-5">
                            <h3 className="text-secondary-dark flex items-center mb-2">
                                <TextSnippetIcon className="mr-3" fontSize="small" />
                                Análise de Edital
                            </h3>
                            <div className="flex w-full gap-3">
                                <button 
                                    onClick={handleManualClick}
                                    className={`w-full rounded-2xl font-bold border transition-all py-2 ${
                                        showManualAnalysis 
                                        ? 'bg-contrast/50 text-text border-contrast' 
                                        : 'text-contrast border-contrast bg-contrast/10 hover:bg-secondary-dark/40'
                                    }`}
                                >
                                    Manual
                                </button>
                                <button className="w-full rounded-2xl font-bold text-primary border border-secondary bg-secondary py-2 hover:bg-secondary-light transition-all shadow-lg shadow-secondary/10">
                                    Inteligente
                                </button>
                            </div>
                        </div>

                        <Link to="/" className="relative flex justify-center items-center gap-3 bg-surface/95 w-full h-auto rounded-3xl border border-border py-4 px-3 hover:bg-secondary/10 transition-all duration-200 group">
                            <h3 className="text-contrast font-black text-lg flex items-center">
                                <GavelIcon className="mr-3" />
                                DAR LANCE
                                <LaunchIcon className="absolute right-6 opacity-50 group-hover:opacity-100 transition-opacity" fontSize="small"/>
                            </h3>
                        </Link>
                    </div>
                </div>

                {showManualAnalysis && (
                    <div 
                        ref={analysisRef}
                        className="animate-in fade-in slide-in-from-top-4 duration-500 max-w-4xl mx-auto"
                    >
                        <div className="bg-contrast/20 border border-contrast/30 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                            {/* Glow decorativo de fundo */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-contrast/5 blur-[100px] rounded-full pointer-events-none" />

                            <h2 className="text-contrast font-display text-3xl text-center mb-10 uppercase tracking-wide">
                                Análise Manual
                            </h2>

                            <div className="space-y-8 text-text leading-relaxed">
                                <section>
                                    <h4 className="text-contrast font-bold mb-4 flex items-center gap-2">
                                        **Memorial de Análise Estratégica — {data.nome}**
                                    </h4>
                                    <p className="opacity-80">
                                        A equipe técnica da Teical realizou a triagem completa do edital deste leilão. Abaixo, sistematizamos os pontos críticos para a sua tomada de decisão.
                                    </p>
                                </section>

                                <section>
                                    <h4 className="text-contrast font-bold mb-3 uppercase tracking-tighter text-sm">
                                        **1. Tipo de Leilão**
                                    </h4>
                                    <ul className="list-disc list-inside space-y-2 opacity-90 pl-2">
                                        <li>O leilão em questão é **extrajudicial**, pois a venda é realizada por um credor (banco ou instituição financeira) sem a necessidade de decisão judicial.</li>
                                        <li>Trata-se de uma **1ª PRAÇA**, o que significa que este é o primeiro leilão e o imóvel está com valor máximo inicial.</li>
                                        <li>O leiloeiro responsável será anunciado no edital e a plataforma de lances também será especificada nesse documento.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h4 className="text-contrast font-bold mb-3 uppercase tracking-tighter text-sm">
                                        **2. Observações Importantes**
                                    </h4>
                                    <p className="opacity-90">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    </p>
                                </section>
                                
                                {/* Link para o Edital */}
                                <div className="pt-8 border-t border-contrast/30 flex justify-center">
                                    <a 
                                        href="#" 
                                        target="_blank"
                                        className="flex items-center gap-3 bg-contrast/20 hover:bg-contrast/40 text-contrast border border-contrast/50 px-8 py-4 rounded-2xl transition-all font-bold uppercase text-xs tracking-widest group"
                                    >
                                        Acessar Edital Completo
                                        <LaunchIcon fontSize="inherit" className="group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}