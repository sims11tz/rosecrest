FROM node:lts-alpine

RUN apk add --no-cache nano
RUN apk add --no-cache openssl ca-certificates

RUN mkdir -p /app
RUN mkdir -p /app/client
RUN mkdir -p /app/client/src/shared
RUN mkdir -p /app/logs
WORKDIR /app

COPY ./client/package.json /app/client
COPY ./client/tsconfig.json /app/client
COPY ./client/webpack.config.js /app/client
COPY ./client/config-overrides.js /app/client

RUN rm -rf /app/client/package-lock.json
RUN rm -rf /app/client/yarn.lock
RUN rm -rf /app/client/node_modules
RUN rm -rf /app/client/src/shared

WORKDIR /app/client

RUN yarn install

ENV NODE_OPTIONS=--openssl-legacy-provider

COPY ./client/env.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/env.sh
ENTRYPOINT ["env.sh"]

CMD ["sh", "-c", "NODE_OPTIONS=--openssl-legacy-provider yarn start"]