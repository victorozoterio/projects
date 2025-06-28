FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml nx.json tsconfig* jest* ./
COPY apps/back-office/backend/auth-backend apps/back-office/backend/auth-backend

RUN npm install -g pnpm && pnpm install

RUN pnpm nx run back-office-auth-backend:build:production

EXPOSE 3000

CMD ["node", "dist/apps/back-office/backend/auth-backend/main.js"]