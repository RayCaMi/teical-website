import { Link } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

export function Footer() {
  return (
    <footer className="bg-primary-dark text-gray-400 py-16 px-8 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 md:grid-cols-3">

        {/* Coluna 1: Branding */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Teical" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold text-secondary tracking-tight">Teical</span>
          </div>
          <p className="text-sm leading-relaxed max-w-md md:max-w-xs">
            A plataforma de inteligência imobiliária que transforma dados complexos em decisões seguras e lucrativas.
          </p>
        </div>

        {/* Coluna 2: Navegação Rápida */}
        <div className="md:ml-auto">
          <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-widest">Plataforma</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/imoveis" className="hover:text-secondary transition-colors">Imóveis</Link></li>
            <li><Link to="/quem-somos" className="hover:text-secondary transition-colors">Quem somos</Link></li>
            <li><Link to="/noticias" className="hover:text-secondary transition-colors">Notícias</Link></li>
            <li><Link to="/seja-membro" className="hover:text-secondary transition-colors">Conexões</Link></li>
          </ul>
        </div>

        {/* Coluna 3: Canais de Contato (Substituindo a página de contato) */}
        <div className="md:ml-auto">
          <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-widest">Fale Conosco</h4>
          <div className="flex flex-col gap-4">
            <a 
              href="https://wa.me/seunumerodewhatsapp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2.5 rounded-xl transition-all duration-300 border border-green-500/20 group w-full md:w-fit"
            >
              <WhatsAppIcon sx={{ fontSize: 20 }} />
              <span className="text-xs font-bold uppercase">WhatsApp Direto</span>
            </a>

            <a 
              href="mailto:contato@teical.com.br" 
              className="flex items-center gap-3 bg-secondary/5 text-gray-300 hover:text-secondary px-4 py-2.5 rounded-xl transition-all duration-300 border border-gray-800 hover:border-secondary/30 group w-full md:w-fit"
            >
              <MailOutlineIcon sx={{ fontSize: 20 }} className="group-hover:text-secondary" />
              <span className="text-xs font-bold uppercase">E-mail Corporativo</span>
            </a>
          </div>
        </div>

      </div>

      {/* Rodapé Final */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-gray-500">
        <p>© 2026 Teical. A inteligência que arremata.</p>
        
        <div className="flex gap-8">
          <Link to="/privacidade" className="hover:text-secondary transition-colors">Privacidade</Link>
          <Link to="/termos" className="hover:text-secondary transition-colors">Termos de Uso</Link>
        </div>
      </div>
    </footer>
  );
}