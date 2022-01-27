#!/bin/bash
set -e

ROOT=$(dirname "$(cd "$(dirname "$0/")"; pwd)")
NODE_ENV="production"

while test $# -gt 0; do
  case "$1" in
    (-h|--help)
        echo "Builds docker images for the hello-pdf"
        echo "options:"
        echo "-h, --help                  Show brief help."
        echo "-e, --env                   Node environnement. Defaults to 'development'"
        exit 0;;
    (-e|--env)
        NODE_ENV="$2"
        shift
        shift;;
  esac
done

withssh="$ROOT/docker/ssh-subshell.sh"
echo "-> Fetching local ssh key"
SSH_KEY=$(cat ~/.ssh/id_rsa)
export SSH_KEY

echo "*** Building image with NODE_ENV=$NODE_ENV ***"

echo "-> Building app image"
$withssh docker build --ssh default --build-arg NODE_ENV="$NODE_ENV" -t agendrix/hello-pdf -f "$ROOT/docker/app/Dockerfile" .

echo "-> Cleaning up unused images"
docker image prune -f
