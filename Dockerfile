FROM node:20.7.0 AS BUILDER

WORKDIR /app

COPY package.json .
COPY package-lock.json .

COPY . .

RUN npm run build
RUN npm rebuild bcrypt --build-from-source

FROM node:20.7.0

COPY --from=BUILDER ./node_modules ./node_modules
COPY --from=BUILDER ./dist ./