FROM node:lts-alpine

RUN npm install -g pnpm
RUN apk add --no-cache ffmpeg

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm build

CMD ["pnpm", "start"]