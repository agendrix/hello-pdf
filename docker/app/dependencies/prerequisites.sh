#!/bin/bash
set -e

echo "Installing build dependencies" && \
  apt-get update && apt install -y --no-install-recommends \
  wget \
  ssh \
  gnupg

echo "Setup ssh"
mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts