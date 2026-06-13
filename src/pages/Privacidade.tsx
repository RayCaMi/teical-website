import { Link } from 'react-router-dom';

// Política de Privacidade alinhada à LGPD (Lei 13.709/2018).
// ATENÇÃO: revise com um advogado antes do lançamento oficial e preencha os
// campos marcados com [colchetes] (razão social, CNPJ, e-mail do encarregado).
export default function Privacidade() {
  return (
    <div className="bg-background min-h-screen pt-28 pb-20 px-6 text-text">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-muted text-sm mb-10">Última atualização: junho de 2026</p>

        <div className="prose prose-invert max-w-none leading-relaxed flex flex-col gap-6 text-muted">
          <p>
            A Teical (“nós”) respeita a sua privacidade e está comprometida com a proteção dos seus
            dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
            Esta política explica quais dados coletamos, como os usamos e quais são os seus direitos.
          </p>

          <div>
            <h2 className="text-text text-xl font-bold mb-3">1. Dados que coletamos</h2>
            <ul className="list-disc list-inside flex flex-col gap-2">
              <li><strong className="text-text">Dados de cadastro:</strong> nome, e-mail e, no caso de leiloeiros, dados profissionais fornecidos no acesso à plataforma.</li>
              <li><strong className="text-text">Dados de autenticação:</strong> quando você entra com o Google, recebemos seu nome e e-mail da conta Google; não temos acesso à sua senha do Google.</li>
              <li><strong className="text-text">Dados de uso:</strong> informações técnicas de navegação necessárias ao funcionamento e à segurança do site.</li>
              <li><strong className="text-text">Conteúdo enviado:</strong> editais, fotos e dados de imóveis cadastrados por leiloeiros.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-text text-xl font-bold mb-3">2. Como usamos os dados</h2>
            <ul className="list-disc list-inside flex flex-col gap-2">
              <li>Autenticar o acesso e controlar permissões (compradores, leiloeiros e administradores).</li>
              <li>Processar e exibir os imóveis em leilão e suas análises.</li>
              <li>Comunicar informações essenciais da conta (ex.: redefinição de senha).</li>
              <li>Garantir a segurança e prevenir fraudes.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-text text-xl font-bold mb-3">3. Compartilhamento</h2>
            <p>
              Não vendemos seus dados. Utilizamos provedores de tecnologia que atuam como operadores
              (Supabase, para banco de dados e autenticação; Cloudflare, para hospedagem; e um provedor
              de IA para a análise dos editais), que tratam os dados apenas conforme nossas instruções e
              em nosso nome.
            </p>
          </div>

          <div>
            <h2 className="text-text text-xl font-bold mb-3">4. Seus direitos</h2>
            <p>
              Você pode, a qualquer momento, solicitar acesso, correção, portabilidade ou exclusão dos
              seus dados, bem como revogar consentimentos. Para exercer esses direitos, entre em contato
              pelo e-mail <a href="mailto:contato@teical.com.br" className="text-secondary">contato@teical.com.br</a>.
            </p>
          </div>

          <div>
            <h2 className="text-text text-xl font-bold mb-3">5. Retenção e segurança</h2>
            <p>
              Mantemos os dados apenas pelo tempo necessário às finalidades descritas ou conforme exigido
              por lei. Adotamos medidas técnicas de segurança, como controle de acesso por perfil e
              restrição de escrita no banco de dados.
            </p>
          </div>

          <div>
            <h2 className="text-text text-xl font-bold mb-3">6. Contato do controlador</h2>
            <p>
              Controlador dos dados: [Razão Social], inscrita no CNPJ sob nº [CNPJ].
              Encarregado (DPO) / contato: <a href="mailto:contato@teical.com.br" className="text-secondary">contato@teical.com.br</a>.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <Link to="/termos" className="text-secondary font-bold hover:underline">Ver também: Termos de Uso →</Link>
        </div>
      </div>
    </div>
  );
}
