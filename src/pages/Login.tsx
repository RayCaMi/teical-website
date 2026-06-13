import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from "../supabase";

export default function Login() {
  const navigate = useNavigate();

  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const redirecionarPorCargo = (user: any) => {
    const role = user?.app_metadata?.role ?? user?.user_metadata?.role;
    navigate(role === "leiloeiro" || role === "admin" ? "/painel-envio" : "/");
  };

  // Entrar OU criar conta, conforme o modo selecionado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMensagem(null);

    try {
      if (modo === "criar") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Se a confirmação de e-mail estiver ativa, não vem sessão na hora
        if (data.session) {
          navigate("/");
        } else {
          setMensagem("Conta criada! Verifique seu e-mail para confirmar o cadastro e depois faça login.");
          setModo("entrar");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        redirecionarPorCargo(data.user);
      }
    } catch (err: any) {
      console.error("Erro do Supabase:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEsqueciSenha = async () => {
    if (!email) {
      setError("Digite seu e-mail no campo acima e clique de novo em 'Esqueci minha senha'.");
      return;
    }
    setError(null);
    setMensagem(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/definir-senha`,
      });
      if (error) throw error;
      setMensagem("Enviamos um link de redefinição para o seu e-mail. Verifique a caixa de entrada (e o spam).");
    } catch (err: any) {
      setError(`Não foi possível enviar o e-mail: ${err.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Erro Google:", err);
      setError(`Erro ao conectar com o Google: ${err.message}`);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-6">
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 text-muted hover:text-secondary transition-colors flex items-center gap-2 text-sm font-medium"
      >
        <ArrowBackIcon fontSize="small" />
        Voltar para a Home
      </button>

      <div className="w-full max-w-md bg-surface/95 border border-border p-10 rounded-3xl shadow-2xl backdrop-blur-sm text-center">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="bg-secondary/10 p-4 rounded-2xl border border-secondary/20">
            <img src="/logo.svg" alt="Teical" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-text text-3xl font-black tracking-tight">TEICAL</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-text text-xl font-bold mb-2">{modo === "criar" ? "Criar conta" : "Entrar na Teical"}</h2>
          <p className="text-muted text-sm">
            {modo === "criar"
              ? "Crie sua conta de comprador para acompanhar os leilões."
              : "Entre com o Google ou com seu e-mail e senha."}
          </p>
        </div>

        {/* OPÇÃO PRINCIPAL: COMPRADOR VIA GOOGLE */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-4 bg-secondary hover:bg-secondary/90 text-background font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          <GoogleIcon fontSize="small" />
          {modo === "criar" ? "Cadastrar com o Google" : "Sou um Comprador (Google)"}
        </button>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-border flex-1"></div>
          <span className="text-muted text-xs uppercase tracking-widest">ou com e-mail</span>
          <div className="h-px bg-border flex-1"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-left">
            <label className="text-muted text-xs font-bold uppercase tracking-wider mb-2 block">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="voce@exemplo.com"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text outline-none focus:border-secondary transition-colors"
            />
          </div>

          <div className="text-left">
            <label className="text-muted text-xs font-bold uppercase tracking-wider mb-2 block">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text outline-none focus:border-secondary transition-colors"
            />
          </div>

          {modo === "entrar" && (
            <button
              type="button"
              onClick={handleEsqueciSenha}
              className="text-muted text-xs font-bold hover:text-secondary transition-colors text-right -mt-1"
            >
              Esqueci minha senha
            </button>
          )}

          {error && <p className="text-red-500 text-sm font-medium mt-2">{error}</p>}
          {mensagem && <p className="text-green-500 text-sm font-medium mt-2">{mensagem}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-background border border-border hover:border-secondary text-text font-bold py-3 px-6 rounded-2xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Aguarde..." : modo === "criar" ? "Criar minha conta" : "Entrar"}
          </button>
        </form>

        <p className="text-muted text-sm mt-6">
          {modo === "criar" ? "Já tem conta?" : "Não tem conta?"}{" "}
          <button
            type="button"
            onClick={() => { setModo(modo === "criar" ? "entrar" : "criar"); setError(null); setMensagem(null); }}
            className="text-secondary font-bold hover:underline"
          >
            {modo === "criar" ? "Entrar" : "Criar conta de comprador"}
          </button>
        </p>

        <p className="text-muted text-[10px] mt-8 uppercase tracking-widest leading-relaxed">
          Ao continuar, você concorda com nossos <br />
          <Link to="/termos" className="text-muted hover:text-secondary transition-colors">Termos de Uso</Link> e{" "}
          <Link to="/privacidade" className="text-muted hover:text-secondary transition-colors">Privacidade</Link>.
        </p>
      </div>
    </div>
  );
}
