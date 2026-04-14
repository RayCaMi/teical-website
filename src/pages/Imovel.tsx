import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GavelIcon from '@mui/icons-material/Gavel';
import LaunchIcon from '@mui/icons-material/Launch';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

import { Link, useNavigate } from 'react-router-dom';
import type { PropertyData } from '../types'; // Importe suas definições
import { formatCurrency } from '../types'; // Importe suas definições

interface ImovelProps {
  data: PropertyData;
}

export default function Imovel({ data }: ImovelProps) {
    const navigate = useNavigate();

    // Mapeamento de labels e cores para o status
    const statusInfo = {
        green: { label: 'Desocupado', class: 'bg-green-900 border-green-500 text-green-400', dot: 'bg-green-400' },
        yellow: { label: 'Ocupado', class: 'bg-yellow-900/30 border-yellow-500 text-yellow-400', dot: 'bg-yellow-400' },
        red: { label: 'Financiamento Indisponível', class: 'bg-red-900/30 border-red-500 text-red-400', dot: 'bg-red-400' }
    };

    const currentStatus = statusInfo[data.status];

    return (
        <div className="bg-primary min-h-screen p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                {/* Botão Voltar usando navigate(-1) para manter o histórico */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-400 hover:text-secondary transition-colors mb-6"
                >
                    <ArrowBackIcon fontSize="small" />
                    Voltar
                </button>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Imagem Principal do Mock */}
                    <img
                        src={data.fotos[0]}
                        alt={data.nome}
                        className="w-full lg:w-125 h-100 object-cover rounded-2xl shadow-2xl"
                    />

                    <div className="flex flex-col gap-3 w-full">
                        {/* Nome Dinâmico */}
                        <h1 className="text-gray-200 font-bold text-2xl leading-tight pr-4">
                            {data.nome}
                        </h1>

                        {/* Localização Dinâmica */}
                        <div className="flex justify-between items-center bg-primary-dark/90 w-full h-auto rounded-3xl border border-secondary-dark py-3 px-5">
                            <h3 className="text-secondary-dark flex items-center">
                                <LocationPinIcon className="mr-3" fontSize="small" />
                                Localização
                            </h3>
                            <h3 className="text-gray-200 font-bold text-sm">
                                {data.bairro ? `${data.bairro}, ` : ''}{data.cidade}/{data.uf}
                            </h3>
                        </div>

                        {/* Valores Dinâmicos */}
                        <div className="flex justify-between items-center bg-primary-dark/90 w-full h-auto rounded-3xl border border-secondary-dark py-3 px-5">
                            <h3 className="text-secondary-dark flex items-center">
                                <AttachMoneyIcon className="mr-3" fontSize="small" />
                                Valor
                            </h3>
                            <div className="flex flex-col items-end">
                                <span className="text-gray-500 text-xs line-through decoration-gray-500 leading-none">
                                    {formatCurrency(data.precoAvaliacao)}
                                </span>
                                <span className="text-green-500 text-2xl font-black leading-none mt-1">
                                    {formatCurrency(data.precoAtual)}
                                </span>
                            </div>
                        </div>

                        {/* Status Dinâmico */}
                        <div className={`flex justify-between border w-full h-auto rounded-3xl py-3 px-5 transition-colors ${currentStatus.class}`}>
                            <h3 className="flex items-center font-bold">
                                <div className={`w-3 h-3 rounded-full inline-block mr-3 animate-pulse ${currentStatus.dot}`}/>
                                {currentStatus.label}
                            </h3>
                        </div>

                        {/* Análise de Edital */}
                        <div className="flex flex-col justify-between bg-primary-dark/90 w-full h-auto rounded-3xl border border-secondary-dark py-4 px-5">
                            <h3 className="text-secondary-dark flex items-center mb-2">
                                <TextSnippetIcon className="mr-3" fontSize="small" />
                                Análise de Edital
                            </h3>
                            <div className="flex w-full gap-3">
                                <button className="w-full rounded-2xl font-bold text-secondary-light border border-secondary-dark bg-secondary-dark/10 py-2 hover:bg-secondary-dark/40 transition-all">
                                    Manual
                                </button>
                                <button className="w-full rounded-2xl font-bold text-primary border border-secondary bg-secondary py-2 hover:bg-secondary-light transition-all shadow-lg shadow-secondary/10">
                                    Inteligente
                                </button>
                            </div>
                        </div>

                        {/* Botão de Lance */}
                        <Link to="/" className="relative flex justify-center items-center gap-3 bg-primary-dark/90 w-full h-auto rounded-3xl border border-secondary-dark py-4 px-3 hover:bg-secondary/10 transition-all duration-200 group">
                            <h3 className="text-secondary font-black text-lg flex items-center">
                                <GavelIcon className="mr-3" />
                                DAR LANCE
                                <LaunchIcon className="absolute right-6 opacity-50 group-hover:opacity-100 transition-opacity" fontSize="small"/>
                            </h3>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}