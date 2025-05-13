FROM node:20 as base

WORKDIR /app

COPY package*.json ./

FROM base as dev

RUN yarn install 

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

EXPOSE 3000

ENTRYPOINT ["yarn"]
