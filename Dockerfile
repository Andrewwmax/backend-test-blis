# Base Node.js image
FROM node:22

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código para o container
COPY . .

# Executa o build da aplicação
RUN npm run build

# Expõe a porta 3000
EXPOSE 3000

# Define o comando para iniciar a aplicação em modo de produção
# CMD ["npm", "run", "start"]
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]

