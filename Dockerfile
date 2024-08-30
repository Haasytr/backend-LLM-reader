
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY /src .
RUN npx prisma generate
RUN npx prisma db push
ENTRYPOINT npm run dev

FROM alpine:3.16

