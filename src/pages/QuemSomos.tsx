export default function QuemSomos() {
    return (
        <div className="bg-background min-h-screen p-8 pt-24 pb-32">
            {/* --- SEÇÃO: SOBRE A TEICAL --- */}
            <div className="max-w-7xl mx-auto flex px-10 lg:px-40 gap-20">
                <div className="flex flex-col shrink-0">
                    <p className="text-secondary font-bold text-md mb-3">Quem Somos</p>
                    <h2 className="text-text font-bold text-4xl leading-tight">
                        Sobre a <br /> Teical
                    </h2>
                </div>

                <div className="flex flex-col gap-8 ml-auto max-w-2xl">
                    <h1 className="text-text font-medium text-3xl">
                        A inteligência que arremata.
                    </h1>

                    <div className="flex flex-col gap-6">
                        <p className="text-muted text-sm leading-relaxed pl-4 border-l-4 border-secondary-dark">
                            Não somos apenas um site de busca de leilões, mas uma plataforma de inteligência imobiliária que transforma dados complexos e editais extensos em decisões seguras e lucrativas para o seu patrimônio.
                        </p>
                        <p className="text-muted text-sm leading-relaxed pl-4 border-l-4 border-secondary-dark">
                            Centralizamos os leilões imobiliários do Brasil e usamos inteligência de dados para transformar editais complexos em oportunidades claras de lucro. Onde outros veem riscos jurídicos, nós entregamos decisões seguras.
                        </p>
                        <p className="text-muted text-sm leading-relaxed pl-4 border-l-4 border-secondary-dark">
                            Unimos Direito Imobiliário, Engenharia e IA para mapear o mercado e filtrar as melhores oportunidades. Com o Teical Score, você investe com a certeza do desconto real e a tranquilidade da análise jurídica completa.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-40 max-w-6xl mx-auto px-10">
                <div className="text-center mb-20">
                    <h2 className="text-text font-bold text-5xl">O que fazemos?</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">

                    <div className="flex flex-col gap-4">
                        <p className="text-muted text-base leading-relaxed">
                            Sistematizamos o caos do mercado de leilões. Transformamos editais complexos em dados estruturados e interfaces intuitivas, entregando clareza onde antes só havia burocracia.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <p className="text-muted text-base leading-relaxed">
                            Somos o filtro de segurança do seu patrimônio. Através de inteligência aplicada, decodificamos riscos e validamos oportunidades para que você decida com precisão e absoluta confiança.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <p className="text-muted text-base leading-relaxed">
                            Conectamos os protagonistas do setor. Criamos um hub onde investidores, advogados e engenheiros colaboram em tempo real, unindo expertise humana e tecnologia de alta performance.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <p className="text-muted text-base leading-relaxed">
                            Redefinimos a experiência de investir em imóveis. Mais que uma plataforma, somos a infraestrutura inteligente que torna o lucro em leilões acessível, seguro e escalável.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-48 text-center px-10">
                <h2 className="text-text font-bold text-4xl md:text-5xl leading-tight max-w-5xl mx-auto">
                    Como seria a vida do investidores se a Teical existisse há anos?
                </h2>
            </div>
        </div>
    );
}