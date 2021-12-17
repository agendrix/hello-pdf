#!/bin/bash
set -e

ROOT=$(dirname "$(cd "$(dirname "$0/")"; pwd)")
NODE_ENV="development"

while test $# -gt 0; do
  case "$1" in
    (-h|--help)
        echo "Builds docker images for the hello-pdf"
        echo "options:"
        echo "-h, --help                  Show brief help."
        echo "-e, --env                   Node environnement. Defaults to 'development'"
        echo "-p, --profile               AWS profile to fetch SSH value (only used when --env != 'development')"
        exit 0;;
    (-e|--env)
        NODE_ENV="$2"
        shift
        shift;;
    (-p|--profile)
        PROFILE="$2"
        shift
        shift;;
  esac
done

withssh="$ROOT/docker/ssh-subshell.sh"
if [ "$NODE_ENV" = "development" ]; then
  echo "-> Fetching local ssh key"
  SSH_KEY=$(cat ~/.ssh/id_rsa)
else
  echo "-> Fetching ssh key from parameter store"
  param_from_ssm=$(aws ssm get-parameter --name /web/app/ssh/id_rsa --with-decryption --profile "$PROFILE")
  SSH_KEY=$(jq '.Parameter.Value' <<< "$param_from_ssm" | jq -r)
  NODE_ENV="production"
fi
export SSH_KEY

echo "*** Building image with NODE_ENV=$NODE_ENV ***"

echo "-> Building base image"
$withssh docker build -t agendrix/hello-pdf -f "$ROOT/docker/Dockerfile" . 

echo "-> Cleaning up unused images"
docker image prune -f
