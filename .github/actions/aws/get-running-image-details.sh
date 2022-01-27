#!/bin/sh
set -e

action_help() {
  echo
  echo "Ask the ECS service for the image uri of one container in the running task definition."
  echo
  echo "inputs:"
  echo "- cluster:   Name of the cluster"
  echo "- service:   Name of the service"
  echo "- container: Container name"
  echo
  echo "outputs:"
  echo " - image_uri:     URI of the requested container image"
  echo " - image_version: Version of the requested container image"
  echo
}

if [ -z "${cluster}" ] || [ -z "${service}" ] || [ -z "${container}" ] ; then
  echo "One or more options are not set."; action_help; exit 1
fi

service_current_stable_taskdef_arn=$(
  aws ecs describe-services --cluster "${cluster}" --services "${service}" \
    | jq '.services[0].deployments' \
    | jq 'map(select(.desiredCount == .runningCount))' \
    | jq '.[0].taskDefinition' \
    | jq -r 'select(. != null)'
)

if [ -z "$service_current_stable_taskdef_arn" ]; then
  echo "No current stable task-definition were found for service: $service in cluster: $cluster"
  exit 1
fi

image_uri=$(aws ecs describe-task-definition --task-definition "$service_current_stable_taskdef_arn" | jq -r '.taskDefinition.containerDefinitions[] | select(.name = "$container") | .image')
image_version=$(echo "$image_uri" | cut -f2 -d":")

echo "Current stable image is '$image_uri'."
echo "::set-output name=image_uri::$image_uri"
echo "::set-output name=image_version::$image_version"
