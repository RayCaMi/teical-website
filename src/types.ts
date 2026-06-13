// A nova estrutura exata que vem do Supabase e da IA
export interface PropertyData {
  id: string | number;
  title: string;
  location: string;
  endereco?: string;   // Endereço completo (rua, número, bairro)
  owner_id?: string;   // Leiloeiro que cadastrou (controla quem pode editar)
  price: number;
  score: number;
  status: string;
  image_url: string;
  galeria?: string[];
  memorial_analise?: string;
  analise_manual?: string;   // Parecer escrito pelo leiloeiro (opcional)
  link_leiloeiro?: string;
  quartos?: number;   // <- NOVA LINHA
  vagas?: number;     // <- NOVA LINHA
  area?: number;      // <- NOVA LINHA
  categoria?: string; // <- NOVA LINHA
}

// A estrutura de notícias exibida no front
export interface NewsData {
  id: string;
  titulo: string;
  resumo: string;
  conteudo?: string;      // Corpo completo do artigo (Markdown)
  categoria: string;
  data: string;
  leituraMinutos: number;
  imagemUrl: string;
  autor: string;
  isNovo?: boolean;
  isTendencia?: boolean;
}

// Como a notícia chega do Supabase (snake_case)
export interface NewsRow {
  id: string;
  titulo: string;
  resumo: string;
  conteudo?: string;
  categoria: string;
  autor: string;
  imagem_url: string;
  leitura_minutos: number;
  is_novo?: boolean;
  is_tendencia?: boolean;
  created_at?: string;
}

// Converte a linha do banco para o formato usado nos componentes
export const mapNews = (row: NewsRow): NewsData => ({
  id: String(row.id),
  titulo: row.titulo,
  resumo: row.resumo,
  conteudo: row.conteudo,
  categoria: row.categoria,
  autor: row.autor,
  imagemUrl: row.imagem_url,
  leituraMinutos: row.leitura_minutos ?? 3,
  isNovo: row.is_novo,
  isTendencia: row.is_tendencia,
  data: row.created_at
    ? new Date(row.created_at).toLocaleDateString('pt-BR')
    : '',
});

// Utilitário para formatar moeda
export const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};