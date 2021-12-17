#!/bin/bash
set -e

echo "Installing build dependencies" && \
  apt-get update && apt install -y --no-install-recommends \
  wget \
  ssh \
  gnupg