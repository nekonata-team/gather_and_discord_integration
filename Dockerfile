FROM oven/bun:latest

ENV TZ Asia/Tokyo

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY ./src ./src

CMD ["bun", "run", "src/index.ts"]