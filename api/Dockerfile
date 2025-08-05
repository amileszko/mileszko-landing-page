FROM public.ecr.aws/docker/library/node:21-alpine AS builder

ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml turbo.json ./
COPY api/package.json ./api/

RUN corepack enable && \
    yarn workspaces focus @mileszko-landing-page/monorepo @mileszko-landing-page/api && \
    yarn cache clean

COPY api ./api

RUN yarn api:build

FROM public.ecr.aws/docker/library/alpine:3.22

RUN addgroup -g 1000 -S app && \
    adduser -S -u 1000 -G app app

WORKDIR /output

COPY --from=builder --chown=app:app /app/api/dist ./

USER app
