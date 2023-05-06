FROM node:lts-alpine

RUN npm install -g pnpm
RUN apk add ffmpeg

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm build

CMD ["pnpm", "start"]