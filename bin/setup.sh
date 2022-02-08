#!/bin/sh

if [ "$NODE_ENV" = "development" ]; then
  yarn install --production=false --ignore-scripts
  yarn build
  rm -rf ../node_modules
fi