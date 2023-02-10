FROM node:lts-alpine

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm build

CMD ["pnpm", "start"]