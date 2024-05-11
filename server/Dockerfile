FROM node:21-alpine

RUN apk add --no-cache nano

RUN mkdir -p /app
RUN mkdir -p /app/server
RUN mkdir -p /app/logs

COPY ./server/package.json /app/server/
COPY ./server/tsconfig.json /app/server/
COPY ./server/webpack.config.js /app/server/
COPY ./server/knexfile.js /app/server/
COPY ./server/nodemon.json /app/server/
COPY ./server/.env /app/server/

RUN rm -rf /app/server/package-lock.json
RUN rm -rf /app/server/yarn.lock
RUN rm -rf /app/server/node_modules

WORKDIR /app/server

RUN npm install

CMD ["npm", "start"]