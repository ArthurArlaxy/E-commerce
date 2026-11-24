FROM node:22.23-slim

RUN apt-get update && apt-get install -y openssl

WORKDIR /api

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3333

CMD ["sh", "-c", "npx prisma generate && exec npm run dev"]