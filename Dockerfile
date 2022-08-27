FROM node:16-alpine3.15

RUN mkdir -p /usr/src/app

WORKDIR /var/www/app

COPY *.json ./

RUN npm install

COPY . .

EXPOSE 3000
