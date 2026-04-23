export interface PropertyData {
  id: string;
  nome: string;
  local: string;
  bairro?: string;
  cidade: string;
  uf: string;
  precoAvaliacao: number;
  precoAtual: number;
  score: number;
  status: 'green' | 'yellow' | 'red';
  fotos: string[]; // A primeira [0] será a principal
  categoria: 'Casa' | 'Apartamento' | 'Galpão' | 'Lajes' | 'Outros';
}

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
export const formatCurrency = (value: number) => 
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });