FROM public.ecr.aws/docker/library/node:26-alpine AS builder

ARG HOST_NAME
ARG API_URL
ARG GOOGLE_TAG_MANAGER_ID

ENV NODE_ENV=production

WORKDIR /app

RUN npm install -g pnpm@12.24.0

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./
COPY website/package.json ./website/
COPY api/package.json ./api/

RUN pnpm install --frozen-lockfile \
    --filter @mileszko-landing-page/website \
    --filter @mileszko-landing-page/api

COPY website ./website
COPY api ./api

RUN echo "HOST_NAME=${HOST_NAME}" > ./website/.env && \
    echo "API_URL=${API_URL}" >> ./website/.env && \
    echo "GOOGLE_TAG_MANAGER_ID=${GOOGLE_TAG_MANAGER_ID}" >> ./website/.env

RUN pnpm --filter @mileszko-landing-page/api build && \
    pnpm --filter @mileszko-landing-page/website build

FROM public.ecr.aws/docker/library/alpine:3.22

RUN addgroup -g 1000 -S app && \
    adduser -S -u 1000 -G app app

WORKDIR /output

COPY --from=builder --chown=app:app /app/website/dist/client ./

USER app
