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

        DATABASE_USER="user_root_db"
        DATABASE_PASSWORD="senha_db"
        DATABASE_URL="mysql://usuario:senha@db:3306/nome_do_banco"

        SALT_ROUNDS="numero_de_rodadas_para_hash_de_senhas"
        JWT_SECRET_KEY="hash_para_gerar_token_jwt"
        JWT_EXPIRATION_TIME="tempo_de_validade_em_horas_do_token_jwt"
        WEATHER_API_KEY="sua_chave_da_api_openweathermap"

        TEST_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ5NmMyNWIxLWExOWEtNGFhNC1iZTFlLWU3ZmM2YjI0MjQ0MCIsIm5hbWUiOiJBbmRyw6kgQ291dG8iLCJpYXQiOjE3MzQ4MzQ5MDQsImV4cCI6MTczNzQyNjkwNH0.H4wwk0wzYSEshekHoEEqP8f1KdBZURLgysHwgOkLbZ4"
        TEST_FILE_PDF="INF16175.pdf"
        TEST_FILE_TXT="INF16175.txt"
        ```

    - Obs: token especial para testes, utilizando um token real com duração de 1 mês.

4. Suba os containers no Docker:

    ```bash

    docker-compose up --build
    ```

    <!-- docker-compose -f docker-compose.test.yml up --build -->

<!-- 5. Rode as migrações do banco de dados:

    ```bash
    npx prisma migrate dev
    ``` -->

<!-- 5. Acesse o servidor:
    ```bash
    npm start
    ``` -->

O servidor estará rodando em `http://localhost:3000`.

## Uso

### Endpoints Principais

#### Criar Usuário

**POST /api/users**

-   **Body:**

    ```json
    {
    	"name": "João Silva",
    	"email": "joao@email.com",
    	"password": "senha123456",
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

#### Login

**POST /api/users/login**

-   **Body:**

    ```json
    {
    	"email": "joao@email.com",
    	"password": "senha123456"
    }
    ```

-   **Resposta:**
    ```json
    {
    	"message": "Login realizado com sucesso.",
    	"token": "jwt_token"
    }
    ```

#### Upload de Documento

**POST /api/users/documents**

-   Adicione um Authenticated Method como `Bearer` e coloque o token recebido em `login`
-   Envie um arquivo pelo campo `file` no formato `multipart/form-data`.
-   Envie um nome pelo campo `nome`.

-   **Resposta:**
    ```json
    {
      "message": "Documento enviado com sucesso.",
      "document": { "id": "uuid-do-documento", "name": "RG", ... }
    }
    ```

#### Logout

**POST /api/users/logout**

-   Adicione um Authenticated Method como `Bearer` e coloque o token recebido em `login`

-   **Resposta:**
    ```json
    {
    	"message": "Logout realizado com sucesso."
    }
    ```

#### Criar Habilidade

**POST /api/abilities**

-   Adicione um Authenticated Method como `Bearer` e coloque o token recebido em `login`

-   **Body:**

    ```json
    {
    	"name": "Desenvolvimento de Redes"
    }
    ```

-   **Resposta:**
    ```json
    {
    	"message": "Habilidade criada com sucesso.",
        "ability": {
        	"id": "uuid_ability",
            ...
            }
    }
    ```

#### Atualizar Habilidade

**PUT /api/abilities**

-   Adicione um Authenticated Method como `Bearer` e coloque o token recebido em `login`

-   **Body:**

    ```json
    {
    	"id": "9e3a8ee4-332f-4ab9-83c5-afe4ed7c4aa3",
    	"active": false
    }
    ```

-   **Resposta:**
    ```json
    {
        "message": "Habilidade atualizada com sucesso.",
        "ability": {
    	    "id": "uuid_ability",
            "active": false,
            ...
            }
    }
    ```

#### Listar Habilidades

**GET /api/abilities**

-   Adicione um Authenticated Method como `Bearer` e coloque o token recebido em `login`

-   **Body:**

    ```json
    {
    	"page": "1",
    	"limite": "5"
    }
    ```

-   **Resposta:**
    ```json
    {
    "message": "Habilidades listadas com sucesso.",
        "abilities": [
            {
                "id": "uuid_ability",
                "active": false,
                ...
            }, {
                ...
            }
        ]
    }
    ```

#### Adicionar Habilidade a Usuário

**POST /api/users/abilities**

-   Adicione um Authenticated Method como `Bearer` e coloque o token recebido em `login`

-   **Body:**

    ```json
    {
    	"user_id": "user-uuid",
    	"ability_id": "ability-uuid",
    	"years_experience": 4
    }
    ```

-   **Resposta:**
    ```json
    {
        "message": "Habilidade relacionada ao usuário com sucesso.",
        "userAbility": {
    	    "id": "6179abbb-f89c-41a9-836f-2d4ea6212050",
    	    "user_id": "user-uuid",
            ...
            }
    }
    ```

#### Listar Habilidades do Usuário

**POST /api/abilities**

-   Adicione um Authenticated Method como `Bearer` e coloque o token recebido em `login`

-   **Body:**

    ```json
    {
    	"user_id": "user-uuid",
    	"page": "1",
    	"limite": "5"
    }
    ```

-   **Resposta:**
    ```json
    {
        "message": "Habilidades listadas com sucesso.",
        "abilities": [
            {
                "id": "ef288cad-c68d-4684-80a7-128938685005",
                "name": "Desenvolvimento de Redes",
                "active": true,
                ...
            },{
                ...
            }
        ]
    }
    ```

#### Deletar Habilidades do Usuário

**DELETE /api/user/abilities**

-   Adicione um Authenticated Method como `Bearer` e coloque o token recebido em `login`

-   **Body:**

    ```json
    {
    	"ids": ["d9c94981-fc62-4905-8eb7-e51f315eeb5d", "6179abbb-f89c-41a9-836f-2d4ea6212050"]
    }
    ```

-   **Resposta:**
    ```json
    {
    	"message": "Habilidades removidas com sucesso."
    }
    ```

#### Listar Documentos do Usuário

**GET /api/users/documents**

-   Adicione um Authenticated Method como `Bearer` e coloque o token recebido em `login`

-   **Resposta:**
    ```json
    {
       "message": "Arquivos recuperados com sucesso.",
        "files": [
            {
                "id": "document_uuid",
                "name": "file_name",
                "url":
            }, {
                ...
            }
        ]
    }
    ```

#### Fazer o download de um Documento Especifico

**GET /api/users/documents/:fileId**

-   Adicione um Authenticated Method como `Bearer` e coloque o token recebido em `login`

-   **Resposta:**
    ```
    application/pdf
    ```

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

<!-- ## Testes

Para rodar os testes unitários:

```bash
npm test
```

Os testes cobrem:

-   Criação de usuários e habilidades.
-   Upload e gerenciamento de documentos.
-   Requisições à API de clima.
 -->

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
