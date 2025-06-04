FROM node:23-alpine3.22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
#run npm run start
CMD ["npm", "run", "start"]