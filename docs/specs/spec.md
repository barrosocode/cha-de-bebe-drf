Criar projeto nextjs de acordo com as regras a seguir:

1. Crie as páginas com base nos arquivos .html da pasta `@docs/reference/`
2. Implemente a conexão com a api com base em `@docs/API_DOCUMENTATION.yaml`
3. Crie uma página pública baseada em `@docs/reference/public.html`
4. Crie uma página de login com base em `@docs/reference/login.html`
 <!-- a partir de agora, todas as páginas são protegidas, só podem ser acessadas por usuários logados com validação de token. não salvar no local storage o token -->
5. Crie as páginas descritas para cada um dos módulos a seguir:

- Convidados: Listar, Criar, Editar
- Convites: Listar, Criar, Editar
- Presentes: Listar, Criar, Editar, Presentes reservados (listagem)

obs: As páginas de listagem devem ser criadas com base em `@docs/reference/list.html`, as de criar/editar, devem reaproveitar o mesmo componente com o formulário, para elas, use `@docs/reference/form.html`

6. Crie uma página inicial para o dashboard com base em `@docs/reference/dashboard.html` (para essa, levante todos os dados que são necessários, vou criar um endpoint só com esses dados para usarmos no dashboard).

<!-- ========================= -->

# Especificação do Projeto Frontend (Next.js) - Chá de Catarina

## 1. Stack e Arquitetura

- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS (ou a stack definida nos HTMLs de referência)
- **HTTP Client:** Axios
- **Gerenciamento de Estado/Cache:** TanStack Query (React Query)
- **Formulários:** React Hook Form + Zod (para validação de schema)
- **Ícones:** Lucide React (ou similar, conforme os HTMLs)

## 2. Autenticação e Segurança

- **Armazenamento do Token:** HttpOnly Cookie. **Nunca** salvar no `localStorage` ou `sessionStorage`.
- **Fluxo de Login:**
    1. O frontend envia credenciais para uma API Route do Next.js (`/api/auth/login`).
    2. A API Route faz o proxy para a API Django (`/api/auth/login/`).
    3. Ao receber o token da API Django, a API Route do Next.js define um cookie `HttpOnly`, `Secure` e `SameSite=Strict`.
    4. O frontend recebe apenas os dados do usuário (sem o token) e atualiza o estado do TanStack Query.
- **Middleware:** Criar um `middleware.ts` na raiz do projeto para proteger as rotas do grupo `(protected)`. Se o cookie não existir, redirecionar para `/login`.
- **Interceptor de Erros:** Configurar o Axios para interceptar respostas `401 Unauthorized` e redirecionar o usuário para `/login` automaticamente.

## 3. Estrutura de Rotas (App Router)

```text
app/
├── (public)/                  # Grupo de rotas públicas (sem layout de dashboard)
│   ├── page.tsx               # Landing Page
│   └── login/
│       └── page.tsx           # Página de Login
├── (protected)/               # Grupo de rotas protegidas (com layout de dashboard/sidebar)
│   ├── layout.tsx             # Layout com Sidebar e Header
│   ├── dashboard/
│   │   └── page.tsx           # Dashboard
│   ├── convidados/
│   │   ├── page.tsx           # Listagem
│   │   └── [id]/
│   │       └── page.tsx       # Criar/Editar (reutiliza o form)
│   ├── convites/
│   │   ├── page.tsx           # Listagem
│   │   └── [id]/
│   │       └── page.tsx       # Criar/Editar
│   ├── presentes/
│   │   ├── page.tsx           # Listagem
│   │   └── [id]/
│   │       └── page.tsx       # Criar/Editar
│   └── reservados/
│       └── page.tsx           # Listagem de presentes reservados
└── api/
    └── auth/
        ├── login/route.ts     # Proxy para autenticar e setar cookie
        └── logout/route.ts    # Proxy para limpar cookie
```

## 4. Páginas Públicas

- **Landing Page (`/`):** Baseada em `@docs/reference/public.html`. Página institucional do chá (data, local, fotos, etc).
- **Login (`/login`):** Baseada em `@docs/reference/login.html`. Formulário de autenticação para os pais.

## 5. Páginas Protegidas (Pais)

Todas as páginas abaixo devem usar o layout de dashboard e exigir autenticação.

- **Dashboard (`/dashboard`):** Baseada em `@docs/reference/dashboard.html`.
- **Convidados (`/convidados`):**
    - Listagem baseada em `@docs/reference/list.html`.
    - Criar/Editar reaproveitando o componente de formulário (`@docs/reference/form.html`).
- **Convites (`/convites`):** Mesma estrutura de Listagem + Formulário.
- **Presentes (`/presentes`):** Mesma estrutura de Listagem + Formulário (com suporte a upload de imagens).
- **Presentes Reservados (`/reservados`):** Listagem baseada em `@docs/reference/list.html`, mostrando apenas os presentes que já foram escolhidos por convidados, com detalhes de quem escolheu e a mensagem deixada.

## 6. Gerenciamento de Dados e API

- **Client Axios:** Criar uma instância global do Axios configurada com o `baseURL` da API Django.
- **TanStack Query:** Usar `useQuery` para buscar dados e `useMutation` para criar/atualizar/deletar.
- **Paginação e Filtros:**
    - **MVP:** A API retornará todos os dados. A paginação, busca e filtros serão feitos **100% no front-end** (client-side) usando memória/estado do React, pois o volume de dados do chá de bebê é baixo.
- **Tratamento de Erros:**
    - `400 Bad Request`: Mapear os erros do Django/DRF e exibir abaixo dos campos do formulário (React Hook Form).
    - `500 Internal Server Error`: Exibir um Toast/Alert genérico de erro.

## 7. Formulários e Validação

- **React Hook Form + Zod:** Todos os formulários (Criar/Editar) devem usar essa combinação.
- **Validações Específicas:**
    - **Telefone:** Regex para validar o formato `(99) 9 9999-9999`.
    - **Tags (Presentes):** Campo de texto que aceita múltiplas tags separadas por vírgula ou um componente de "chips" dinâmico.
    - **Limite de Presentes:** Deve ser um número inteiro maior que zero.

## 8. Upload de Imagens (Presentes)

- **Formato:** `multipart/form-data`.
- **Fluxo:**
    1. O usuário seleciona a imagem no formulário.
    2. O frontend exibe um preview local da imagem (usando `URL.createObjectURL`).
    3. Ao submeter, a imagem é enviada no `FormData` junto com os outros campos do presente para a API Django (`/api/files/` ou via endpoint aninhado, conforme a API).

## 9. Endpoint do Dashboard (Backend - Django)

Para alimentar a página `/dashboard`, será necessário criar um endpoint dedicado na API Django: `GET /api/dashboard/`.

**Payload de resposta esperado (JSON):**

```json
{
    "total_invites": 12,
    "total_guests": 45,
    "confirmed_guests": 38,
    "confirmation_rate": 84.4,
    "total_gifts": 25,
    "reserved_gifts": 18,
    "reservation_rate": 72.0,
    "recent_reservations": [
        {
            "guest_name": "Gabriel",
            "gift_name": "Carrinho de bebê",
            "message": "Parabéns!",
            "reserved_at": "2026-11-01T10:30:00Z"
        }
    ]
}
```

_(Nota: A implementação deste endpoint no Django será feita posteriormente, mas o frontend deve ser construído esperando exatamente essa estrutura)._

## 10. Componentes Reutilizáveis

Criar uma pasta `components/ui` e `components/features` para manter o código DRY:

- `DataTable.tsx`: Componente genérico para as listagens (baseado em `list.html`), aceitando colunas dinâmicas, busca e paginação client-side.
- `DynamicForm.tsx`: Componente genérico para os formulários (baseado em `form.html`), aceitando schema Zod e campos dinâmicos.
- `Toast.tsx`: Para feedbacks de sucesso/erro.
- `ImageUpload.tsx`: Para o preview e upload de imagens dos presentes.
