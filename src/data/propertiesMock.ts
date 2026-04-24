import type { PropertyData } from '../types';

export const mockProperties: PropertyData[] = [
  {
    id: "1",
    nome: "Laje Corporativa 450m² - Centro",
    local: "Paulista, São Paulo/SP",
    categoria: "Lajes",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    uf: "SP",
    precoAvaliacao: 2500000,
    precoAtual: 1250000,
    score: 98, // DEVE APARECER NO HERO
    status: 'green',
    fotos: ["https://images.unsplash.com/photo-1497366216548-37526070297c"]
  },
  {
    id: "2",
    nome: "Apartamento Studio Moderno",
    local: "Consolação, São Paulo/SP",
    categoria: "Apartamento",
    bairro: "Consolação",
    cidade: "São Paulo",
    uf: "SP",
    precoAvaliacao: 800000,
    precoAtual: 420000,
    score: 95, // DEVE APARECER NO HERO
    status: 'green',
    fotos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"]
  },
  {
    id: "3",
    nome: "Casa com Piscina - Condomínio",
    local: "Barra da Tijuca, RJ",
    categoria: "Casa",
    bairro: "Barra",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    precoAvaliacao: 3200000,
    precoAtual: 1900000,
    score: 92, // DEVE APARECER NO HERO
    status: 'yellow',
    fotos: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6"]
  },
  {
    id: "4",
    nome: "Apartamento Vista Mar",
    local: "Boa Viagem, Recife/PE",
    categoria: "Apartamento",
    bairro: "Boa Viagem",
    cidade: "Recife",
    uf: "PE",
    precoAvaliacao: 1500000,
    precoAtual: 750000,
    score: 91, // DEVE APARECER NO HERO
    status: 'green',
    fotos: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750"]
  },
  {
    id: "5",
    nome: "Galpão Industrial 1000m²",
    local: "Manaus, AM",
    categoria: "Galpão",
    bairro: "Distrito Industrial",
    cidade: "Manaus",
    uf: "AM",
    precoAvaliacao: 5000000,
    precoAtual: 2200000,
    score: 89, // DEVE APARECER NO HERO
    status: 'red',
    fotos: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"]
  },
  {
    id: "6",
    nome: "Cobertura Duplex",
    local: "Batista Campos, Belém/PA",
    categoria: "Apartamento",
    bairro: "Batista Campos",
    cidade: "Belém",
    uf: "PA",
    precoAvaliacao: 1800000,
    precoAtual: 900000,
    score: 88, // DEVE APARECER NO HERO
    status: 'green',
    fotos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"]
  },
  {
    id: "7",
    nome: "Casa de Vila Charmosa",
    local: "Vila Mariana, São Paulo/SP",
    categoria: "Casa",
    bairro: "Vila Mariana",
    cidade: "São Paulo",
    uf: "SP",
    precoAvaliacao: 1100000,
    precoAtual: 650000,
    score: 85, // NÃO DEVE APARECER NO HERO (SÓ TOP 6)
    status: 'green',
    fotos: ["https://images.unsplash.com/photo-1480074568708-e7b720bb3f09"]
  },
  // Gerando mais 5 itens genéricos para testar a paginação (total 12)
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: (i + 8).toString(),
    nome: `Imóvel de Teste Paginação ${i + 8}`,
    local: "Bairro, Cidade/UF",
    categoria: "Outros" as const,
    bairro: "Bairro Teste",
    cidade: "Cidade",
    uf: "UF",
    precoAvaliacao: 1000000,
    precoAtual: 500000,
    score: 70 - i,
    status: 'green' as const,
    fotos: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994"]
  }))
];