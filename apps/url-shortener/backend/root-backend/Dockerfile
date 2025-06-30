FROM node:22-alpine AS builder
 
WORKDIR /app
 
COPY package.json pnpm-lock.yaml nx.json tsconfig* jest* ./
COPY apps/url-shortener/backend/root-backend apps/url-shortener/backend/root-backend
COPY apps/url-shortener/backend/auth-backend apps/url-shortener/backend/auth-backend
COPY apps/url-shortener/backend/management-backend apps/url-shortener/backend/management-backend
COPY shared/backend shared/backend
 
RUN npm install -g pnpm && pnpm install
RUN pnpm nx run url-shortener-root-backend:build:production
 
EXPOSE 3000
 
CMD ["node", "dist/apps/url-shortener/backend/root-backend/main.js"]