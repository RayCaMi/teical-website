import { useState, useMemo } from 'react';
import { NewsCard } from "../components/NewsCard";
import { mockNews } from "../data/newsMock";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';

export default function Noticias() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const itemsPerPage = 6;

    const categorias = ['Todos', 'Leilões', 'Direito Imobiliário', 'Mercado', 'Jurisprudência', 'Tributário', 'Tecnologia'];

    const filteredNews = useMemo(() => {
        if (selectedCategory === 'Todos') return mockNews;
        return mockNews.filter(item => item.categoria === selectedCategory);
    }, [selectedCategory]);

    const isHome = selectedCategory === 'Todos';

    const heroNews = isHome ? filteredNews[0] : null;
    const newsForGrid = isHome ? filteredNews.slice(1) : filteredNews;

    const totalPages = Math.ceil(newsForGrid.length / itemsPerPage);
    const currentItems = newsForGrid.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    return (
        <div className="bg-background min-h-screen p-8 pt-24 text-text">
            <div className="max-w-7xl mx-auto">

                <header className="mb-10">
                    <h1 className="text-4xl font-bold mb-6">Notícias & Jurisprudência</h1>

                    <div className="flex flex-wrap gap-2">
                        {categorias.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border
                  ${selectedCategory === cat
                                        ? 'bg-secondary border-secondary text-primary'
                                        : 'bg-surface border-border text-muted hover:border-secondary'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-10">
                    <main className="flex-1">
                        {heroNews && isHome && currentPage === 1 && (
                            <div className="mb-10">
                                <NewsCard data={heroNews} isHero={true} />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentItems.map(news => (
                                <NewsCard key={news.id} data={news} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-8 mt-12 py-6 border-t border-border">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0, 0); }}
                                    className="text-muted hover:text-secondary disabled:opacity-0 transition-all"
                                >
                                    <ArrowBackIcon />
                                </button>
                                <span className="text-muted text-sm font-bold tracking-widest uppercase">
                                    Página {currentPage} / {totalPages}
                                </span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0, 0); }}
                                    className="text-muted hover:text-secondary disabled:opacity-0 transition-all"
                                >
                                    <ArrowForwardIcon />
                                </button>
                            </div>
                        )}
                    </main>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 flex flex-col gap-6">
                        <div className="bg-secondary-dark/10 border border-secondary/10 p-6 rounded-2xl shadow-xl">
                            <h2 className="text-text font-bold mb-4 text-lg border-b border-border pb-2 uppercase tracking-tighter italic">Em Alta</h2>
                            <div className="flex flex-col gap-4">
                                {mockNews.slice(0, 4).map((n, i) => (
                                    <div key={n.id} className="group cursor-pointer">
                                        <span className="text-secondary text-[10px] font-bold">{i + 1}.</span>
                                        <Link to={`/noticia/${n.id}`}>
                                        <p className="text-muted text-xs font-bold group-hover:text-text transition-colors line-clamp-2">{n.titulo}</p>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-secondary-dark/10 border border-secondary/10 p-6 rounded-2xl shadow-xl">
                            <h2 className="text-text font-bold mb-4 text-lg border-b border-border pb-2 uppercase tracking-tighter italic">Fontes Parceiras</h2>
                            <ul className="text-muted text-[10px] flex flex-col gap-2 uppercase font-bold tracking-widest">
                                <li className="hover:text-secondary cursor-pointer">• Jusbrasil</li>
                                <li className="hover:text-secondary cursor-pointer">• Conjur</li>
                                <li className="hover:text-secondary cursor-pointer">• STJ Notícias</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}