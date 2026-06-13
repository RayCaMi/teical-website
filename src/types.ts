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

// A estrutura de notícias (mantida exatamente como você tinha)
export interface NewsData {
  id: string;
  titulo: string;
  resumo: string;
  categoria: string;
  data: string;
  leituraMinutos: number;
  imagemUrl: string;
  autor: string;
  isNovo?: boolean;
  isTendencia?: boolean;
}

// Utilitário para formatar moeda
export const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};