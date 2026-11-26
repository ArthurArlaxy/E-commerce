# Tech E-commerce
 
E-commerce full stack com catálogo, categorias, carrinho, pedidos, avaliações e painel administrativo. O pagamento é feito por **PIX (AbacatePay)** e acompanhado por um **worker assíncrono com BullMQ + Redis**.
 
🔗 **Demo:** https://e-commerce-nine-liard-17.vercel.app
 
> ⚠️ **Projeto de portfólio.** Os pagamentos usam o ambiente de desenvolvimento da AbacatePay e nenhum valor real é cobrado.
>
> ⏳ **Primeiro acesso lento.** A API roda em plano gratuito e dorme após ~15 min sem uso. A primeira requisição depois disso pode levar cerca de 1 minuto. Se aparecer um erro, aguarde e recarregue a página.
 
<!-- Adicione aqui 2 ou 3 capturas de tela (home, produto, carrinho, pedido com PIX). Ex.: ![Home](docs/home.png) -->
 
## Sumário
 
- [Arquitetura](#arquitetura)
- [Fluxo de pedidos e pagamentos](#fluxo-de-pedidos-e-pagamentos)
- [Decisão técnica: o Worker em janelas de atividade](#decisão-técnica-o-worker-em-janelas-de-atividade)
- [Limitações conhecidas](#limitações-conhecidas)
- [Backend](#backend)
- [Frontend e Server Actions](#frontend-e-server-actions)
- [Autenticação e autorização](#autenticação-e-autorização)
- [Imagens](#imagens)
- [Tecnologias](#tecnologias)
- [Executar localmente](#executar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Deploy](#deploy)
## Arquitetura
 
- **Frontend: Next.js.** Interface web e comunicação com a API via Server Actions. Hospedado na Vercel.
- **Backend: Node.js, Express e TypeScript.** API REST em camadas. Hospedado no Render.
- **Banco de dados: PostgreSQL**, acessado com Prisma ORM. Hospedado na Neon.
- **Fila: Redis e BullMQ** (Upstash em produção).
- **Worker:** acompanha os pagamentos sem bloquear as requisições da API.
```text
Navegador
   │
   ▼
Next.js (páginas e Server Actions)
   │  chamadas à API com o cookie de sessão
   ▼
API Express (/api)
   ├── Middleware   autenticação, autorização e upload
   ├── Controller   entrada HTTP e resposta
   ├── Schema       validação com Zod
   ├── Service      regras de negócio
   └── Repository   acesso ao PostgreSQL via Prisma
 
Criação do pedido
   ├── API cria a cobrança PIX na AbacatePay
   ├── API agenda uma tarefa no Redis/BullMQ
   └── Worker consulta o pagamento e atualiza o pedido
```
 
## Fluxo de pedidos e pagamentos
 
Ao criar um pedido, o backend:
 
1. Confere endereço, carrinho, itens selecionados, estoque e opção de frete.
2. Registra o pedido e seus itens no PostgreSQL, com snapshots dos dados relevantes.
3. Solicita à AbacatePay a criação de uma cobrança PIX.
4. Salva os dados do pagamento no pedido e agenda uma tarefa `check-payment` na fila `payment`.
5. Retorna as informações do PIX ao frontend.
O worker consulta o status do PIX de forma assíncrona:
 
- **`PAID`:** marca o pedido como pago.
- **`EXPIRED` ou `CANCELLED`:** cancela o pedido e devolve os itens ao estoque.
- **Ainda pendente:** reagenda a verificação com delay.
Um job recorrente (`sweep-expired`) também revarre os pedidos pendentes vencidos, como rede de segurança caso alguma tarefa se perca. As operações `markAsPaid` e `cancelIfUnpaid` são **idempotentes**, então reprocessar um pedido não causa efeito duplicado.
 
## Decisão técnica: o Worker em janelas de atividade
 
### O problema
 
O Redis gratuito do Upstash cobra por comando. Mesmo sem nenhum pedido, o Worker do BullMQ gerava tráfego constante: o painel mostrava cerca de **200 comandos a cada 3 minutos**.
 
### Investigação
 
Com o **Monitor** do Upstash, vi o que o Worker faz a cada volta, mesmo sem nenhum pedido na fila:
 
- 1 comando de espera, que fica aguardando a chegada de um novo job;
- 1 comando que executa um script Lua, e esse script dispara outros 6 comandos internos para checar a fila.
Como o Upstash conta também os comandos que rodam dentro do script, cada volta custa **~8 comandos**.
 
Estranhei que a espera sempre durava 10 s, mesmo com `drainDelay: 120` configurado. Fui ao código da biblioteca e encontrei o motivo: o BullMQ limita essa espera por uma constante interna (`defaultMaximumBlockTimeout = 10`). **O `drainDelay` nunca passa de 10 s.**
 
Resultado: ~8 comandos a cada 10 s, ou **~2 milhões de comandos por mês** com o Worker parado.
 
### Solução
 
O Worker é criado com `autorun: false` e controlado por um laço que o liga por poucos segundos e o pausa em seguida:
 
```text
ativo 25 s ── pausado ~155 s ── ativo 25 s ── pausado ~155 s ── ...
```
 
- Fora da janela, o Worker **não envia nenhum comando** ao Redis.
- Na janela, ele promove os jobs atrasados que já venceram e os processa.
- O intervalo do `check-payment` é menor que o ciclo, para o job já estar vencido quando a próxima janela abrir.
- `skipStalledCheck: true`, porque `checkPayment` é idempotente e o sweep cobre qualquer job perdido.
- Em produção o Worker roda no mesmo processo da API (`RUN_WORKER_INSIDE_API=true`).
### Efeito do spin-down da hospedagem
 
No plano gratuito do Render a API dorme após ~15 min sem requisições HTTP. Quando o processo dorme, o Worker para junto e **não gera comandos**. Verifiquei isso nos eventos do Render e no Monitor do Upstash: o consumo existe apenas enquanto a API está acordada.
 
| Cenário | Comandos/mês (estimado) |
|---|---|
| Worker contínuo, configuração padrão | ~2 milhões |
| Worker em janelas, ciclo de 3 min | proporcional ao tempo em que a API fica acordada |
 
<!-- Quando tiver alguns dias de uso, troque a última linha pelo número real do painel do Upstash. -->
 
## Limitações conhecidas
 
- **Partida a frio.** Depois de um período parado, a API leva cerca de 1 minuto para acordar. Páginas que dependem de dados da API (como carrinho e pedidos) podem falhar no primeiro acesso e funcionar ao recarregar.
- **Confirmação atrasada com a API dormindo.** Se o cliente pagar o PIX e ninguém acessar a API, o pedido continua `pending` até ela acordar. Na primeira janela depois disso, os jobs vencidos são processados.
- **Latência de até um ciclo.** Com ciclo de 3 min, o pedido pode levar alguns minutos para virar `PAID` depois do pagamento.
- **Uma consulta à AbacatePay por pedido pendente a cada ciclo.** Aceitável para o volume de um portfólio, mas não escalaria sem outra estratégia (como o uso do webhook, mas a ideia era exercitar uso de worker e filas).
## Backend
 
O backend é organizado por responsabilidade:
 
- **Controller:** recebe requisições HTTP, valida entradas e delega aos serviços.
- **Service:** concentra as regras de negócio, como criação de pedidos, controle de estoque e integração de pagamentos.
- **Repository:** encapsula a persistência. Os repositórios Prisma consultam e atualizam o banco.
- **Middleware:** trata autenticação, autorização administrativa e recebimento de imagens.
- **Schema:** valida parâmetros, query strings e payloads com Zod.
As rotas são registradas em `backend/src/router.ts` e montadas sob o prefixo `/api`. O modelo de dados (usuários, produtos, imagens, carrinhos e pedidos, entre outros) está no schema do Prisma.
 
## Frontend e Server Actions
 
O frontend usa Next.js e React. As Server Actions, em `frontend/src/actions/`, são a camada de comunicação entre a interface e a API: enviam dados, encaminham o cookie de sessão nas chamadas autenticadas e devolvem resultados às páginas e formulários.
 
Assim, o navegador não chama a API diretamente nessas operações, e o cookie nunca depende do domínio da API. A variável `API_URL` define o endereço usado pelas actions.
 
## Autenticação e autorização
 
O backend gera tokens JWT com validade de um dia. No login e no cadastro, a Server Action recebe o token e o grava em um cookie `httpOnly`, reenviado nas chamadas autenticadas à API. Em produção o cookie usa `secure`, além de `sameSite: "lax"` e `path: "/"`.
 
O middleware do backend lê o cookie, valida o token e disponibiliza o usuário às rotas protegidas. As rotas administrativas também verificam o papel do usuário. O proxy do Next.js protege páginas como carrinho, pedidos e área administrativa, mas isso complementa, e não substitui, a autorização feita pelo backend.
 
## Imagens
 
O upload é feito pelo backend com Multer em memória. Os arquivos são validados como imagem e limitados a 5 MB cada; as rotas de produto aceitam até oito imagens.
 
O processamento com Sharp corrige a orientação, limita as dimensões a 1200 × 1200 px sem ampliar imagens menores e converte para WebP com qualidade 80. As imagens ficam como dados binários no PostgreSQL, relacionadas ao produto ou à categoria, e são servidas em `/images/:id` com cache de longa duração.
 
## Tecnologias
 
| Camada | Tecnologia |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Backend | Node.js, Express, TypeScript, Zod |
| Persistência | PostgreSQL, Prisma |
| Fila e processamento | Redis, BullMQ |
| Imagens | Multer, Sharp |
| Autenticação | JWT, cookies `httpOnly` |
| Pagamento | AbacatePay (PIX) |
| Desenvolvimento local | Docker Compose |
| Hospedagem | Vercel (frontend), Render (API e Worker), Upstash (Redis), PostgreSQL (Neon) |
 
## Executar localmente
 
Pré-requisitos: Docker e Docker Compose.
 
O `docker-compose.yml` sobe PostgreSQL, Redis, pgAdmin, backend, frontend e worker. Localmente o Worker roda como processo separado e contínuo, sem limite de comandos.
 
1. **Variáveis do Compose** (na raiz): `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `PGADMIN_EMAIL` e `PGADMIN_PASSWORD`.
2. **`backend/.env`**, usando os nomes dos serviços como hosts (`postgres`, `redis`):
   `DATABASE_URL`, `SECRET_KEY`, `ABACATEPAY_API_KEY`, `REDIS_HOST`, `REDIS_PORT` e `PORT` (deve corresponder à porta interna publicada pelo serviço backend).
3. **`frontend/.env`**:
   `API_URL` (com o prefixo `/api`, apontando para o serviço backend) e `SECRET_KEY` (o mesmo segredo do backend, usado para validar os JWTs).
4. Suba os serviços:
```bash
docker compose up --build
```
 
5. Aplique as migrations:
```bash
docker compose exec backend npx prisma migrate deploy
```
 
O frontend fica na porta `3000`. As portas do backend e do pgAdmin estão no `docker-compose.yml`.
 
## Variáveis de ambiente
 
### Backend
 
| Variável | Descrição |
|---|---|
| `PORT` | Porta da API |
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `SECRET_KEY` | Segredo usado para assinar e validar os JWTs |
| `ABACATEPAY_API_KEY` | Chave da API da AbacatePay (use a de desenvolvimento) |
| `REDIS_HOST` | Host do Redis |
| `REDIS_PORT` | Porta do Redis (padrão `6379`) |
| `REDIS_USERNAME` | Usuário do Redis, se houver |
| `REDIS_PASSWORD` | Senha do Redis |
| `REDIS_TLS` | `true` para conexões TLS (Upstash) |
| `RUN_WORKER_INSIDE_API` | `true` para rodar o Worker no mesmo processo da API |
 
### Frontend
 
| Variável | Descrição |
|---|---|
| `API_URL` | URL pública da API, incluindo `/api` |
| `SECRET_KEY` | Mesmo segredo do backend |
 
> 🔒 Nunca versione arquivos `.env`. Mantenha apenas um `.env.example` com os nomes das variáveis, sem valores reais.
 
## Scripts
 
No diretório `backend`:
 
```bash
npm run dev       # API em desenvolvimento
npm run build     # compila o TypeScript
npm run start     # API compilada
npm run worker    # worker de pagamentos
npm run db:seed   # dados iniciais
```
 
No diretório `frontend`:
 
```bash
npm run dev       # Next.js em desenvolvimento
npm run build     # build de produção
npm run start     # aplicação compilada
npm run lint      # ESLint
```
 
## Deploy
 
- **Frontend:** Vercel, com `API_URL` apontando para a URL pública da API (incluindo `/api`).
- **API e Worker:** Render, com `RUN_WORKER_INSIDE_API=true`. O Render usa `/api/healthz` como health check.
- **Redis:** Upstash, com `REDIS_TLS=true`.
- **PostgreSQL:** banco gerenciado, acessado via `DATABASE_URL`.
O backend e o worker precisam de acesso ao PostgreSQL, ao Redis e à chave da AbacatePay.
 
## Autor
 
**Arthur Albuquerque Amancio de Oliveira** · [LinkedIn](https://www.linkedin.com/in/arthur-albuquerque-amancio/) · [GitHub](https://github.com/ArthurArlaxy/)
 
