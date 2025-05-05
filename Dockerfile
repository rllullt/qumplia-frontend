# Stage 1: Construcción con Node
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env.production .env.production
RUN npm run build

# Stage 2: Servir con Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Opcional: reemplazar config por una personalizada si la tienes
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
