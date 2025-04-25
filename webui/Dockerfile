FROM node:18-bookworm-slim AS builder

RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://bun.sh/install | bash && \
    echo 'export PATH="$HOME/.bun/bin:$PATH"' >> /etc/bash.bashrc && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun

RUN bun --version

RUN apt-get update && apt-get install -y tzdata
ENV TZ=Asia/Shanghai

ARG REGISTRY_URL=https://registry.npmmirror.com
ENV BUN_CONFIG_REGISTRY=$REGISTRY_URL

# 关键修复：安装CA证书
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json bun.lock* ./

RUN echo "使用镜像源: $BUN_CONFIG_REGISTRY" && \
    bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM oven/bun:1.1.8-slim

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/server.mjs .
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3001

CMD ["bun", "run" ,"start"]