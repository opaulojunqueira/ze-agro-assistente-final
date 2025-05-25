# Etapa 1: Build do projeto
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm run build

# Etapa 2: Servir com Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração opcional de rotas
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 710

CMD ["nginx", "-g", "daemon off;"]
