FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./

RUN rm -rf node_modules
RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN rm -rf node_modules
RUN npm install --omit=dev --legacy-peer-deps 

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules/.prisma/client  ./node_modules/.prisma/client

CMD ["node", "dist/apps/auth/main"]

