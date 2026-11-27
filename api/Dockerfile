FROM public.ecr.aws/docker/library/node:26-alpine AS builder

ENV NODE_ENV=production

WORKDIR /app

RUN npm install -g pnpm@12.24.0

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./
COPY api/package.json ./api/

RUN pnpm install --frozen-lockfile --filter @mileszko-landing-page/api

COPY api ./api

RUN pnpm --filter @mileszko-landing-page/api build

FROM public.ecr.aws/docker/library/alpine:3.22

RUN addgroup -g 1000 -S app && \
    adduser -S -u 1000 -G app app

WORKDIR /output

COPY --from=builder --chown=app:app /app/api/dist ./

USER app
