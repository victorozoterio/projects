FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml nx.json tsconfig* jest* ./
COPY apps/investments-price-alert/backend/root-backend apps/investments-price-alert/backend/root-backend
COPY shared/backend shared/backend
 
RUN npm install -g pnpm && pnpm install
RUN pnpm nx run investments-price-alert-root-backend:build:production
 
EXPOSE 3000
 
CMD ["node", "dist/apps/investments-price-alert/backend/root-backend/main.js"]