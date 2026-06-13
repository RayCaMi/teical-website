import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import { supabase } from '../supabase';
import { mapNews, type NewsData, type NewsRow } from '../types';

export default function NoticiaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase.from('news').select('*').eq('id', id).single();
      if (data) setNoticia(mapNews(data as NewsRow));
      setLoading(false);
    };
    carregar();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-secondary font-bold">Carregando notícia...</div>;
  }

  if (!noticia) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-text">
        <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
        <button onClick={() => navigate('/noticias')} className="text-secondary underline">Voltar para notícias</button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Botão Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-muted hover:text-secondary transition-colors mb-8 font-bold uppercase text-xs tracking-widest"
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} className="transition-transform group-hover:-translate-x-1" />
          Voltar
        </button>

        {/* Categoria e Título */}
        <div className="mb-8">
          <span className="bg-secondary/10 text-secondary border border-secondary/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
            {noticia.categoria}
          </span>
          <h1 className="text-text text-4xl md:text-5xl font-bold mt-6 leading-tight">
            {noticia.titulo}
          </h1>
        </div>

        {/* Imagem de Capa */}
        <div className="w-full h-75 md:h-125 rounded-3xl overflow-hidden mb-10 border border-border/50">
          <img
            src={noticia.imagemUrl}
            alt={noticia.titulo}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Meta Informações (Autor, Data, Leitura) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-border/30 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-secondary">
              <PersonIcon />
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase font-bold tracking-widest">Autor</p>
              <p className="text-text font-medium">{noticia.autor}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-secondary">
              <CalendarMonthIcon />
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase font-bold tracking-widest">Publicado em</p>
              <p className="text-text font-medium">{noticia.data}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-secondary">
              <AccessTimeIcon />
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase font-bold tracking-widest">Tempo de leitura</p>
              <p className="text-text font-medium">{noticia.leituraMinutos} minutos</p>
            </div>
          </div>
        </div>

        {/* Texto da Notícia */}
        <article className="prose prose-invert prose-blue max-w-none">
          <p className="text-xl text-muted leading-relaxed mb-8 italic">
            {noticia.resumo}
          </p>
          <div className="text-text text-lg leading-loose">
            <ReactMarkdown>{noticia.conteudo || ''}</ReactMarkdown>
          </div>
        </article>

      </div>
    </div>
  );
}
