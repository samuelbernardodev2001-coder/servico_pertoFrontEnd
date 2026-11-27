// src/app/core/services/dados-mock.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import {
  UUID, StatusOrdem, StatusDenuncia, TipoUsuario,
  Usuario, Categoria, Servico, Avaliacao, ServiceOrder,
  Endereco, Mensagem, Favorito, Denuncia, Notificacao,
  PaginatedResponse, ChatInfo
} from '../models';
import { AuthService } from './auth.service';

function dataISO(diasAtras: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - diasAtras);
  return d.toISOString();
}

// ==================== DADOS MOCKADOS ====================

const USUARIOS_MOCK: Usuario[] = [
  { id: 'u1', nome: 'Carlos Silva', email: 'carlos@email.com', telefone: '(11) 99999-0001', fotoUrl: 'https://i.pravatar.cc/150?u=carlos', tipo: TipoUsuario.CLIENTE, ativo: true, criadoEm: dataISO(90) },
  { id: 'u2', nome: 'Ana Oliveira', email: 'ana@email.com', telefone: '(11) 99999-0002', fotoUrl: 'https://i.pravatar.cc/150?u=ana', tipo: TipoUsuario.CLIENTE, ativo: true, criadoEm: dataISO(85) },
  { id: 'u3', nome: 'Mariana Santos', email: 'mariana@email.com', telefone: '(11) 99999-0003', fotoUrl: 'https://i.pravatar.cc/150?u=mariana', tipo: TipoUsuario.CLIENTE, ativo: true, criadoEm: dataISO(80) },
  { id: 'u4', nome: 'Pedro Souza', email: 'pedro@email.com', telefone: '(11) 99999-0004', fotoUrl: 'https://i.pravatar.cc/150?u=pedro', tipo: TipoUsuario.PRESTADOR, ativo: true, criadoEm: dataISO(75), mediaAvaliacao: 4.8, totalAvaliacoes: 23, descricao: 'Especialista em elétrica residencial e comercial' },
  { id: 'u5', nome: 'Lucia Costa', email: 'lucia@email.com', telefone: '(11) 99999-0005', fotoUrl: 'https://i.pravatar.cc/150?u=lucia', tipo: TipoUsuario.PRESTADOR, ativo: true, criadoEm: dataISO(70), mediaAvaliacao: 4.9, totalAvaliacoes: 45, descricao: 'Diarista profissional com 10 anos de experiência' },
  { id: 'u6', nome: 'Roberto Lima', email: 'roberto@email.com', telefone: '(11) 99999-0006', fotoUrl: 'https://i.pravatar.cc/150?u=roberto', tipo: TipoUsuario.PRESTADOR, ativo: true, criadoEm: dataISO(65), mediaAvaliacao: 4.7, totalAvaliacoes: 18, descricao: 'Jardineiro paisagista formado' },
  { id: 'u7', nome: 'Juliana Mendes', email: 'juliana@email.com', telefone: '(11) 99999-0007', fotoUrl: 'https://i.pravatar.cc/150?u=juliana', tipo: TipoUsuario.PRESTADOR, ativo: true, criadoEm: dataISO(60), mediaAvaliacao: 4.6, totalAvaliacoes: 31, descricao: 'Professora particular de matemática e física' },
  { id: 'u8', nome: 'Administrador', email: 'admin@marketplace.com', telefone: '(11) 99999-0008', fotoUrl: 'https://i.pravatar.cc/150?u=admin', tipo: TipoUsuario.ADMIN, ativo: true, criadoEm: dataISO(365) },
  { id: 'u9', nome: 'Inativo Teste', email: 'inativo@email.com', telefone: '(11) 99999-0009', fotoUrl: 'https://i.pravatar.cc/150?u=inativo', tipo: TipoUsuario.PRESTADOR, ativo: false, criadoEm: dataISO(50), descricao: 'Usuário inativo' },
];

const CATEGORIAS_MOCK: Categoria[] = [
  { id: 'c1', nome: 'Elétrica', icone: 'bolt', descricao: 'Serviços elétricos em geral', ativa: true, criadoEm: dataISO(100) },
  { id: 'c2', nome: 'Limpeza', icone: 'cleaning_services', descricao: 'Serviços de limpeza e faxina', ativa: true, criadoEm: dataISO(100) },
  { id: 'c3', nome: 'Jardinagem', icone: 'yard', descricao: 'Cuidados com jardins e áreas verdes', ativa: true, criadoEm: dataISO(100) },
  { id: 'c4', nome: 'Aulas Particulares', icone: 'school', descricao: 'Aulas e reforço escolar', ativa: true, criadoEm: dataISO(100) },
  { id: 'c5', nome: 'Pintura', icone: 'format_paint', descricao: 'Pintura residencial e comercial', ativa: true, criadoEm: dataISO(100) },
  { id: 'c6', nome: 'Encanamento', icone: 'plumbing', descricao: 'Serviços hidráulicos', ativa: true, criadoEm: dataISO(100) },
  { id: 'c7', nome: 'Informática', icone: 'computer', descricao: 'Manutenção de computadores e redes', ativa: true, criadoEm: dataISO(90) },
  { id: 'c8', nome: 'Inativa', icone: 'block', descricao: 'Categoria inativa', ativa: false, criadoEm: dataISO(80) },
];

const SERVICOS_MOCK: Servico[] = [
  { id: 's1', prestadorId: 'u4', prestadorNome: 'Pedro Souza', prestadorFotoUrl: 'https://i.pravatar.cc/150?u=pedro', categoriaId: 'c1', categoriaNome: 'Elétrica', titulo: 'Instalação Elétrica Residencial', descricao: 'Instalação completa de fiação, disjuntores e tomadas seguindo todas as normas de segurança.', preco: 350.00, imagensUrls: ['https://picsum.photos/seed/eletrica1/400/300', 'https://picsum.photos/seed/eletrica2/400/300', 'https://picsum.photos/seed/eletrica3/400/300'], ativo: true, mediaAvaliacao: 4.8, totalAvaliacoes: 23, criadoEm: dataISO(60) },
  { id: 's2', prestadorId: 'u4', prestadorNome: 'Pedro Souza', prestadorFotoUrl: 'https://i.pravatar.cc/150?u=pedro', categoriaId: 'c1', categoriaNome: 'Elétrica', titulo: 'Troca de Chuveiro Elétrico', descricao: 'Substituição de chuveiro elétrico com instalação segura e garantia.', preco: 120.00, imagensUrls: ['https://picsum.photos/seed/chuveiro1/400/300'], ativo: true, mediaAvaliacao: 4.9, totalAvaliacoes: 15, criadoEm: dataISO(55) },
  { id: 's3', prestadorId: 'u5', prestadorNome: 'Lucia Costa', prestadorFotoUrl: 'https://i.pravatar.cc/150?u=lucia', categoriaId: 'c2', categoriaNome: 'Limpeza', titulo: 'Faxina Completa (até 80m²)', descricao: 'Limpeza geral incluindo banheiros, cozinha, quartos e sala. Produtos inclusos.', preco: 180.00, imagensUrls: ['https://picsum.photos/seed/faxina1/400/300', 'https://picsum.photos/seed/faxina2/400/300'], ativo: true, mediaAvaliacao: 4.9, totalAvaliacoes: 45, criadoEm: dataISO(50) },
  { id: 's4', prestadorId: 'u5', prestadorNome: 'Lucia Costa', prestadorFotoUrl: 'https://i.pravatar.cc/150?u=lucia', categoriaId: 'c2', categoriaNome: 'Limpeza', titulo: 'Limpeza Pós-Obra', descricao: 'Limpeza pesada para remoção de resíduos de obra, poeira e entulho fino.', preco: 450.00, imagensUrls: ['https://picsum.photos/seed/posobra1/400/300', 'https://picsum.photos/seed/posobra2/400/300'], ativo: true, mediaAvaliacao: 4.7, totalAvaliacoes: 12, criadoEm: dataISO(45) },
  { id: 's5', prestadorId: 'u6', prestadorNome: 'Roberto Lima', prestadorFotoUrl: 'https://i.pravatar.cc/150?u=roberto', categoriaId: 'c3', categoriaNome: 'Jardinagem', titulo: 'Manutenção de Jardim Residencial', descricao: 'Podas, limpeza de folhas, adubação e controle de pragas.', preco: 150.00, imagensUrls: ['https://picsum.photos/seed/jardim1/400/300', 'https://picsum.photos/seed/jardim2/400/300', 'https://picsum.photos/seed/jardim3/400/300'], ativo: true, mediaAvaliacao: 4.7, totalAvaliacoes: 18, criadoEm: dataISO(40) },
  { id: 's6', prestadorId: 'u6', prestadorNome: 'Roberto Lima', prestadorFotoUrl: 'https://i.pravatar.cc/150?u=roberto', categoriaId: 'c3', categoriaNome: 'Jardinagem', titulo: 'Projeto Paisagístico', descricao: 'Criação de projeto paisagístico completo com escolha de espécies e layout.', preco: 500.00, imagensUrls: ['https://picsum.photos/seed/paisagismo1/400/300'], ativo: true, mediaAvaliacao: 5.0, totalAvaliacoes: 6, criadoEm: dataISO(35) },
  { id: 's7', prestadorId: 'u7', prestadorNome: 'Juliana Mendes', prestadorFotoUrl: 'https://i.pravatar.cc/150?u=juliana', categoriaId: 'c4', categoriaNome: 'Aulas Particulares', titulo: 'Aula de Matemática (Ensino Médio)', descricao: 'Aulas particulares de matemática para ensino médio. Reforço escolar e preparação para vestibular.', preco: 80.00, imagensUrls: ['https://picsum.photos/seed/matematica1/400/300'], ativo: true, mediaAvaliacao: 4.6, totalAvaliacoes: 31, criadoEm: dataISO(30) },
  { id: 's8', prestadorId: 'u7', prestadorNome: 'Juliana Mendes', prestadorFotoUrl: 'https://i.pravatar.cc/150?u=juliana', categoriaId: 'c4', categoriaNome: 'Aulas Particulares', titulo: 'Aula de Física (Vestibular)', descricao: 'Aulas focadas em física para vestibulares e ENEM. Exercícios e resolução de provas anteriores.', preco: 90.00, imagensUrls: ['https://picsum.photos/seed/fisica1/400/300', 'https://picsum.photos/seed/fisica2/400/300'], ativo: true, mediaAvaliacao: 4.8, totalAvaliacoes: 14, criadoEm: dataISO(25) },
  { id: 's9', prestadorId: 'u4', prestadorNome: 'Pedro Souza', prestadorFotoUrl: 'https://i.pravatar.cc/150?u=pedro', categoriaId: 'c5', categoriaNome: 'Pintura', titulo: 'Pintura de Parede (até 20m²)', descricao: 'Pintura de paredes internas com tinta látex de alta qualidade. Inclui preparação da superfície.', preco: 200.00, imagensUrls: ['https://picsum.photos/seed/pintura1/400/300'], ativo: true, mediaAvaliacao: 4.5, totalAvaliacoes: 9, criadoEm: dataISO(20) },
  { id: 's10', prestadorId: 'u4', prestadorNome: 'Pedro Souza', prestadorFotoUrl: 'https://i.pravatar.cc/150?u=pedro', categoriaId: 'c6', categoriaNome: 'Encanamento', titulo: 'Desentupimento de Pias e Tanques', descricao: 'Desentupimento rápido e eficiente com equipamento profissional.', preco: 100.00, imagensUrls: ['https://picsum.photos/seed/encanamento1/400/300'], ativo: true, mediaAvaliacao: 4.3, totalAvaliacoes: 11, criadoEm: dataISO(15) },
  { id: 's11', prestadorId: 'u9', prestadorNome: 'Inativo Teste', prestadorFotoUrl: 'https://i.pravatar.cc/150?u=inativo', categoriaId: 'c7', categoriaNome: 'Informática', titulo: 'Manutenção de Computador', descricao: 'Serviço de prestador inativo - não deve aparecer em buscas.', preco: 150.00, imagensUrls: [], ativo: false, mediaAvaliacao: 0, totalAvaliacoes: 0, criadoEm: dataISO(10) },
];

const AVALIACOES_MOCK: Avaliacao[] = [
  { id: 'a1', ordemId: 'o3', clienteId: 'u1', clienteNome: 'Carlos Silva', servicoId: 's1', nota: 5, comentario: 'Excelente serviço! Profissional pontual e muito cuidadoso.', criadoEm: dataISO(5) },
  { id: 'a2', ordemId: 'o4', clienteId: 'u1', clienteNome: 'Carlos Silva', servicoId: 's7', nota: 4, comentario: 'Muito boa professora, me ajudou muito com cálculo.', criadoEm: dataISO(3) },
  { id: 'a3', ordemId: 'o5', clienteId: 'u2', clienteNome: 'Ana Oliveira', servicoId: 's3', nota: 5, comentario: 'Limpeza impecável! Super recomendo.', criadoEm: dataISO(2) },
];

const ENDERECOS_MOCK: Endereco[] = [
  { id: 'e1', clienteId: 'u1', rua: 'Rua das Flores', numero: '123', bairro: 'Jardim Paulista', cidade: 'São Paulo', estado: 'SP', cep: '01310-100', complemento: 'Apto 42', lat: -23.561, lng: -46.656 },
  { id: 'e2', clienteId: 'u2', rua: 'Av. Brigadeiro Faria Lima', numero: '1500', bairro: 'Itaim Bibi', cidade: 'São Paulo', estado: 'SP', cep: '01452-001', complemento: 'Sala 501', lat: -23.581, lng: -46.678 },
  { id: 'e3', clienteId: 'u3', rua: 'Rua Augusta', numero: '2500', bairro: 'Consolação', cidade: 'São Paulo', estado: 'SP', cep: '01412-000', lat: -23.556, lng: -46.660 },
];

const ORDENS_MOCK: ServiceOrder[] = [
  { id: 'o1', clienteId: 'u1', clienteNome: 'Carlos Silva', prestadorId: 'u4', prestadorNome: 'Pedro Souza', servicoId: 's1', servicoTitulo: 'Instalação Elétrica Residencial', status: StatusOrdem.REQUESTED, descricao: 'Preciso instalar 3 tomadores e trocar o disjuntor geral.', valorTotal: 350.00, criadoEm: dataISO(1), atualizadoEm: dataISO(1) },
  { id: 'o2', clienteId: 'u1', clienteNome: 'Carlos Silva', prestadorId: 'u4', prestadorNome: 'Pedro Souza', servicoId: 's2', servicoTitulo: 'Troca de Chuveiro Elétrico', status: StatusOrdem.ACCEPTED, descricao: 'Meu chuveiro queimou, preciso trocar urgente.', valorTotal: 120.00, criadoEm: dataISO(3), atualizadoEm: dataISO(2) },
  { id: 'o3', clienteId: 'u1', clienteNome: 'Carlos Silva', prestadorId: 'u4', prestadorNome: 'Pedro Souza', servicoId: 's1', servicoTitulo: 'Instalação Elétrica Residencial', status: StatusOrdem.COMPLETED, descricao: 'Instalação de lustre na sala.', valorTotal: 200.00, criadoEm: dataISO(10), atualizadoEm: dataISO(7), concluidoEm: dataISO(6) },
  { id: 'o4', clienteId: 'u1', clienteNome: 'Carlos Silva', prestadorId: 'u7', prestadorNome: 'Juliana Mendes', servicoId: 's7', servicoTitulo: 'Aula de Matemática', status: StatusOrdem.COMPLETED, descricao: 'Preciso de reforço em cálculo diferencial.', valorTotal: 240.00, criadoEm: dataISO(8), atualizadoEm: dataISO(5), concluidoEm: dataISO(5) },
  { id: 'o5', clienteId: 'u2', clienteNome: 'Ana Oliveira', prestadorId: 'u5', prestadorNome: 'Lucia Costa', servicoId: 's3', servicoTitulo: 'Faxina Completa', status: StatusOrdem.COMPLETED, descricao: 'Apartamento de 70m² precisa de faxina completa.', valorTotal: 180.00, criadoEm: dataISO(6), atualizadoEm: dataISO(4), concluidoEm: dataISO(4) },
  { id: 'o6', clienteId: 'u2', clienteNome: 'Ana Oliveira', prestadorId: 'u5', prestadorNome: 'Lucia Costa', servicoId: 's3', servicoTitulo: 'Faxina Completa', status: StatusOrdem.CANCELED, descricao: 'Cliente cancelou antes de aceitação.', valorTotal: 180.00, criadoEm: dataISO(12), atualizadoEm: dataISO(12), motivoCancelamento: 'Cliente desistiu do serviço' },
  { id: 'o7', clienteId: 'u2', clienteNome: 'Ana Oliveira', prestadorId: 'u4', prestadorNome: 'Pedro Souza', servicoId: 's2', servicoTitulo: 'Troca de Chuveiro Elétrico', status: StatusOrdem.REQUESTED, descricao: 'Chuveiro está dando choque quando liga.', valorTotal: 120.00, criadoEm: dataISO(0), atualizadoEm: dataISO(0) },
  { id: 'o8', clienteId: 'u3', clienteNome: 'Mariana Santos', prestadorId: 'u6', prestadorNome: 'Roberto Lima', servicoId: 's5', servicoTitulo: 'Manutenção de Jardim', status: StatusOrdem.ACCEPTED, descricao: 'Jardim precisa de poda e limpeza geral.', valorTotal: 150.00, criadoEm: dataISO(2), atualizadoEm: dataISO(1) },
];

const MENSAGENS_MOCK: Mensagem[] = [
  { id: 'm1', ordemId: 'o1', remetenteId: 'u1', remetenteNome: 'Carlos Silva', conteudo: 'Olá Pedro! Preciso de uma instalação elétrica.', editada: false, criadoEm: dataISO(1) },
  { id: 'm2', ordemId: 'o1', remetenteId: 'u4', remetenteNome: 'Pedro Souza', conteudo: 'Olá Carlos! Pode me dar mais detalhes?', editada: false, criadoEm: dataISO(1) },
  { id: 'm3', ordemId: 'o1', remetenteId: 'u1', remetenteNome: 'Carlos Silva', conteudo: 'Preciso instalar 3 tomadas e trocar um disjuntor.', editada: false, criadoEm: dataISO(1) },
  { id: 'm4', ordemId: 'o1', remetenteId: 'u4', remetenteNome: 'Pedro Souza', conteudo: 'Perfeito, posso ir amanhã às 14h.', editada: true, criadoEm: dataISO(1), atualizadoEm: dataISO(1) },
  { id: 'm5', ordemId: 'o2', remetenteId: 'u1', remetenteNome: 'Carlos Silva', conteudo: 'Pedro, meu chuveiro queimou!', editada: false, criadoEm: dataISO(3) },
  { id: 'm6', ordemId: 'o2', remetenteId: 'u4', remetenteNome: 'Pedro Souza', conteudo: 'Vou verificar o endereço e já passo por aí.', editada: false, criadoEm: dataISO(2) },
  { id: 'm7', ordemId: 'o8', remetenteId: 'u3', remetenteNome: 'Mariana Santos', conteudo: 'Roberto, pode vir amanhã?', editada: false, criadoEm: dataISO(2) },
  { id: 'm8', ordemId: 'o8', remetenteId: 'u6', remetenteNome: 'Roberto Lima', conteudo: 'Sim, marcarei para as 9h.', editada: false, criadoEm: dataISO(1) },
];

const FAVORITOS_MOCK: Favorito[] = [
  { id: 'f1', clienteId: 'u1', servicoId: 's3', servico: SERVICOS_MOCK[2], criadoEm: dataISO(10) },
  { id: 'f2', clienteId: 'u1', servicoId: 's5', servico: SERVICOS_MOCK[4], criadoEm: dataISO(5) },
  { id: 'f3', clienteId: 'u2', servicoId: 's1', servico: SERVICOS_MOCK[0], criadoEm: dataISO(7) },
];

const DENUNCIAS_MOCK: Denuncia[] = [
  { id: 'd1', ordemId: 'o6', denuncianteId: 'u2', denuncianteNome: 'Ana Oliveira', denunciadoId: 'u5', denunciadoNome: 'Lucia Costa', motivo: 'Não comparecimento', descricao: 'A profissional não compareceu no horário agendado.', status: StatusDenuncia.PENDENTE, criadoEm: dataISO(5) },
  { id: 'd2', ordemId: 'o3', denuncianteId: 'u1', denuncianteNome: 'Carlos Silva', denunciadoId: 'u4', denunciadoNome: 'Pedro Souza', motivo: 'Cobrança abusiva', descricao: 'Foi cobrado um valor adicional não combinado.', status: StatusDenuncia.RESOLVIDA, criadoEm: dataISO(15), resolvidoEm: dataISO(13), moderadorId: 'u8', observacaoModeracao: 'Prestador reembolsou a diferença. Resolvido amigavelmente.' },
  { id: 'd3', ordemId: 'o6', denuncianteId: 'u1', denuncianteNome: 'Carlos Silva', denunciadoId: 'u7', denunciadoNome: 'Juliana Mendes', motivo: 'Assédio', descricao: 'Comportamento inadequado durante a aula.', status: StatusDenuncia.REJEITADA, criadoEm: dataISO(20), resolvidoEm: dataISO(18), moderadorId: 'u8', observacaoModeracao: 'Denúncia sem provas suficientes. Rejeitada.' },
];

const NOTIFICACOES_MOCK: Notificacao[] = [
  { id: 'n1', tipo: 'NOVA_ORDEM', titulo: 'Nova solicitação!', mensagem: 'Carlos Silva solicitou Instalação Elétrica', lida: false, ordemId: 'o1', criadoEm: dataISO(1) },
  { id: 'n2', tipo: 'ORDEM_ACEITA', titulo: 'Ordem aceita', mensagem: 'Pedro Souza aceitou Troca de Chuveiro', lida: false, ordemId: 'o2', criadoEm: dataISO(2) },
  { id: 'n3', tipo: 'ORDEM_CONCLUIDA', titulo: 'Serviço concluído!', mensagem: 'Instalação Elétrica foi concluída', lida: true, ordemId: 'o3', criadoEm: dataISO(6) },
];

const MOCK_DELAY = 300;

@Injectable({ providedIn: 'root' })
export class DadosMockService {
  private authService = inject(AuthService);
  
  private servicosSubject = new BehaviorSubject<Servico[]>([...SERVICOS_MOCK]);
  private ordensSubject = new BehaviorSubject<ServiceOrder[]>([...ORDENS_MOCK]);
  private mensagensSubject = new BehaviorSubject<Mensagem[]>([...MENSAGENS_MOCK]);
  private favoritosSubject = new BehaviorSubject<Favorito[]>([...FAVORITOS_MOCK]);
  private denunciasSubject = new BehaviorSubject<Denuncia[]>([...DENUNCIAS_MOCK]);
  private avaliacoesSubject = new BehaviorSubject<Avaliacao[]>([...AVALIACOES_MOCK]);
  private categoriasSubject = new BehaviorSubject<Categoria[]>([...CATEGORIAS_MOCK]);
  private usuariosSubject = new BehaviorSubject<Usuario[]>([...USUARIOS_MOCK]);

  servicos$ = this.servicosSubject.asObservable();
  ordens$ = this.ordensSubject.asObservable();
  mensagens$ = this.mensagensSubject.asObservable();
  favoritos$ = this.favoritosSubject.asObservable();
  denuncias$ = this.denunciasSubject.asObservable();
  avaliacoes$ = this.avaliacoesSubject.asObservable();
  categorias$ = this.categoriasSubject.asObservable();
  usuarios$ = this.usuariosSubject.asObservable();

  constructor() {}

  // 🔵 CORRIGIDO - Usa AuthService
  private getCurrentUserId(): UUID {
    return this.authService.getCurrentUserId();
  }

  // 🔵 CORRIGIDO - Usa AuthService
  private getCurrentUserName(): string {
    return this.authService.getCurrentUserNome();
  }

  private paginate<T>(data: T[], page: number = 0, size: number = 20): PaginatedResponse<T> {
    const start = page * size;
    const end = start + size;
    const content = data.slice(start, end);
    return {
      content,
      totalElements: data.length,
      totalPages: Math.ceil(data.length / size),
      size,
      number: page,
      numberOfElements: content.length,
      first: page === 0,
      last: end >= data.length,
      empty: content.length === 0
    };
  }

  private delay(ms: number = MOCK_DELAY): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==================== SERVIÇOS ====================

  async listarServicos(page: number = 0, size: number = 20, filtroCategoria?: string, busca?: string): Promise<PaginatedResponse<Servico>> {
    await this.delay();
    let servicos = this.servicosSubject.value.filter(s => s.ativo);
    
    if (filtroCategoria) {
      servicos = servicos.filter(s => s.categoriaId === filtroCategoria);
    }
    if (busca) {
      const buscaLower = busca.toLowerCase();
      servicos = servicos.filter(s => 
        s.titulo.toLowerCase().includes(buscaLower) ||
        s.descricao.toLowerCase().includes(buscaLower) ||
        s.prestadorNome.toLowerCase().includes(buscaLower)
      );
    }
    
    return this.paginate(servicos, page, size);
  }

  async getServicoById(id: UUID): Promise<Servico> {
    await this.delay();
    const servico = this.servicosSubject.value.find(s => s.id === id);
    if (!servico) throw new Error('Serviço não encontrado');
    return { ...servico };
  }

  // 🔵 CORRIGIDO - Sem parâmetro, usa usuário logado
  async listarServicosDoPrestador(incluirInativos: boolean = false): Promise<Servico[]> {
    await this.delay();
    const prestadorId = this.getCurrentUserId();
    let servicos = this.servicosSubject.value.filter(s => s.prestadorId === prestadorId);
    if (!incluirInativos) {
      servicos = servicos.filter(s => s.ativo);
    }
    return [...servicos];
  }

  // 🔵 CORRIGIDO - Usa dados do usuário logado
  async criarServico(servico: Omit<Servico, 'id' | 'criadoEm' | 'prestadorId' | 'prestadorNome' | 'prestadorFotoUrl'>): Promise<Servico> {
    await this.delay();
    const user = this.authService.currentUser();
    const novo: Servico = {
      ...servico,
      id: uuidv4(),
      prestadorId: user?.id || this.getCurrentUserId(),
      prestadorNome: user?.nome || this.getCurrentUserName(),
      prestadorFotoUrl: user?.fotoUrl || 'https://i.pravatar.cc/150',
      criadoEm: new Date().toISOString()
    };
    const current = this.servicosSubject.value;
    this.servicosSubject.next([...current, novo]);
    return { ...novo };
  }

  async atualizarServico(id: UUID, dados: Partial<Servico>): Promise<Servico> {
    await this.delay();
    const current = this.servicosSubject.value;
    const index = current.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Serviço não encontrado');
    
    const updated = { ...current[index], ...dados };
    const newList = [...current];
    newList[index] = updated;
    this.servicosSubject.next(newList);
    return { ...updated };
  }

  // ==================== ORDENS ====================

  async listarOrdens(page: number = 0, size: number = 20, filtroStatus?: StatusOrdem): Promise<PaginatedResponse<ServiceOrder>> {
    await this.delay();
    let ordens = this.ordensSubject.value;
    if (filtroStatus) {
      ordens = ordens.filter(o => o.status === filtroStatus);
    }
    return this.paginate(ordens, page, size);
  }

  // 🔵 CORRIGIDO - Sem parâmetro, usa usuário logado
  async listarOrdensDoCliente(): Promise<ServiceOrder[]> {
    await this.delay();
    const clienteId = this.getCurrentUserId();
    return this.ordensSubject.value
      .filter(o => o.clienteId === clienteId)
      .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
  }

  // 🔵 CORRIGIDO - Sem parâmetro, usa usuário logado
  async listarOrdensDoPrestador(): Promise<ServiceOrder[]> {
    await this.delay();
    const prestadorId = this.getCurrentUserId();
    return this.ordensSubject.value
      .filter(o => o.prestadorId === prestadorId)
      .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
  }

  async getOrdemById(id: UUID): Promise<ServiceOrder> {
    await this.delay();
    const ordem = this.ordensSubject.value.find(o => o.id === id);
    if (!ordem) throw new Error('Ordem não encontrada');
    return { ...ordem };
  }

  // 🔵 CORRIGIDO - Usa usuário logado
  async criarOrdem(dados: { servicoId: UUID; prestadorId: UUID; descricao: string; valorTotal: number }): Promise<ServiceOrder> {
    await this.delay();
    const clienteId = this.getCurrentUserId();
    const clienteNome = this.getCurrentUserName();
    const servico = this.servicosSubject.value.find(s => s.id === dados.servicoId);
    const prestador = USUARIOS_MOCK.find(u => u.id === dados.prestadorId);
    
    const novaOrdem: ServiceOrder = {
      id: uuidv4(),
      clienteId,
      clienteNome,
      prestadorId: dados.prestadorId,
      prestadorNome: prestador?.nome || 'Desconhecido',
      servicoId: dados.servicoId,
      servicoTitulo: servico?.titulo || 'Serviço',
      status: StatusOrdem.REQUESTED,
      descricao: dados.descricao,
      valorTotal: dados.valorTotal,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };
    
    const current = this.ordensSubject.value;
    this.ordensSubject.next([...current, novaOrdem]);
    return { ...novaOrdem };
  }

  async atualizarStatusOrdem(ordemId: UUID, novoStatus: StatusOrdem, usuarioId: UUID): Promise<ServiceOrder> {
    await this.delay();
    const current = this.ordensSubject.value;
    const ordem = current.find(o => o.id === ordemId);
    if (!ordem) throw new Error('Ordem não encontrada');

    if (ordem.status === StatusOrdem.COMPLETED || ordem.status === StatusOrdem.CANCELED) {
      throw new Error('Ordens finalizadas não podem ter status alterado');
    }

    const role = localStorage.getItem('app_current_role') || 'CLIENTE';

    if (novoStatus === StatusOrdem.ACCEPTED && role !== 'PRESTADOR') {
      throw new Error('Apenas o prestador pode aceitar ordens');
    }

    if (novoStatus === StatusOrdem.COMPLETED && role !== 'PRESTADOR') {
      throw new Error('Apenas o prestador pode concluir ordens');
    }

    if (novoStatus === StatusOrdem.ACCEPTED && ordem.status !== StatusOrdem.REQUESTED) {
      throw new Error('Só é possível aceitar ordens em status REQUESTED');
    }

    if (novoStatus === StatusOrdem.COMPLETED && ordem.status !== StatusOrdem.ACCEPTED) {
      throw new Error('Só é possível concluir ordens em status ACCEPTED');
    }

    if (novoStatus === StatusOrdem.CANCELED && role === 'CLIENTE' && ordem.status !== StatusOrdem.REQUESTED) {
      throw new Error('Cliente só pode cancelar ordens em status REQUESTED');
    }

    const updated: ServiceOrder = {
      ...ordem,
      status: novoStatus,
      atualizadoEm: new Date().toISOString(),
      concluidoEm: novoStatus === StatusOrdem.COMPLETED ? new Date().toISOString() : ordem.concluidoEm
    };

    const newList = [...current];
    const index = newList.findIndex(o => o.id === ordemId);
    newList[index] = updated;
    this.ordensSubject.next(newList);

    return { ...updated };
  }

  // ==================== ENDEREÇO (LGPD) ====================

  async getEnderecoCliente(clienteId: UUID, prestadorId: UUID): Promise<Endereco> {
    await this.delay();
    const ordemAtiva = this.ordensSubject.value.find(
      o => o.clienteId === clienteId && o.prestadorId === prestadorId && o.status === StatusOrdem.ACCEPTED
    );
    if (!ordemAtiva) {
      throw { status: 400, code: 'BUSINESS_ERROR', message: 'Endereço não disponível – só é visível após ordem aceita e antes de ser concluída' };
    }
    const endereco = ENDERECOS_MOCK.find(e => e.clienteId === clienteId);
    if (!endereco) throw new Error('Endereço não encontrado');
    return { ...endereco };
  }

  // ==================== MENSAGENS / CHAT ====================

  async listarChatsDoUsuario(usuarioId: UUID): Promise<ChatInfo[]> {
    await this.delay();
    const ordens = this.ordensSubject.value.filter(o => o.clienteId === usuarioId || o.prestadorId === usuarioId);
    return ordens.map(ordem => {
      const msgs = this.mensagensSubject.value.filter(m => m.ordemId === ordem.id);
      const ultimaMsg = msgs[msgs.length - 1];
      return {
        ordemId: ordem.id,
        servicoTitulo: ordem.servicoTitulo,
        prestadorNome: ordem.prestadorNome,
        clienteNome: ordem.clienteNome,
        ultimaMensagem: ultimaMsg?.conteudo,
        ultimaAtualizacao: ultimaMsg?.criadoEm || ordem.criadoEm,
        naoLidas: msgs.filter(m => m.remetenteId !== usuarioId).length
      };
    }).sort((a, b) => new Date(b.ultimaAtualizacao).getTime() - new Date(a.ultimaAtualizacao).getTime());
  }

  async listarMensagens(ordemId: UUID, page: number = 0, size: number = 20): Promise<PaginatedResponse<Mensagem>> {
    await this.delay();
    const mensagens = this.mensagensSubject.value
      .filter(m => m.ordemId === ordemId)
      .sort((a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime());
    return this.paginate(mensagens, page, size);
  }

  async enviarMensagem(ordemId: UUID, conteudo: string): Promise<Mensagem> {
    await this.delay(100);
    const userId = this.getCurrentUserId();
    const userName = this.getCurrentUserName();
    const nova: Mensagem = {
      id: uuidv4(),
      ordemId,
      remetenteId: userId,
      remetenteNome: userName,
      conteudo,
      editada: false,
      criadoEm: new Date().toISOString()
    };
    this.mensagensSubject.next([...this.mensagensSubject.value, nova]);
    return { ...nova };
  }

  async editarMensagem(mensagemId: UUID, novoConteudo: string): Promise<Mensagem> {
    await this.delay();
    const current = this.mensagensSubject.value;
    const index = current.findIndex(m => m.id === mensagemId);
    if (index === -1) throw new Error('Mensagem não encontrada');
    const updated = { ...current[index], conteudo: novoConteudo, editada: true, atualizadoEm: new Date().toISOString() };
    const newList = [...current];
    newList[index] = updated;
    this.mensagensSubject.next(newList);
    return { ...updated };
  }

  // ==================== FAVORITOS ====================

  // 🔵 CORRIGIDO - Sem parâmetro, usa usuário logado
  async listarFavoritos(): Promise<Favorito[]> {
    await this.delay();
    const clienteId = this.getCurrentUserId();
    return this.favoritosSubject.value
      .filter(f => f.clienteId === clienteId)
      .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
  }

  async isFavorito(clienteId: UUID, servicoId: UUID): Promise<boolean> {
    await this.delay(50);
    return this.favoritosSubject.value.some(f => f.clienteId === clienteId && f.servicoId === servicoId);
  }

  async toggleFavorito(servicoId: UUID): Promise<boolean> {
    await this.delay(100);
    const clienteId = this.getCurrentUserId();
    const existing = this.favoritosSubject.value.find(f => f.clienteId === clienteId && f.servicoId === servicoId);
    if (existing) {
      this.favoritosSubject.next(this.favoritosSubject.value.filter(f => f.id !== existing.id));
      return false;
    } else {
      const servico = this.servicosSubject.value.find(s => s.id === servicoId);
      if (!servico) throw new Error('Serviço não encontrado');
      const novo: Favorito = {
        id: uuidv4(),
        clienteId,
        servicoId,
        servico,
        criadoEm: new Date().toISOString()
      };
      this.favoritosSubject.next([...this.favoritosSubject.value, novo]);
      return true;
    }
  }

  // ==================== DENÚNCIAS / ADMIN ====================

  async listarDenuncias(page: number = 0, size: number = 20, filtroStatus?: StatusDenuncia): Promise<PaginatedResponse<Denuncia>> {
    await this.delay();
    let denuncias = this.denunciasSubject.value;
    if (filtroStatus) {
      denuncias = denuncias.filter(d => d.status === filtroStatus);
    }
    return this.paginate(denuncias, page, size);
  }

  async moderarDenuncia(denunciaId: UUID, status: StatusDenuncia, observacao: string): Promise<Denuncia> {
    await this.delay();
    const current = this.denunciasSubject.value;
    const index = current.findIndex(d => d.id === denunciaId);
    if (index === -1) throw new Error('Denúncia não encontrada');
    const updated: Denuncia = {
      ...current[index],
      status,
      resolvidoEm: new Date().toISOString(),
      moderadorId: this.getCurrentUserId(),
      observacaoModeracao: observacao
    };
    const newList = [...current];
    newList[index] = updated;
    this.denunciasSubject.next(newList);
    return { ...updated };
  }

  // ==================== CATEGORIAS ====================

  async listarCategorias(page: number = 0, size: number = 20): Promise<PaginatedResponse<Categoria>> {
    await this.delay();
    const ativas = this.categoriasSubject.value.filter(c => c.ativa);
    return this.paginate(ativas, page, size);
  }

  async listarCategoriasTodas(): Promise<Categoria[]> {
    await this.delay();
    return [...this.categoriasSubject.value];
  }

  async criarCategoria(dados: Omit<Categoria, 'id' | 'criadoEm'>): Promise<Categoria> {
    await this.delay();
    const nova: Categoria = { ...dados, id: uuidv4(), criadoEm: new Date().toISOString() };
    this.categoriasSubject.next([...this.categoriasSubject.value, nova]);
    return { ...nova };
  }

  async atualizarCategoria(id: UUID, dados: Partial<Categoria>): Promise<Categoria> {
    await this.delay();
    const current = this.categoriasSubject.value;
    const index = current.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Categoria não encontrada');
    const updated = { ...current[index], ...dados };
    const newList = [...current];
    newList[index] = updated;
    this.categoriasSubject.next(newList);
    return { ...updated };
  }

  // ==================== USUÁRIOS ====================

  async listarUsuarios(page: number = 0, size: number = 20, incluirInativos: boolean = false): Promise<PaginatedResponse<Usuario>> {
    await this.delay();
    let usuarios = this.usuariosSubject.value;
    if (!incluirInativos) {
      usuarios = usuarios.filter(u => u.ativo);
    }
    return this.paginate(usuarios, page, size);
  }

  async toggleUsuarioAtivo(usuarioId: UUID): Promise<Usuario> {
    await this.delay();
    const current = this.usuariosSubject.value;
    const index = current.findIndex(u => u.id === usuarioId);
    if (index === -1) throw new Error('Usuário não encontrado');
    const updated = { ...current[index], ativo: !current[index].ativo };
    const newList = [...current];
    newList[index] = updated;
    this.usuariosSubject.next(newList);
    if (!updated.ativo && updated.tipo === TipoUsuario.PRESTADOR) {
      const servicos = this.servicosSubject.value.map(s => s.prestadorId === usuarioId ? { ...s, ativo: false } : s);
      this.servicosSubject.next(servicos);
    }
    return { ...updated };
  }

  // ==================== AVALIAÇÕES ====================

  async avaliarOrdem(ordemId: UUID, nota: number, comentario: string): Promise<Avaliacao> {
    await this.delay();
    const ordem = this.ordensSubject.value.find(o => o.id === ordemId);
    if (!ordem) throw new Error('Ordem não encontrada');
    if (ordem.status !== StatusOrdem.COMPLETED) {
      throw new Error('Só é possível avaliar ordens concluídas');
    }
    const avaliacao: Avaliacao = {
      id: uuidv4(),
      ordemId,
      clienteId: this.getCurrentUserId(),
      clienteNome: this.getCurrentUserName(),
      servicoId: ordem.servicoId,
      nota,
      comentario,
      criadoEm: new Date().toISOString()
    };
    this.avaliacoesSubject.next([...this.avaliacoesSubject.value, avaliacao]);
    return { ...avaliacao };
  }

  async criarDenuncia(dados: { 
  ordemId: UUID; 
  denuncianteId: UUID; 
  denunciadoId: UUID; 
  motivo: string; 
  descricao: string 
}): Promise<Denuncia> {
  await this.delay();
  
  const todosUsuarios = [...USUARIOS_MOCK, ...this.usuariosSubject.value];
  const denunciante = todosUsuarios.find(u => u.id === dados.denuncianteId)
    || (this.authService.currentUser()?.id === dados.denuncianteId ? this.authService.currentUser() : undefined);
  const denunciado = todosUsuarios.find(u => u.id === dados.denunciadoId);
  
  const novaDenuncia: Denuncia = {
    id: uuidv4(),
    ordemId: dados.ordemId,
    denuncianteId: dados.denuncianteId,
    denuncianteNome: denunciante?.nome || 'Desconhecido',
    denunciadoId: dados.denunciadoId,
    denunciadoNome: denunciado?.nome || 'Desconhecido',
    motivo: dados.motivo,
    descricao: dados.descricao,
    status: StatusDenuncia.PENDENTE,
    criadoEm: new Date().toISOString()
  };
  
  const current = this.denunciasSubject.value;
  this.denunciasSubject.next([...current, novaDenuncia]);
  return { ...novaDenuncia };
}
}