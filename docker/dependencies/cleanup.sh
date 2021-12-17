#!/bin/bash
set -e

echo "Cleaning up" && \
  apt-get clean && \
  rm -rf /tmp/* /var/tmp/* /var/lib/apt/lists/*