FROM node:lts-stretch-slim as base

WORKDIR /home/node/app

COPY package.json ./

RUN npm i
RUN npm i ts-node@latest

COPY . .

FROM base as production

ENV NODE_PATH=./build

RUN npm run build