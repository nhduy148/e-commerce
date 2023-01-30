FROM node:16-alpine as builder

ARG NX_DEPLOY_ENV
ARG NX_CHANNEL_CODE
ENV NX_DEPLOY_ENV=$NX_DEPLOY_ENV
ENV NX_CHANNEL_CODE=$NX_CHANNEL_CODE

RUN apk add --no-cache
WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install
COPY . .
RUN NX_DEPLOY_ENV=$NX_DEPLOY_ENV NX_CHANNEL_CODE=$NX_CHANNEL_CODE NODE_ENV=production yarn build:gsp

FROM node:16-alpine
RUN apk add --no-cache
WORKDIR /app
COPY --from=builder /app/dist/apps/get-sample/package.json /app/
RUN yarn install \
  && rm -rf /var/cache/apk/* \
  && rm -rf /usr/local/share/.cache/yarn/*
COPY --from=builder /app/dist/apps/get-sample /app
CMD ["yarn", "next", "start", "-p", "5000"]
