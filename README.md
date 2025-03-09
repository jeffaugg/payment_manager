# Payment Manager API

<p align="center">
  <img src="https://media1.tenor.com/m/JZ1XdjdbHs8AAAAC/futurama-fry.gif" alt="DiaFin-API">
</p>

Este projeto é uma API RESTful para gerenciamento de pagamentos multi-gateway, desenvolvido como parte do Teste Prático Back-end BeTalent. A API foi implementada utilizando **AdonisJS 6**, **MySQL** e **VineJS** para validação, seguindo uma arquitetura modular e escalável.

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Migrations e Seeds](#migrations-e-seeds)
- [Executando a Aplicação](#executando-a-aplicação)
- [Documentação da API (Swagger)](#documentação-da-api-swagger)
- [Endpoints](#endpoints)
    - [Autenticação](#autenticação)
    - [Usuários](#usuários)
    - [Produtos](#produtos)
    - [Compras](#compras)
    - [Reembolso](#reembolso)
- [Testes](#testes)
- [Considerações Finais](#considerações-finais)

## Visão Geral

A Payment Manager API permite:
- Realizar login e emitir tokens de acesso.
- Gerenciar usuários (CRUD) com validação por roles.
- Gerenciar produtos (CRUD).
- Processar compras que podem envolver um ou múltiplos produtos (nível 2 e nível 3).
- Realizar reembolsos de transações, com validação de roles (apenas FINANCE ou ADMIN podem reembolsar).
- Integrar com múltiplos gateways de pagamento utilizando o **Strategy Pattern** para facilitar a adição de novos gateways sem alterar a lógica principal.

## Funcionalidades

- **Autenticação:** Login via email e senha, com emissão de tokens de acesso.
- **Gerenciamento de Usuários:** CRUD de usuários com restrição de acesso (apenas ADMIN).
- **Gerenciamento de Produtos:** CRUD de produtos com validação dos dados.
- **Processamento de Compras:** Fluxo completo para compras que envolvem múltiplos produtos, cálculo do total, integração com gateways de pagamento e registro de transações.
- **Reembolso:** Realização de reembolso de uma transação, com verificação de role.
- **Documentação Interativa:** Integração com Swagger para visualização e testes dos endpoints.
- **TDD e Docker:** Possibilidade de executar testes automatizados e utilização de Docker Compose para ambiente.

## Tecnologias Utilizadas

- **AdonisJS 6** - Framework Node.js para desenvolvimento de APIs robustas.
- **MySQL** - Banco de dados relacional.
- **VineJS** - Biblioteca de validação de dados.
- **Swagger** - Documentação interativa da API.
- **Docker Compose** - Para configuração do ambiente (MySQL, mocks dos gateways, etc.).
- **TDD** - Testes automatizados usando Japa.

## Estrutura do Projeto

```
├── app
│   ├── Controllers
│   ├── Exceptions
│   ├── Models
│   ├── Services
│   └── Validators
├── config
├── database
│   ├── migrations
│   └── seeders
├── docs
├── start
├── README.md
└── package.json
```

## Instalação e Configuração

1. **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITÓRIO>
    cd payment_manager
    ```

4. **Configure as variáveis de ambiente:**
    - Crie um arquivo `.env` baseado no exemplo fornecido (verifique o arquivo `.env.example`).
    - Garanta que o `HOST` dentro do .env seja 0.0.0.0
    - Configure as variáveis do banco de dados (`DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`) e outras necessárias conforme o docker compose.
    - Configure a variável `DB_HOST`:
        - Se estiver rodando pelo Docker, defina `DB_HOST` como `db`.
        - Se estiver rodando localmente, defina `DB_HOST` como `localhost`.

3. **Inicie a aplicação com Docker Compose:**
    ```bash
    docker-compose up -d
    ```

## Migrations e Seeds
    As migrations e seeds já estão configuradas para serem executadas dentro do ambiente Docker.

1. **Executando as Migrations e Seeds localmente:**
     ```bash
     node ace migration:run
     node ace db:seed   # Para inserir gateways iniciais e usuário adm base.
     ```

## Executando a Aplicação

1. **Para iniciar a API em modo desenvolvimento:**
     ```bash
     node ace serve --watch
     ```
     A API estará disponível geralmente em `http://localhost:3333`.

## Documentação da API (Swagger)

A documentação interativa foi configurada usando o pacote `adonisjs-6-swagger`.

- **UI interativa:** `http://localhost:3333/docs`
- **Especificação JSON:** `http://localhost:3333/swagger.json`

As anotações Swagger foram adicionadas diretamente nos controllers. Consulte os blocos de comentários JSDoc para detalhes de cada endpoint.

## Endpoints

### Autenticação

- **POST /login**
    - **Descrição:** Realiza o login do usuário.
    - **Corpo da Requisição:**
        ```json
        {
            "email": "adm@email.com", //email do usuário base
            "password": "adm123" //senha do usuário base
        }
        ```
    - **Resposta de Sucesso (200):**
        ```json
        {
            "type": "auth_token",
            "value": "oat_ABCDEF123456...",
            "expiresAt": "2025-04-03T23:11:06.980Z"
        }
        ```
    - **Resposta de Erro (401):**
        ```json
        { "message": "Credenciais inválidas" }
        ```

### Usuários

- **POST /user**
    - **Descrição:** Cria um novo usuário. (Apenas ADMIN pode criar)
    - **Corpo da Requisição:**
        ```json
        {
            "fullName": "João da Silva",
            "email": "joao.silva@example.com",
            "password": "senhaSegura123",
            "role": "ADMIN"
        }
        ```

- **GET /user**
    - **Descrição:** Lista todos os usuários.

- **GET /user/{id}**
    - **Descrição:** Exibe os detalhes de um usuário específico.

- **PUT /user/{id}**
    - **Descrição:** Atualiza os dados de um usuário. (Apenas ADMIN)

- **DELETE /user/{id}**
    - **Descrição:** Remove um usuário. (Apenas ADMIN)

### Produtos

- **POST /product**
    - **Descrição:** Cria um novo produto.
    - **Corpo da Requisição:**
        ```json
        {
            "name": "Produto Exemplo",
            "amount": 1500
        }
        ```

- **GET /product**
    - **Descrição:** Lista todos os produtos.

- **GET /product/{id}**
    - **Descrição:** Exibe os detalhes de um produto específico.

- **PUT /product/{id}**
    - **Descrição:** Atualiza os dados de um produto.

- **DELETE /product/{id}**
    - **Descrição:** Remove um produto.

### Compras (Transações)

- **POST /purchase**
    - **Descrição:** Processa uma compra de múltiplos produtos (Nível 3).
    - **Corpo da Requisição:**
        ```json
        {
            "client": {
                "name": "Cliente Exemplo",
                "email": "cliente@example.com"
            },
            "items": [
                { "productId": 1, "quantity": 2 },
                { "productId": 2, "quantity": 1 }
            ],
            "payment": {
                "name": "Comprador Exemplo",
                "email": "comprador@example.com",
                "cardNumber": "5569000000006063",
                "cvv": "010"
            }
        }
        ```

- **GET /purchases**
    - **Descrição:** Lista todas as compras (transações) registradas.

- **GET /purchases/{id}**
    - **Descrição:** Exibe os detalhes de uma compra específica.

### Reembolso

- **POST /purchases/{id}/refund**
    - **Descrição:** Realiza o reembolso de uma compra.
    - **Acesso:** Apenas usuários com role FINANCE ou ADMIN podem realizar reembolsos.
    - **Parâmetros:** id da transação.
    - **Resposta de Sucesso (200):**
        ```json
        { "message": "Reembolso realizado com sucesso!" }
        ```
    - **Resposta de Erro (400/401):**
        ```json
        { "message": "Falha ao processar o reembolso", "error": "..." }
        ```

## Testes

- **TDD:**
    O projeto conta com testes automatizados (utilizando Japa). Para executar os testes:
    > **Aviso:** Para executar os testes, a aplicação deve estar configurada para rodar localmente.
    ```bash
    node ace test
    ```

## Considerações Finais

- **Estrutura Modular:**
    A API foi construída de forma modular, com controllers, services, models e validators separados, seguindo boas práticas para manutenção e escalabilidade.

- **Integração com Gateways:**
    O fluxo de pagamento utiliza o Strategy Pattern para integrar múltiplos gateways, permitindo que novos gateways sejam adicionados sem alterar a lógica principal.

- **Documentação com Swagger:**
    A documentação dos endpoints é gerada automaticamente a partir dos comentários JSDoc e está disponível através da UI interativa do Swagger.

- **Segurança:**
    Endpoints sensíveis são protegidos por autenticação e validação de roles.

