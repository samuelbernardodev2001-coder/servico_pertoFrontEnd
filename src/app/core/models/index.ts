// ==================== UUID TYPE ====================
export type UUID = string;

// ==================== ENUMS ====================
export enum Perfil {
  CLIENTE = 'CLIENTE',
  PRESTADOR = 'PRESTADOR',
  ADMIN = 'ADMIN'
}

export enum StatusOrdem {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

export enum StatusDenuncia {
  PENDENTE = 'PENDENTE',
  RESOLVIDA = 'RESOLVIDA',
  REJEITADA = 'REJEITADA'
}

export enum TipoUsuario {
  CLIENTE = 'CLIENTE',
  PRESTADOR = 'PRESTADOR',
  ADMIN = 'ADMIN'
}

// ==================== USER ====================
export interface Usuario {
  id: UUID;
  nome: string;
  email: string;
  senha?: string; // Somente para cadastro/login, não deve ser exposto em respostas
  telefone: string;
  fotoUrl: string;
  tipo: TipoUsuario;
  ativo: boolean;
  criadoEm: string; // ISO Date
  mediaAvaliacao?: number;
  totalAvaliacoes?: number;
  descricao?: string;
}

// ==================== CATEGORIA ====================
export interface Categoria {
  id: UUID;
  nome: string;
  icone: string;
  descricao: string;
  ativa: boolean;
  criadoEm: string;
}

// ==================== SERVICO ====================
export interface Servico {
  id: UUID;
  prestadorId: UUID;
  prestadorNome: string;
  prestadorFotoUrl: string;
  categoriaId: UUID;
  categoriaNome: string;
  titulo: string;
  descricao: string;
  preco: number; // BigDecimal simulado
  imagensUrls: string[]; // Máximo 5
  ativo: boolean;
  mediaAvaliacao: number;
  totalAvaliacoes: number;
  criadoEm: string;
}

// ==================== AVALIACAO ====================
export interface Avaliacao {
  id: UUID;
  ordemId: UUID;
  clienteId: UUID;
  clienteNome: string;
  servicoId: UUID;
  nota: number; // 1-5
  comentario: string;
  criadoEm: string;
}

// ==================== SERVICE ORDER ====================
export interface ServiceOrder {
  id: UUID;
  clienteId: UUID;
  clienteNome: string;
  prestadorId: UUID;
  prestadorNome: string;
  servicoId: UUID;
  servicoTitulo: string;
  status: StatusOrdem;
  descricao: string;
  endereco?: Endereco;
  valorTotal: number;
  criadoEm: string;
  atualizadoEm: string;
  concluidoEm?: string;
  motivoCancelamento?: string;
}

// ==================== ENDERECO ====================
export interface Endereco {
  id: UUID;
  clienteId: UUID;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
  lat: number;
  lng: number;
}

// ==================== MENSAGEM ====================
export interface Mensagem {
  id: UUID;
  ordemId: UUID;
  remetenteId: UUID;
  remetenteNome: string;
  conteudo: string;
  editada: boolean;
  criadoEm: string;
  atualizadoEm?: string;
}

// ==================== FAVORITO ====================
export interface Favorito {
  id: UUID;
  clienteId: UUID;
  servicoId: UUID;
  servico: Servico;
  criadoEm: string;
}

// ==================== DENUNCIA ====================
export interface Denuncia {
  id: UUID;
  ordemId: UUID;
  denuncianteId: UUID;
  denuncianteNome: string;
  denunciadoId: UUID;
  denunciadoNome: string;
  motivo: string;
  descricao: string;
  status: StatusDenuncia;
  criadoEm: string;
  resolvidoEm?: string;
  moderadorId?: UUID;
  observacaoModeracao?: string;
}

// ==================== PAGINATION ====================
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ==================== CHAT ====================
export interface ChatInfo {
  ordemId: UUID;
  servicoTitulo: string;
  prestadorNome: string;
  clienteNome: string;
  ultimaMensagem?: string;
  ultimaAtualizacao: string;
  naoLidas: number;
}

// ==================== NOTIFICACAO ====================
export interface Notificacao {
  id: UUID;
  tipo: 'NOVA_ORDEM' | 'ORDEM_ACEITA' | 'ORDEM_CONCLUIDA' | 'ORDEM_CANCELADA' | 'NOVA_MENSAGEM' | 'AVALIACAO';
  titulo: string;
  mensagem: string;
  lida: boolean;
  ordemId?: UUID;
  criadoEm: string;
}