import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import Home from './pages/Home';
import Imoveis from './pages/Imoveis';
import Imovel from './pages/Imovel';
import QuemSomos from './pages/QuemSomos';
import Noticias from './pages/Noticias';
import NoticiaDetalhe from './pages/Noticia';
import Login from './pages/Login';
import SejaMembro from './pages/SejaMembro';
import ScrollToTop from './components/ScrollToTop';
import PainelEnvio from './pages/PainelEnvio';
import { supabase } from './supabase';
import type { PropertyData } from './types'; // Importando a tipagem correta

// 1. O WRAPPER AGORA FICA DO LADO DE FORA (Regra de Ouro do React)
// Ele recebe as propriedades e o loading através de "props"
const ImovelDetailWrapper = ({ properties, loading }: { properties: PropertyData[], loading: boolean }) => {
  const { id } = useParams<{ id: string }>();
  
  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center text-text">
        <p className="font-bold text-secondary">A carregar detalhes do imóvel...</p>
      </div>
    );
  }

  // Procura o imóvel específico pelo ID
  const property = properties.find(p => String(p.id) === String(id));

  if (!property) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center text-text">
        <h2 className="text-2xl font-bold">Imóvel não encontrado.</h2>
      </div>
    );
  }

  return <Imovel data={property} />;
};

// 2. O COMPONENTE PRINCIPAL APP
function App() {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar os imóveis no Supabase
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties') // Correção aplicada!
          .select('*')
          .order('score', { ascending: false });

        if (error) throw error;
        setProperties(data || []);
      } catch (err) {
        console.error("Erro ao carregar imóveis do Supabase:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <Router> 
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home properties={properties} loading={loading} />} />
          <Route path="/imoveis" element={<Imoveis allProperties={properties} loading={loading} />} />
          <Route path="/imovel/:id" element={<ImovelDetailWrapper properties={properties} loading={loading} />} />
          
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticia/:id" element={<NoticiaDetalhe />} />
          <Route path="/seja-membro" element={<SejaMembro />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/painel-envio" element={<PainelEnvio />} />
      </Routes>
    </Router>
  );
}

export default App;