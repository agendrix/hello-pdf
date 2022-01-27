# Stage 1: Compile typescript app
FROM node:16-slim as compilation
COPY . .
RUN ./docker/app/compilation/compile.sh

# Stage 2: Install runtime dependencies
FROM node:16-slim as dependencies
WORKDIR /tmp
COPY ./docker/app/dependencies .
RUN ./prerequisites.sh
RUN ./puppeteer.sh
RUN ./cleanup.sh
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Stage 3: Assemble production application
FROM dependencies
WORKDIR /app
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ENV PATH="/app/bin:${PATH}"
COPY package.json yarn.lock ./
RUN --mount=type=ssh yarn install --frozen-lockfile --ignore-optional --production
COPY ./bin ./bin
COPY --from=compilation /dist ./dist
EXPOSE 4000