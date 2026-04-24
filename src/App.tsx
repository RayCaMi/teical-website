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

import { mockProperties } from './data/propertiesMock';

// Componente auxiliar para capturar o ID da URL e passar o imóvel correto
function ImovelDetailWrapper() {
  const { id } = useParams<{ id: string }>();
  
  // Busca o imóvel no mock que tenha o mesmo ID da URL
  const property = mockProperties.find(p => p.id === id);

  if (!property) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center text-text">
        <h2 className="text-2xl font-bold">Imóvel não encontrado.</h2>
      </div>
    );
  }

  return <Imovel data={property} />;
}

function App() {
  return (
    <Router> 
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home/>} />
          <Route path="/imoveis" element={<Imoveis allProperties={mockProperties}/>} />

          <Route path="/imovel/:id" element={<ImovelDetailWrapper />} />
          
          <Route path="/quem-somos" element={<QuemSomos />} />

          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticia/:id" element={<NoticiaDetalhe />} />
          <Route path="/seja-membro" element={<SejaMembro />} />
        </Route>

        {/* Route without MainLayout */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;