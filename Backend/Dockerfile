FROM node:22.23-slim

RUN apt-get update && apt-get install -y openssl

WORKDIR /api

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 10000

<<<<<<< HEAD
CMD ["sh", "-c", "npx prisma generate && exec npm run dev"]
=======
CMD ["npm", "run", "start"]
>>>>>>> 4d47feef0fc0fe74399d5ebabebd390acc31b89c
