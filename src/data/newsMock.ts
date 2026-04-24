import type { NewsData } from '../types';

export const mockNews: NewsData[] = [
  {
    id: '1',
    titulo: "STJ decide que ITBI deve incidir sobre valor da arrematação, não sobre avaliação do imóvel",
    resumo: "A 1ª Seção do Superior Tribunal de Justiça firmou tese que beneficia arrematantes em leilões judiciais e extrajudiciais...",
    categoria: "Jurisprudência",
    data: "25/03/2024",
    leituraMinutos: 4,
    imagemUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000",
    autor: "STJ Notícias",
    isNovo: true
  },
  {
    id: '2',
    titulo: "Imissão na Posse: Tribunal de Justiça de Goiás reduz prazo médio para 45 dias em 2026",
    resumo: "Dados do TJGO apontam que o prazo para imissão na posse em leilões judiciais caiu 30% no primeiro trimestre...",
    categoria: "Leilões",
    data: "24/03/2024",
    leituraMinutos: 3,
    imagemUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
    autor: "TJGO Comunicação",
    isTendencia: true
  },
  {
    id: '3',
    titulo: "Mercado de leilões imobiliários cresce 28% no primeiro trimestre de 2026",
    resumo: "Levantamento da Teical aponta crescimento expressivo no volume de lotes arrematados, impulsionado pela alta inadimplência e pela digitalização dos processos de execução.",
    categoria: "Mercado",
    data: "22/03/2024",
    leituraMinutos: 5,
    imagemUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000",
    autor: "Teical Insights",
    isTendencia: true
  },
  {
    id: '4',
    titulo: "Como a Tokenização de ativos está transformando a liquidez dos leilões",
    resumo: "A tecnologia blockchain começa a ser aplicada para fracionar a arrematação de grandes galpões logísticos, permitindo que pequenos investidores participem de grandes lances.",
    categoria: "Tecnologia",
    data: "20/03/2024",
    leituraMinutos: 6,
    imagemUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000",
    autor: "Tech Corner",
    isNovo: false
  },
  {
    id: '5',
    titulo: "Isenção de IPTU para imóveis arrematados: O que dizem as prefeituras",
    resumo: "Análise detalhada sobre o passivo tributário anterior à arrematação. Saiba como proceder para limpar a matrícula do imóvel sem arcar com dívidas do antigo dono.",
    categoria: "Tributário",
    data: "18/03/2024",
    leituraMinutos: 4,
    imagemUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000",
    autor: "Contábil Jus",
    isNovo: false
  },
  {
    id: '6',
    titulo: "Leilões da Caixa: Cronograma de Abril traz mais de 2.500 imóveis com desconto",
    resumo: "Oportunidades em todo o território nacional com descontos que podem chegar a 60% do valor de avaliação. Veja a lista das cidades com maior oferta.",
    categoria: "Leilões",
    data: "15/03/2024",
    leituraMinutos: 3,
    imagemUrl: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?q=80&w=1000",
    autor: "Radar de Oportunidades",
    isNovo: true
  },
  {
    id: '7',
    titulo: "Riscos Ocultos: Por que você deve ler o edital pelo menos 3 vezes",
    resumo: "Especialistas alertam para cláusulas específicas sobre desocupação e débitos condominiais que podem comprometer a rentabilidade do seu investimento.",
    categoria: "Direito Imobiliário",
    data: "12/03/2024",
    leituraMinutos: 7,
    imagemUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000",
    autor: "Legal Advice",
    isNovo: false
  },
  {
    id: '8',
    titulo: "Uso de IA para prever valor de revenda após arrematação vira febre",
    resumo: "Novos algoritmos analisam o histórico de vendas do bairro e o estado de conservação do prédio para sugerir o lance máximo ideal para o investidor.",
    categoria: "Tecnologia",
    data: "10/03/2024",
    leituraMinutos: 5,
    imagemUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000",
    autor: "Teical Tech",
    isTendencia: true
  },
  {
    id: '9',
    titulo: "Reforma Tributária e o impacto no ITCMD sobre heranças imobiliárias",
    resumo: "Entenda como as novas alíquotas progressivas podem forçar famílias a leiloarem imóveis para quitar obrigações com o fisco.",
    categoria: "Tributário",
    data: "05/03/2024",
    leituraMinutos: 8,
    imagemUrl: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=1000",
    autor: "Jurisprudência & Mercado",
    isNovo: false
  },
  {
    id: '10',
    titulo: "Lajes Corporativas: O setor que mais cresce nos leilões judiciais de SP",
    resumo: "Com a volta ao presencial, investidores focam em escritórios de alto padrão localizados na Faria Lima e Berrini arrematados por preços de oportunidade.",
    categoria: "Mercado",
    data: "01/03/2024",
    leituraMinutos: 4,
    imagemUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000",
    autor: "Bussiness Real Estate",
    isNovo: false
  }
];