#!/bin/bash
set -e

./docker/app/dependencies/prerequisites.sh

export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
yarn install
yarn build
