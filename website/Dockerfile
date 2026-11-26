FROM public.ecr.aws/docker/library/node:26-alpine AS builder

ARG HOST_NAME
ARG API_URL
ARG GOOGLE_TAG_MANAGER_ID

ENV NODE_ENV=production

WORKDIR /app

COPY .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases/
COPY package.json yarn.lock turbo.json ./
COPY website/package.json ./website/
COPY api/package.json ./api/

RUN chmod +x .yarn/releases/yarn-4.19.0.cjs && \
    ln -s /app/.yarn/releases/yarn-4.19.0.cjs /usr/local/bin/yarn && \
    yarn --version && \
    cp yarn.lock /tmp/yarn.lock.before && \
    yarn workspaces focus @mileszko-landing-page/monorepo @mileszko-landing-page/website @mileszko-landing-page/api && \
    cmp yarn.lock /tmp/yarn.lock.before && \
    yarn cache clean

COPY website ./website
COPY api ./api

RUN echo "HOST_NAME=${HOST_NAME}" > ./website/.env && \
    echo "API_URL=${API_URL}" >> ./website/.env && \
    echo "GOOGLE_TAG_MANAGER_ID=${GOOGLE_TAG_MANAGER_ID}" >> ./website/.env

RUN yarn website:build

FROM public.ecr.aws/docker/library/alpine:3.22

RUN addgroup -g 1000 -S app && \
    adduser -S -u 1000 -G app app

WORKDIR /output

COPY --from=builder --chown=app:app /app/website/dist/client ./

USER app
