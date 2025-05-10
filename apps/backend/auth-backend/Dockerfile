FROM node:lts-buster

WORKDIR /app

COPY package.json pnpm-lock.yaml nx.json tsconfig* jest* ./
COPY apps/backend/auth-backend apps/backend/auth-backend

RUN curl -sfS https://dotenvx.sh/install.sh | sh
RUN npm install -g pnpm && pnpm install
RUN pnpm nx run auth-backend:build:production

EXPOSE 3000

CMD ["dotenvx", "run", "--env-file=apps/backend/auth-backend/.env", "--", "node", "dist/apps/backend/auth-backend/main.js"]
