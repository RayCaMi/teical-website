import { useNavigate } from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Login() {
  const navigate = useNavigate();

  // Função que será conectada ao Firebase/Supabase/Auth0 no futuro
  const handleGoogleLogin = () => {
    console.log("Iniciando login com Google...");
    // Aqui entrará a lógica: signInWithPopup(auth, provider)
    // Por enquanto, vamos apenas simular o sucesso:
    navigate("/");
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
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="bg-secondary/10 p-4 rounded-2xl border border-secondary/20">
            <img src="/logo.svg" alt="Teical" className="w-12 h-12 object-contain" />
          </div>
          <div>
            <h1 className="text-text text-3xl font-black tracking-tight">TEICAL</h1>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-text text-xl font-bold mb-2">Bem-vindo investidor</h2>
          <p className="text-muted text-sm">
            Acesse a plataforma para visualizar análises exclusivas e dar lances com segurança.
          </p>
        </div>

        {/* Botão de Login Único */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-4 bg-surface hover:bg-surface/90 text-text font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          <GoogleIcon />
          Entrar com o Google
        </button>

        <p className="text-muted text-[10px] mt-10 uppercase tracking-widest leading-relaxed">
          Ao entrar, você concorda com nossos <br />
          <span className="text-muted cursor-pointer hover:text-secondary">Termos de Uso</span> e <span className="text-muted cursor-pointer hover:text-secondary">Privacidade</span>.
        </p>

      </div>
    </div>
  );
}