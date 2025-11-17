# 🗂️ Sistema de Arquivo Morto / Gestão de Processos

Um sistema moderno de **organização de arquivos físicos**, desenvolvido com **Next.js App Router**, **Prisma ORM** e **MySQL**, permitindo organizar **arquivos dentro de caixas**, **caixas dentro de gavetas**, **gavetas dentro de estantes**, e **estantes em locais físicos** (como secretarias ou departamentos).

---

## 🚀 Tecnologias Utilizadas

| Área | Tecnologia | Descrição |
|------|-------------|------------|
| **Frontend / Backend** | [Next.js (App Router)](https://nextjs.org/) | Framework React moderno com Server Actions e SSR |
| **Banco de Dados** | [MySQL](https://www.mysql.com/) | Sistema de banco de dados relacional |
| **ORM** | [Prisma](https://www.prisma.io/) | ORM moderno com tipagem automática |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) | Tipagem estática para JavaScript |
| **Estilo** | [Tailwind CSS](https://tailwindcss.com/) | Framework CSS utilitário |
| **Componentes UI** | [shadcn/ui](https://ui.shadcn.com/) | Biblioteca de componentes acessíveis e modernos |
| **Autenticação** | [NextAuth.js](https://next-auth.js.org/) | Login seguro com JWT e provedores OAuth |
| **Upload de Arquivos** | [Cloudinary](https://cloudinary.com/) | Upload e armazenamento de arquivos digitais |
| **Deploy** | [Vercel](https://vercel.com/) | Hospedagem otimizada para Next.js |

---

## 🧱 Estrutura Hierárquica

A organização segue o modelo físico de um arquivo real:

Local → Estante → Gaveta → Caixa → Arquivo

Exemplo:

Secretaria de Administração
└── Estante A
└── Gaveta 3
└── Caixa CX-015
└── Processo nº 2025/001

---

## 🧩 Estrutura do Banco (Prisma)

O banco foi definido com campos em **português** no arquivo `schema.prisma`.

### Entidades principais

- **Usuário** — acessa o sistema e cria arquivos
- **Local** — prédio, setor ou secretaria
- **Estante** — móvel físico
- **Gaveta** — subdivisão da estante
- **Caixa** — contém arquivos físicos
- **Arquivo** — documento ou processo específico

---

## ⚙️ Instalação e Configuração

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/seu-usuario/arquivo-morto.git
cd arquivo-morto
````

### 2️⃣ Instalar dependências

```bash
npm install
# ou
yarn install
```

### 3️⃣ Configurar o banco de dados

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/arquivo_morto"
NEXTAUTH_SECRET="sua_chave_segura_aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 4️⃣ Executar migrações Prisma

```bash
npx prisma migrate dev --name init
```

### 5️⃣ Rodar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🧠 Recursos do Sistema

✅ Cadastro e autenticação de usuários
✅ Organização hierárquica de locais, estantes, gavetas e caixas
✅ Registro de arquivos com metadados e upload digital
✅ Pesquisa e filtros avançados
✅ Interface moderna com tema azul
✅ Responsividade total (mobile-first)
✅ Painel administrativo (opcional)

---

## 🎨 Tema Azul

O tema principal do sistema é **azul**, configurado via Tailwind:

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primario: {
        DEFAULT: '#007bff',
        escuro: '#0056b3',
        claro: '#66b2ff',
      },
    },
  },
}
```

---

## 📁 Estrutura de Pastas

app/
 ├─ (auth)/           → rotas de login e registro
 ├─ (dashboard)/      → área interna protegida
 ├─ locais/           → CRUD de locais
 ├─ estantes/         → CRUD de estantes
 ├─ gavetas/          → CRUD de gavetas
 ├─ caixas/           → CRUD de caixas
 ├─ arquivos/         → CRUD de arquivos
 ├─ api/              → rotas de server actions
 └─ layout.tsx        → layout global
lib/
 ├─ prisma.ts         → conexão Prisma
 ├─ auth.ts           → configuração NextAuth
 └─ utils.ts          → utilitários gerais
prisma/
 └─ schema.prisma     → definição do banco de dados
components/
 ├─ ui/               → componentes reutilizáveis (shadcn)
 ├─ forms/            → formulários com react-hook-form
 └─ layout/           → header, sidebar, etc

---

## 🧑‍💻 Desenvolvimento

Com o servidor rodando em modo dev:

```bash
npm run dev
```

Para gerar o cliente Prisma tipado:

```bash
npx prisma generate
```

Para visualizar o banco:

```bash
npx prisma studio
```

---

## 🧱 Possíveis Extensões Futuras

- Controle de permissões (RBAC)
- Digitalização de documentos
- Integração com APIs de OCR
- Exportação em PDF e CSV
- Dashboard com estatísticas

---

## 📜 Licença

Este projeto é **open source** sob a licença [MIT](LICENSE).

---

### 💙 Feito com Next.js, Prisma e muito cuidado

---
