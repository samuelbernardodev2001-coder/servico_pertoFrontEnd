# ServiçoPerto

Marketplace de serviços locais desenvolvido com **Angular 19** (standalone components, signals e lazy loading de rotas). O projeto simula um backend completo usando um serviço de dados mockados em memória (`DadosMockService`), o que permite testar todos os fluxos da aplicação sem necessidade de API real.

## Funcionalidades

- **Vitrine de serviços** — listagem com busca, filtro por categoria e paginação
- **Detalhe do serviço** — galeria de imagens, avaliações e solicitação de orçamento
- **Três perfis de acesso** — Cliente, Prestador e Admin (alternáveis pelo seletor "Modo" no header)
- **Ordens de serviço** — fluxo completo: solicitação → aceite → conclusão/cancelamento
- **Chat** — conversa por ordem com edição de mensagens
- **Favoritos** — clientes podem favoritar serviços
- **Avaliações** — clientes avaliam ordens concluídas (nota de 1 a 5)
- **Denúncias** — moderação pelo painel admin (pendente → resolvida/rejeitada)
- **Gestão admin** — categorias e usuários (ativar/desativar)
- **LGPD** — endereço do cliente só aparece para o prestador após a ordem ser aceita

## Contas de demonstração

Na tela de login há botões para preencher credenciais automaticamente. Todas usam a senha `123456`:

| Perfil    | E-mail               |
|-----------|----------------------|
| Cliente   | `carlos@email.com`   |
| Prestador | `pedro@email.com`    |
| Admin     | `admin@email.com`    |

Também é possível criar uma conta em `/cadastro` (cliente ou prestador). Usuários cadastrados ficam salvos no `localStorage` e conseguem fazer login normalmente.

## Como executar

### Pré-requisitos

- Node.js 18+ e npm

### Instalação e execução

```bash
npm install
npm start
```

A aplicação estará disponível em `http://localhost:4200/` (redireciona para `/vitrine`).

### Outros comandos

```bash
npm run build      # Build de produção (saída em dist/servicoPerto)
npm run watch      # Build em modo watch (desenvolvimento)
npm test           # Testes unitários
```

## Estrutura do projeto

```
src/app/
├── core/                  # Camada compartilhada
│   ├── models/            # Interfaces e enums (Servico, ServiceOrder, Usuario...)
│   └── services/          # AuthService, DadosMockService, RoleSwitcherService
├── layouts/
│   └── header/            # Header fixo com seletor de perfil e navegação
├── features/              # Telas organizadas por domínio
│   ├── auth/              # Login e cadastro
│   ├── vitrine/           # Listagem e detalhe de serviços
│   ├── ordens/            # Lista e detalhe de ordens + chat
│   ├── favoritos/         # Serviços favoritos do cliente
│   ├── prestador/         # Meus serviços, formulário e galeria de fotos
│   ├── admin/             # Denúncias, categorias e usuários
│   └── chat/              # Chat por ordem de serviço
└── shared/                # Componentes e pipes reutilizáveis
```

## Arquitetura e observações

- **Dados mockados**: `DadosMockService` mantém o estado em `BehaviorSubject`s e simula latência de rede (~300ms). Toda a "persistência" é em memória — recarregar a página restaura os dados iniciais (exceto login/cadastro, que usam `localStorage`).
- **Autenticação**: `AuthService` guarda o usuário logado em `localStorage`. Não há guarda de rotas — a navegação é livre e o perfil é alternado manualmente pelo seletor no header.
- **Perfis**: `Perfil` (usado na UI) e `TipoUsuario` (usado nos modelos) representam os mesmos três papéis: `CLIENTE`, `PRESTADOR` e `ADMIN`.
- **Rotas**: todas as telas usam lazy loading via `loadComponent` em `app.routes.ts`.
- **UI**: Angular Material (tema indigo-pink) + SCSS global em `src/styles.scss` com variáveis de cores e utilitários.

## Rotas principais

| Rota                    | Descrição                          |
|-------------------------|------------------------------------|
| `/vitrine`              | Catálogo de serviços (página inicial)|
| `/servico/:id`          | Detalhe de um serviço              |
| `/login`, `/cadastro`   | Autenticação                       |
| `/ordens`, `/ordem/:id` | Ordens do usuário logado           |
| `/ordem/:id/chat`       | Chat da ordem                      |
| `/favoritos`            | Favoritos do cliente               |
| `/prestador/*`          | Área do prestador                  |
| `/admin/*`              | Painel administrativo              |
