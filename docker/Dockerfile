FROM node:16-slim

WORKDIR /tmp

# Remove apt-key stdout is not a terminal warnings
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn

RUN echo "Installing build dependencies" && \
  apt-get update && apt install -y --no-install-recommends \
  wget \
  ssh \
  gnupg

COPY ./docker/dependencies/puppeteer.sh .
RUN ./puppeteer.sh
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN echo "Cleaning up" && \
  apt-get clean && \
  rm -rf /tmp/* /var/tmp/* /var/lib/apt/lists/*

RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

WORKDIR /app

COPY package.json yarn.lock ./
RUN --mount=type=ssh yarn install --frozen-lockfile --ignore-optional

COPY . .
ENV PATH="/app/bin:${PATH}"

EXPOSE 4000