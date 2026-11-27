import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/vitrine', pathMatch: 'full' },
  {
    path: 'vitrine',
    loadComponent: () => import('./features/vitrine/vitrine.component').then(m => m.VitrineComponent),
    title: 'Serviços Disponíveis'
  },
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'cadastro', loadComponent: () => import('./features/auth/cadastro.component').then(m => m.CadastroComponent) },
  {
    path: 'servico/:id',
    loadComponent: () => import('./features/vitrine/detalhe-servico/detalhe-servico.component').then(m => m.DetalheServicoComponent),
    title: 'Detalhes do Serviço'
  },
  {
    path: 'ordens',
    loadComponent: () => import('./features/ordens/ordens.component').then(m => m.OrdensComponent),
    title: 'Minhas Ordens'
  },
  {
    path: 'ordem/:id',
    loadComponent: () => import('./features/ordens/detalhe-ordem/detalhe-ordem.component').then(m => m.DetalheOrdemComponent),
    title: 'Detalhes da Ordem'
  },
  {
    path: 'ordem/:id/chat',   // ← CAMINHO CORRIGIDO
    loadComponent: () => import('./features/chat/chat.component').then(m => m.ChatComponent),
    title: 'Chat'
  },
  {
    path: 'favoritos',
    loadComponent: () => import('./features/favoritos/favoritos.component').then(m => m.FavoritosComponent),
    title: 'Meus Favoritos'
  },
  {
    path: 'prestador',
    children: [
      { path: '', redirectTo: 'servicos', pathMatch: 'full' },  // ← Redirecionamento adicionado
      { path: 'servicos', loadComponent: () => import('./features/prestador/meus-servicos/meus-servicos.component').then(m => m.MeusServicosComponent), title: 'Meus Serviços' },
      { path: 'servico/novo', loadComponent: () => import('./features/prestador/form-servico/form-servico.component').then(m => m.FormServicoComponent), title: 'Novo Serviço' },
      { path: 'servico/:id/editar', loadComponent: () => import('./features/prestador/form-servico/form-servico.component').then(m => m.FormServicoComponent), title: 'Editar Serviço' },
      { path: 'galeria/:servicoId', loadComponent: () => import('./features/prestador/galeria/galeria.component').then(m => m.GaleriaComponent), title: 'Galeria de Fotos' }
    ]
  },
  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'denuncias', pathMatch: 'full' },  // ← Redirecionamento adicionado
      { path: 'denuncias', loadComponent: () => import('./features/admin/denuncias/denuncias.component').then(m => m.DenunciasComponent), title: 'Moderação de Denúncias' },
      { path: 'categorias', loadComponent: () => import('./features/admin/categorias/categorias.component').then(m => m.CategoriasComponent), title: 'Gestão de Categorias' },
      { path: 'usuarios', loadComponent: () => import('./features/admin/usuarios/usuarios.component').then(m => m.UsuariosComponent), title: 'Usuários' }
    ]
  },
  { path: '**', redirectTo: '/vitrine' }
];