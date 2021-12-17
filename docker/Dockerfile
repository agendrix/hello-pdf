FROM node:16-slim

WORKDIR /tmp

COPY ./docker/dependencies .

RUN ./prerequisites.sh
RUN ./puppeteer.sh
RUN ./cleanup.sh
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
COPY package.json yarn.lock ./
RUN --mount=type=ssh yarn install --frozen-lockfile --ignore-optional --production

COPY . .
ENV PATH="/app/bin:${PATH}"

EXPOSE 4000