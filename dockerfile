FROM node:23-alpine3.20

WORKDIR /usr/src/app

COPY package*.json ./

RUN bun install

COPY . .

EXPOSE 8080
CMD ["bun", "index.js"]