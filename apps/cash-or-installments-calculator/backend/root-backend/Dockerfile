FROM node:22-alpine AS builder
 
WORKDIR /app
 
COPY package.json pnpm-lock.yaml nx.json tsconfig* jest* ./
COPY apps/cash-or-installments-calculator/backend/root-backend apps/cash-or-installments-calculator/backend/root-backend
COPY shared/backend shared/backend
 
RUN npm install -g pnpm && pnpm install
RUN pnpm nx run cash-or-installments-calculator-root-backend:build:production
 
EXPOSE 3000
 
CMD ["node", "dist/apps/cash-or-installments-calculator/backend/root-backend/main.js"]