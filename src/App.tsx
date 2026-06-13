import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
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
import MeusImoveis from './pages/MeusImoveis';
import RedefinirSenha from './pages/RedefinirSenha';
import { supabase } from './supabase';
import type { PropertyData } from './types'; // Importando a tipagem correta

// Captura o hash da URL antes de o supabase-js processá-lo e limpá-lo:
// links de convite e de redefinição de senha chegam com type=invite/recovery
const hashInicial = window.location.hash;

// Leva quem clicou num link de e-mail direto para a tela de definir senha
function RedirecionadorAuth() {
  const navigate = useNavigate();
  useEffect(() => {
    if (hashInicial.includes('type=invite') || hashInicial.includes('type=recovery')) {
      navigate('/definir-senha', { replace: true });
      return;
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') navigate('/definir-senha', { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);
  return null;
}

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
          .from('properties')
          .select('*')
          .neq('status', 'Pendente') // Rascunhos aguardando confirmação ficam fora do site
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
      <RedirecionadorAuth />
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
        <Route path="/meus-imoveis" element={<MeusImoveis />} />
        <Route path="/definir-senha" element={<RedefinirSenha />} />
      </Routes>
    </Router>
  );
}

export default App;