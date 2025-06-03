FROM node:lts-buster

WORKDIR /app

COPY package.json pnpm-lock.yaml nx.json tsconfig* jest* ./
COPY apps/url-shortener/backend/management-backend apps/url-shortener/backend/management-backend

RUN curl -sfS https://dotenvx.sh/install.sh | sh
RUN npm install -g pnpm && pnpm install
RUN pnpm nx run management-backend:build:production

EXPOSE 3000

CMD ["dotenvx", "run", "--env-file=apps/url-shortener/backend/management-backend/.env", "--", "node", "dist/apps/url-shortener/backend/management-backend/main.js"]
