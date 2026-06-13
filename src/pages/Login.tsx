import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from "../supabase"; // Importando a nossa "Fechadura"

export default function Login() {
  const navigate = useNavigate();
  
  // Estados para guardar o que o utilizador digita
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função REAL conectada ao Supabase com RBAC (Cargos)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // VERIFICAÇÃO DO CARGO (O CRACHÁ) — app_metadata é o local seguro
      const userRole = data.user?.app_metadata?.role ?? data.user?.user_metadata?.role;

      if (userRole === "leiloeiro" || userRole === "admin") {
        navigate("/painel-envio"); 
      } else {
        navigate("/"); 
      }
      
    } catch (err: any) {
      // Imprime o erro técnico no console para debug e mostra na tela
      console.error("Erro do Supabase:", err); 
      setError(`Erro real: ${err.message}`); 
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: window.location.origin // Volta para a raiz após o Google autorizar
        }
      });
      if (error) throw error;
      
    } catch (err: any) {
      console.error("Erro Google:", err);
      setError(`Erro ao conectar com o Google: ${err.message}`);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-6">
      
      {/* Botão de Voltar para Home */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 text-muted hover:text-secondary transition-colors flex items-center gap-2 text-sm font-medium"
      >
        <ArrowBackIcon fontSize="small" />
        Voltar para a Home
      </button>

      <div className="w-full max-w-md bg-surface/95 border border-border p-10 rounded-3xl shadow-2xl backdrop-blur-sm text-center">
        
        {/* Logo e Título */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="bg-secondary/10 p-4 rounded-2xl border border-secondary/20">
            <img src="/logo.svg" alt="Teical" className="w-12 h-12 object-contain" />
          </div>
          <div>
            <h1 className="text-text text-3xl font-black tracking-tight">TEICAL</h1>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-text text-xl font-bold mb-2">Entrar na Teical</h2>
          <p className="text-muted text-sm">
            Compradores entram com o Google. Leiloeiros e administradores usam e-mail corporativo.
          </p>
        </div>

        {/* OPÇÃO PRINCIPAL: COMPRADOR VIA GOOGLE */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-4 bg-secondary hover:bg-secondary/90 text-background font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          <GoogleIcon fontSize="small" />
          Sou um Comprador (Google)
        </button>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-border flex-1"></div>
          <span className="text-muted text-xs uppercase tracking-widest">acesso restrito</span>
          <div className="h-px bg-border flex-1"></div>
        </div>

        {/* FORMULÁRIO DE LOGIN REAL */}
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 mb-6">
          <div className="text-left">
            <label className="text-muted text-xs font-bold uppercase tracking-wider mb-2 block">
              E-mail Corporativo
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="leiloeiro@exemplo.com"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text outline-none focus:border-secondary transition-colors"
            />
          </div>

          <div className="text-left">
            <label className="text-muted text-xs font-bold uppercase tracking-wider mb-2 block">
              Senha
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text outline-none focus:border-secondary transition-colors"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium mt-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-background border border-border hover:border-secondary text-text font-bold py-3 px-6 rounded-2xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "A Autenticar..." : "Entrar como Leiloeiro / Admin"}
          </button>
        </form>

        <p className="text-muted text-[10px] mt-8 uppercase tracking-widest leading-relaxed">
          Ao entrar, você concorda com nossos <br />
          <span className="text-muted cursor-pointer hover:text-secondary transition-colors">Termos de Uso</span> e <span className="text-muted cursor-pointer hover:text-secondary transition-colors">Privacidade</span>.
        </p>

      </div>
    </div>
  );
}