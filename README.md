# Neide Confeitaria

Sistema de cardápio digital e gestão de pedidos para confeitaria artesanal.

## Tecnologias

### Backend (Spring Boot 4.0.5 / Java 17)

| Biblioteca | Versão | Finalidade |
|---|---|---|
| Spring Boot Starter Web | 4.0.5 | API REST |
| Spring Boot Starter Data JPA | 4.0.5 | Persistência Hibernate 7 |
| Spring Boot Starter Security | 4.0.5 | Autenticação básica |
| PostgreSQL | 42.x | Banco principal |
| SQLite JDBC | 3.45 | Fallback automático |
| Hibernate Community Dialects | 7.2.7 | Dialect customizado para SQLite |
| Jackson 3 (tools.jackson) | 3.1.0 | Serialização JSON + converter de `List<String>` |
| Lombok | (opcional) | Redução de boilerplate |

### Frontend (Next.js 16 / React 19 / Turbopack)

| Biblioteca | Versão | Finalidade |
|---|---|---|
| Next.js | 16.2.4 | Framework full-stack |
| React | 19.2.4 | UI |
| TypeScript | 5.x | Tipagem |
| Tailwind CSS | 4 | Estilização |
| Radix UI | 1.4.3 | Componentes acessíveis |
| shadcn/ui | 4.10.0 | Componentes base |
| Lucide React | 1.17.0 | Ícones |
| Framer Motion | 12.40.0 | Animações |
| React Hook Form | 7.77.0 | Formulários |
| Zod | 4.4.3 | Validação |
| class-variance-authority | 0.7.1 | Variantes de estilo |
| clsx + tailwind-merge | — | Utilitários CSS |

## Pré-requisitos

- **JDK 17+** (recomendado: [Temurin](https://adoptium.net/temurin/releases/?version=17))
- **Node.js 20+**
- **Docker** (opcional — apenas para PostgreSQL)

## Estrutura do Projeto

```
neide-confeitaria/
├── backend/baas/               # API Spring Boot
│   └── src/main/java/com/
│       ├── config/             # Configurações (CORS, DataSource, SQLiteDialect)
│       ├── controller/         # Endpoints REST
│       │   ├── AuthController.java
│       │   ├── CategoryController.java
│       │   ├── ImageController.java
│       │   ├── OrderController.java
│       │   └── ProductController.java
│       ├── dto/                # Objetos de transferência
│       ├── model/              # Entidades JPA
│       │   ├── User.java
│       │   ├── Category.java
│       │   ├── Product.java
│       │   ├── Order.java
│       │   └── OrderItem.java
│       ├── repository/         # Repositórios Spring Data
│       ├── service/            # Lógica de negócio
│       └── BaasApplication.java
├── frontend/                   # Aplicação Next.js
│   ├── app/                    # Páginas (App Router)
│   │   ├── cardapio/           # Cardápio público
│   │   ├── carrinho/           # Carrinho de compras
│   │   ├── login/              # Login de admin
│   │   ├── register/           # Cadastro
│   │   ├── pedido-confirmado/  # Confirmação de pedido
│   │   └── admin/              # Dashboard admin
│   │       ├── menu/           # Gerenciar produtos
│   │       └── pedidos/        # Gerenciar pedidos
│   ├── components/
│   │   ├── ui/                 # Componentes base (shadcn/ui)
│   │   ├── menu/               # Componentes do cardápio
│   │   └── admin/              # Componentes administrativos
│   └── lib/
│       ├── types.ts            # Interfaces TypeScript
│       ├── api.ts              # Cliente HTTP tipado
│       ├── cart-context.tsx    # Contexto do carrinho
│       └── utils.ts            # Utilitários
├── docker-compose.yml          # PostgreSQL 16
├── package.json                # Scripts raiz (concurrently)
└── start-dev.bat               # Inicialização rápida (Windows)
```

## Banco de Dados

### Modelo

```
users (id, name, email, password, phone, role)
    ↑
categories (id, name)
    ↑
products (id, name, description, price, image_url, available, category_id → FK)
    ↑
order_items (id, unit_price, quantity, observation, order_id → FK, product_id → FK)
    ↑
orders (id, customer_name, phone, delivery, address, latitude, longitude,
        observation, status, delivery_date_time, created_at)
```

- Products armazena `ingredients` como JSON em coluna TEXT via `AttributeConverter`.
- Orders usa `@PrePersist` para definir `createdAt` automaticamente.
- Status padrão do pedido: `"FILA"` (fila de produção).

### Fallback Automático

O sistema tenta conectar no PostgreSQL (localhost:5432). Se falhar em 3 segundos, usa SQLite em `data/neide_confeitaria.db`. O dialect Hibernate é configurado dinamicamente via `DataSourceConfig.java`.

## Instalação e Execução

### 1. Clonar e instalar dependências

```bash
npm run setup
```

### 2. PostgreSQL (opcional)

```bash
docker compose up -d
```

Se o Docker não estiver disponível, o banco SQLite será usado automaticamente.

### 3. Iniciar

**Opção A — Tudo de uma vez (Windows):**

```bash
start-dev.bat
```

**Opção B — Terminais separados:**

```bash
# Terminal 1 — Backend
cd backend/baas
mvnw.cmd spring-boot:run

# Terminal 2 — Frontend
cd frontend
npm run dev
```

**Opção C — npm (requer PostgreSQL em execução):**

```bash
npm run dev
```

### 4. Acessar

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:8080 |

## API — Endpoints Principais

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/categories` | Listar categorias |
| GET | `/api/products` | Listar produtos |
| POST | `/api/products` | Criar produto |
| PUT | `/api/products/{id}` | Atualizar produto |
| DELETE | `/api/products/{id}` | Remover produto |
| POST | `/api/orders` | Criar pedido |
| GET | `/api/orders` | Listar pedidos |
| PUT | `/api/orders/{id}/status` | Atualizar status |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Cadastro |
| POST | `/api/images/upload` | Upload de imagem |

## Seed

Ao iniciar com banco vazio, o `DataSeeder` popula automaticamente:

- **8 categorias**: Caseiro, Diet, Vulcão, Bolo, Salgado, Pudim, Cesta, Congelado
- **80 produtos**: 10 por categoria, com nomes, descrições, preços e ingredientes

A verificação é feita por `productRepository.count() > 0` — se já houver dados, o seed é ignorado.

## Configuração

### application.yaml

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update    # Cria/atualiza tabelas automaticamente
    show-sql: true        # Exibe SQL no console
```

O dialect é definido dinamicamente:
- PostgreSQL → `org.hibernate.dialect.PostgreSQLDialect`
- SQLite → `com.config.SQLiteDialect`

### SQLiteDialect (customizado)

Dialect Hibernate 7 para SQLite com:
- Suporte a `IDENTITY` para `@GeneratedValue`
- Type mapping: `BIGINT/BOOLEAN → INTEGER`, `CLOB → TEXT`, `DECIMAL/FLOAT → REAL`
- Exporters no-op para ForeignKey e UniqueKey (SQLite não suporta `ALTER TABLE ADD CONSTRAINT`)
- `@ElementCollection` convertido para `AttributeConverter` (Jackson 3 serializa `List<String>` como JSON)
- `StandardSqlAstTranslatorFactory` para suporte a mutations

## Notas de Desenvolvimento

- **Stateless auth**: Login retorna `{id, name, email, phone, role}` — sem JWT ou sessão.
- **CORS**: Liberado para `http://localhost:3000` em desenvolvimento.
- **Uploads**: Salvos em `uploads/` (configurável via `upload.dir`).
- **Categoria id=0**: O front-end envia `{id:0}` para "sem categoria"; o backend converte para `null`.
- **JSON serialization**: `@JsonIgnoreProperties("order")` e `@JsonIgnoreProperties("items")` evitam loop infinito em `Order ↔ OrderItem`.
