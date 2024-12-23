# backend-test-blis

## Sistema de Gerenciamento de Habilidades e Documentos

Este projeto é uma API RESTful para gerenciar habilidades, documentos e informações climáticas, utilizando tecnologias como Node.js, Express, Prisma, e uma API pública para dados de clima.
Inclui autenticação, gerenciamento de arquivos, e integração com APIs externas.

## Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 16 ou superior)
-   [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
-   Editor de texto ou IDE (recomendado: [Visual Studio Code](https://code.visualstudio.com/))

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/usuario/projeto.git
    cd projeto
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Configure o arquivo `.env`:

    - Crie um arquivo `.env` na raiz do projeto.
    - Crie o cadastro do [openweathermap](https://openweathermap.org/)
    - Vá em [My API keys](https://home.openweathermap.org/api_keys)
    - Copie a api_key e adicione ao .env
    - Adicione as variáveis:

        ```env
        PORT="numero_da_porta_para_expor"
        DATABASE_URL="postgresql://usuario:senha@localhost:3306/nome_do_banco"

        SALT_ROUNDS="numero_de_rodadas_para_hash_de_senhas"
        JWT_SECRET_KEY="hash_para_gerar_token_jwt"
        JWT_EXPIRATION_TIME="tempo_de_validade_em_horas_do_token_jwt"
        WEATHER_API_KEY="sua_chave_da_api_openweathermap"

        TEST_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ5NmMyNWIxLWExOWEtNGFhNC1iZTFlLWU3ZmM2YjI0MjQ0MCIsIm5hbWUiOiJBbmRyw6kgQ291dG8iLCJpYXQiOjE3MzQ4MzQ5MDQsImV4cCI6MTczNzQyNjkwNH0.H4wwk0wzYSEshekHoEEqP8f1KdBZURLgysHwgOkLbZ4"
        TEST_FILE_PDF="INF16175.pdf"
        TEST_FILE_TXT="INF16175.txt"
        ```

    - Obs: token especial para testes, utilizando um token real com duração de 1 mês.

4. Suba os containers com Docker:

    ```bash
    docker-compose up -d
    ```

5. Rode as migrações do banco de dados:

    ```bash
    npx prisma migrate dev
    ```

6. Acesse o servidor:
    ```bash
    npm start
    ```

O servidor estará rodando em `http://localhost:3000`.

## Uso

### Endpoints Principais

#### Login

#### Criar Usuário

**POST /api/users**

-   **Body:**

    ```json
    {
    	"name": "João Silva",
    	"email": "joao@email.com",
    	"password": "senha123",
    	"birthdate": "1990-01-01"
    }
    ```

-   **Resposta:**
    ```json
    {
      "message": "Usuário criado com sucesso.",
      "user": { "id": "uuid-do-usuario", "name": "João Silva", ... }
    }
    ```

#### Upload de Documento

**POST /api/users/documents**

-   Envie um arquivo pelo campo `file` no formato `multipart/form-data`.

-   **Resposta:**
    ```json
    {
      "message": "Documento enviado com sucesso.",
      "document": { "id": "uuid-do-documento", "name": "RG", ... }
    }
    ```

#### Criar Habilidade

#### Atualizar Habilidade

#### Listar Habilidades

#### Adicionar Habilidade a Usuário

#### Listar Habilidades do Usuário

#### Deletar Habilidades do Usuário

#### Listar Documentos do Usuário

#### Obter Clima

**POST /api/weather**

-   **Body:**

    ```json
    {
    	"latitude": -23.5505,
    	"longitude": -46.6333
    }
    ```

-   **Resposta:**
    ```json
    {
    	"temperature": "25°C",
    	"condition": "ensolarado",
    	"recommendation": "Use roupas leves!"
    }
    ```

## Testes

Para rodar os testes unitários e de integração:

```bash
npm test
```

Os testes cobrem:

-   Criação de usuários e habilidades.
-   Upload e gerenciamento de documentos.
-   Requisições à API de clima.

## Tecnologias

-   Node.js
-   Express
-   Prisma ORM
-   PostgreSQL
-   Multer (upload de arquivos)
-   OpenWeatherMap API
-   Jest (testes)
-   Docker e Docker Compose

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
