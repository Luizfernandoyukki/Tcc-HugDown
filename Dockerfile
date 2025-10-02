FROM node:18-alpine

# Diretório da aplicação
WORKDIR /usr/src/app

# Copia package.json primeiro para aproveitar cache de camadas
COPY package*.json ./

# Instala apenas dependências de produção (se tiver package-lock use npm ci)
RUN npm ci --only=production

# Copia o restante do código
COPY . .

# Caso tenha build step (se não tiver, o comando é ignorado por && true)
RUN npm run build || true

# Instala PM2 globalmente para gerenciar o processo
RUN npm install -g pm2

EXPOSE 3000

# Usamos pm2-runtime para integração com containers e logs
CMD ["pm2-runtime", "ecosystem.config.js"]
