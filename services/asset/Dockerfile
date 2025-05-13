FROM node:20 as base

WORKDIR /app

COPY package*.json ./

FROM base as dev

RUN yarn install 

COPY . .

EXPOSE 4000

ENTRYPOINT ["yarn"]
