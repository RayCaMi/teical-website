export default function SejaMembro() {
  return (
    <div className="bg-background min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
                <header className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl tracking-tight text-text mb-4 uppercase">
            O Epicentro da Inteligência Imobiliária no Brasil
          </h1>
          <p className="text-muted text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Conectamos quem tem oportunidade com que tem expertise. 
            Escolha e opere com a tecnologia da Teical.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

          <div className="bg-surface/20 border-2 border-contrast/50 rounded-3xl p-8 flex flex-col items-center text-center group hover:bg-green-500/5 transition-all">
            <div className="text-4xl mb-4">🪖</div>
            <h2 className="text-green-500 font-bold text-xs uppercase tracking-widest mb-1">Perfil A: Especialista</h2>
            <p className="text-text text-[10px] font-bold mb-4 uppercase">Advogados, Engenheiros, Corretores</p>
            <p className="text-muted text-sm mb-8">Transforme sua expertise em autoridade e novos negócios</p>
            
            <ul className="text-left w-full space-y-4 mb-10 flex-1">
              <li className="flex items-start gap-2 text-xs text-muted">
                <span className="text-contrast">•</span> Exposição direta para investidores qualificados.
              </li>
              <li className="flex items-start gap-2 text-xs text-muted">
                <span className="text-contrast">•</span> Selo de Especialista Certificado Teical.
              </li>
              <li className="flex items-start gap-2 text-xs text-muted">
                <span className="text-contrast">•</span> Acesso ao radar de editais para prospecção.
              </li>
            </ul>
            
            <button className="w-full py-3 rounded-full border border-green-500 text-green-500 text-[10px] font-bold uppercase tracking-widest hover:bg-green-500 hover:text-primary transition-all">
              Quero ser um especialista parceiro
            </button>
          </div>

          <div className="bg-surface/20 border-2 border-contrast/50 rounded-3xl p-8 flex flex-col items-center text-center group hover:bg-yellow-600/5 transition-all z-10 shadow-2xl shadow-yellow-900/10">
            <div className="text-4xl mb-4">⚖️</div>
            <h2 className="text-yellow-600 font-bold text-xs uppercase tracking-widest mb-1">Perfil B: Leiloeiro</h2>
            <p className="text-text text-[10px] font-bold mb-4 uppercase">O Parceiro Estratégico</p>
            <p className="text-muted text-sm mb-8">Aumento a liquidez e a viabilidade dos seus lotes</p>
            
            <ul className="text-left w-full space-y-4 mb-10 flex-1">
              <li className="flex items-start gap-2 text-xs text-muted">
                <span className="text-contrast">•</span> Divulgação prioritária de seus editais.
              </li>
              <li className="flex items-start gap-2 text-xs text-muted">
                <span className="text-contrast">•</span> Relatórios de interesse e um tráfego qualificado.
              </li>
              <li className="flex items-start gap-2 text-xs text-muted">
                <span className="text-contrast">•</span> Integração direta com o Ecossistema Teical.
              </li>
            </ul>
            
            <button className="w-full py-3 rounded-full bg-yellow-600/20 border border-yellow-600 text-yellow-600 text-[10px] font-bold uppercase tracking-widest hover:bg-yellow-600 hover:text-primary transition-all">
              Divulgar meus editais
            </button>
          </div>

          <div className="bg-surface/20 border-2 border-contrast/50 rounded-3xl p-8 flex flex-col items-center text-center group hover:bg-orange-700/5 transition-all">
            <div className="text-4xl mb-4">👔</div>
            <h2 className="text-orange-700 font-bold text-xs uppercase tracking-widest mb-1">Perfil C: Investidor</h2>
            <p className="text-text text-[10px] font-bold mb-4 uppercase">O Membro da Comunidade</p>
            <p className="text-muted text-sm mb-8">Arremate com a segurança de um grande fundo</p>
            
            <ul className="text-left w-full space-y-4 mb-10 flex-1">
              <li className="flex items-start gap-2 text-xs text-muted">
                <span className="text-contrast">•</span> Acesso ao Teical Score (Risco x Oportunidade).
              </li>
              <li className="flex items-start gap-2 text-xs text-muted">
                <span className="text-contrast">•</span> Conexão direta com a rede de especialistas.
              </li>
              <li className="flex items-start gap-2 text-xs text-muted">
                <span className="text-contrast">•</span> Mentoria e cursos (Teical Academy).
              </li>
            </ul>
            
            <button className="w-full py-3 rounded-full border border-orange-700 text-orange-700 text-[10px] font-bold uppercase tracking-widest hover:bg-orange-700 hover:text-primary transition-all">
              Assinar Plano Investidor
            </button>
          </div>
        </div>

        {/* Banner Diferencial */}
        <div className="bg-contrast/10 border border-contrast/30 rounded-3xl p-10 mb-24 relative overflow-hidden group">
          <div className="absolute right-10 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="text-9xl">🏠</div>
          </div>
          <h3 className="text-contrast font-bold uppercase tracking-widest mb-4">O Diferencial Teical: A Comunidade</h3>
          <p className="text-text text-sm md:text-base max-w-3xl leading-relaxed opacity-80">
            Na Teical, você não encontra apenas editais: você encontra o seu próximo sócio, o seu advogado de confiança e o engenheiro que viabiliza o seu lucro. Somos uma rede viva onde o diálogo elimina o medo.
          </p>
        </div>

        <section className="text-center">
          <h2 className="text-muted font-bold tracking-[0.3em] uppercase mb-12">Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface/10 rounded-3xl p-8 border border-border/50">
              <h4 className="text-text font-bold uppercase tracking-widest mb-1">Plano Consultivo</h4>
              <p className="text-muted text-[10px] mb-6">(BÁSICO)</p>
              <p className="text-muted text-xs mb-10 leading-relaxed">
                Acesso às notícias e os editais divulgados na plataforma, do mapeamento e do IAnálise
              </p>
              <button className="w-full py-3 rounded-xl bg-contrast/30 text-contrast font-bold text-xs hover:bg-contrast/50 transition-all">
                R$ 49,90 (MENSAL)
              </button>
            </div>

            <div className="bg-surface/10 rounded-3xl p-8 border border-contrast/30">
              <h4 className="text-text font-bold uppercase tracking-widest mb-1">Plano Pro</h4>
              <p className="text-muted text-[10px] mb-6">(INTERMEDIÁRIO)</p>
              <p className="text-muted text-xs mb-10 leading-relaxed">
                Acréscimo de acesso às conexões ou comunidades com parceiro/membro
              </p>
              <button className="w-full py-3 rounded-xl bg-contrast/40 text-contrast font-bold text-xs hover:bg-contrast/60 transition-all">
                R$ 69,90 (MENSAL)
              </button>
            </div>

            {/* Plano Academy */}
            <div className="bg-surface/10 rounded-3xl p-8 border border-border/50">
              <h4 className="text-text font-bold uppercase tracking-widest mb-1">Plano Academy</h4>
              <p className="text-muted text-[10px] mb-6">(ELITE)</p>
              <p className="text-muted text-xs mb-10 leading-relaxed">
                Acréscimo de acesso aos cursos e mentorias relacionadas ao mundo imobiliário
              </p>
              <button className="w-full py-3 rounded-xl bg-contrast/30 text-contrast font-bold text-xs hover:bg-contrast/50 transition-all">
                R$ 99,90 (MENSAL)
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}