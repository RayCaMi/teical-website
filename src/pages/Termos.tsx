import { Link } from 'react-router-dom';

// Termos de Uso. ATENÇÃO: revise com um advogado antes do lançamento oficial
// e preencha os campos marcados com [colchetes].
export default function Termos() {
  return (
    <div className="bg-background min-h-screen pt-28 pb-20 px-6 text-text">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Termos de Uso</h1>
        <p className="text-muted text-sm mb-10">Última atualização: junho de 2026</p>

        <div className="prose prose-invert max-w-none leading-relaxed flex flex-col gap-6 text-muted">
          <p>
            Ao acessar e utilizar a plataforma Teical, você concorda com estes Termos de Uso.
            Caso não concorde, por favor não utilize o site.
          </p>

          <div>
            <h2 className="text-text text-xl font-bold mb-3">1. O que é a Teical</h2>
            <p>
              A Teical é uma plataforma de inteligência imobiliária que agrega editais de leilões e
              oferece análises geradas por inteligência artificial. As análises e o “Score Teical” têm
              caráter meramente informativo e <strong className="text-text">não constituem recomendação de
              investimento nem aconselhamento jurídico</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-text text-xl font-bold mb-3">2. Responsabilidade sobre decisões</h2>
            <p>
              A decisão de participar de qualquer leilão é exclusiva do usuário. Recomendamos a leitura
              integral do edital oficial e a consulta a um profissional habilitado antes de qualquer lance.
              A Teical não se responsabiliza por prejuízos decorrentes de decisões tomadas com base nas
              análises da plataforma.
            </p>
          </div>

          <div>
            <h2 className="text-text text-xl font-bold mb-3">3. Cadastro e perfis</h2>
            <p>
              Compradores podem criar conta por e-mail ou Google. O acesso de leiloeiros e administradores
              é restrito e concedido pela Teical. Você é responsável por manter a confidencialidade das
              suas credenciais e por toda atividade realizada na sua conta.
            </p>
          </div>

          <div>
            <h2 className="text-text text-xl font-bold mb-3">4. Conteúdo enviado por leiloeiros</h2>
            <p>
              Leiloeiros são responsáveis pela veracidade e legalidade dos editais, fotos e informações
              que cadastram. A Teical pode remover conteúdo que viole estes termos ou a legislação vigente.
            </p>
          </div>

          <div>
            <h2 className="text-text text-xl font-bold mb-3">5. Planos e pagamentos</h2>
            <p>
              Eventuais planos pagos terão suas condições, preços e formas de cobrança informados no momento
              da contratação. [Descreva aqui as regras de assinatura, cancelamento e reembolso quando os
              pagamentos forem ativados.]
            </p>
          </div>

          <div>
            <h2 className="text-text text-xl font-bold mb-3">6. Privacidade</h2>
            <p>
              O tratamento de dados pessoais segue a nossa{' '}
              <Link to="/privacidade" className="text-secondary">Política de Privacidade</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-text text-xl font-bold mb-3">7. Alterações e foro</h2>
            <p>
              Podemos atualizar estes termos periodicamente; a versão vigente estará sempre nesta página.
              Estes termos são regidos pelas leis brasileiras, ficando eleito o foro da comarca de
              [Cidade/UF] para dirimir eventuais conflitos.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <Link to="/privacidade" className="text-secondary font-bold hover:underline">Ver também: Política de Privacidade →</Link>
        </div>
      </div>
    </div>
  );
}
