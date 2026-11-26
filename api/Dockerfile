FROM public.ecr.aws/docker/library/node:26-alpine AS builder

ENV NODE_ENV=production

WORKDIR /app

COPY .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases/
COPY package.json yarn.lock turbo.json ./
COPY api/package.json ./api/

RUN chmod +x .yarn/releases/yarn-4.19.0.cjs && \
    ln -s /app/.yarn/releases/yarn-4.19.0.cjs /usr/local/bin/yarn && \
    yarn --version && \
    cp yarn.lock /tmp/yarn.lock.before && \
    yarn workspaces focus @mileszko-landing-page/monorepo @mileszko-landing-page/api && \
    cmp yarn.lock /tmp/yarn.lock.before && \
    yarn cache clean

COPY api ./api

RUN yarn api:build

FROM public.ecr.aws/docker/library/alpine:3.22

RUN addgroup -g 1000 -S app && \
    adduser -S -u 1000 -G app app

WORKDIR /output

COPY --from=builder --chown=app:app /app/api/dist ./

USER app
