import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

// Página de destino dos links de e-mail do Supabase (convite e recuperação
// de senha). O link loga a pessoa automaticamente; aqui ela define a senha.
export default function RedefinirSenha() {
  const navigate = useNavigate();
  const [verificando, setVerificando] = useState(true);
  const [temSessao, setTemSessao] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    // O supabase-js processa o token do link de forma assíncrona;
    // tentamos por alguns segundos antes de declarar o link inválido
    let tentativas = 0;
    let cancelado = false;
    const checar = async () => {
      if (cancelado) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setTemSessao(true);
        setVerificando(false);
        return;
      }
      tentativas += 1;
      if (tentativas < 10) setTimeout(checar, 500);
      else setVerificando(false);
    };
    checar();
    return () => { cancelado = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }
    setSalvando(true);
    setErro(null);
    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) {
      setErro(`Não foi possível salvar a senha: ${error.message}`);
      setSalvando(false);
      return;
    }
    setSucesso(true);
    setTimeout(() => navigate("/"), 2500);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface/95 border border-border p-10 rounded-3xl shadow-2xl backdrop-blur-sm text-center">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="bg-secondary/10 p-4 rounded-2xl border border-secondary/20">
            <img src="/logo.svg" alt="Teical" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-text text-3xl font-black tracking-tight">TEICAL</h1>
        </div>

        {verificando ? (
          <p className="text-secondary font-bold">Validando seu link...</p>
        ) : sucesso ? (
          <div>
            <h2 className="text-text text-xl font-bold mb-2">✅ Senha definida!</h2>
            <p className="text-muted text-sm">Você já está conectado. Redirecionando para o site...</p>
          </div>
        ) : !temSessao ? (
          <div>
            <h2 className="text-text text-xl font-bold mb-2">Link inválido ou expirado</h2>
            <p className="text-muted text-sm mb-6">
              Os links de e-mail valem por tempo limitado e só podem ser usados uma vez.
              Peça um novo na tela de login, em "Esqueci minha senha".
            </p>
            <button onClick={() => navigate("/login")} className="w-full bg-secondary hover:bg-secondary/90 text-background font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg">
              Ir para o Login
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-text text-xl font-bold mb-2">Defina sua senha</h2>
              <p className="text-muted text-sm">Crie a senha que você usará para entrar na Teical.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="text-left">
                <label className="text-muted text-xs font-bold uppercase tracking-wider mb-2 block">Nova senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text outline-none focus:border-secondary transition-colors"
                />
              </div>
              <div className="text-left">
                <label className="text-muted text-xs font-bold uppercase tracking-wider mb-2 block">Confirmar senha</label>
                <input
                  type="password"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text outline-none focus:border-secondary transition-colors"
                />
              </div>
              {erro && <p className="text-red-500 text-sm font-medium">{erro}</p>}
              <button
                type="submit"
                disabled={salvando}
                className="w-full mt-2 bg-secondary hover:bg-secondary/90 text-background font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                {salvando ? "Salvando..." : "Salvar senha e entrar"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
