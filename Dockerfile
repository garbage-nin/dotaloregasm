FROM node:21-alpine AS base
WORKDIR /usr/app
COPY package.json package-lock.json* ./

FROM base AS build
RUN npm install

COPY . .

FROM build as dev
EXPOSE 3001
CMD ["npm", "run", "dev"]
