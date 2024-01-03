FROM node:20.7.0

WORKDIR /app

COPY package*.json .

COPY . .

RUN npm ci
RUN npm run build

COPY ./dist ./
COPY .env.docker ./.env

CMD node ./src/main.js
EXPOSE 8000