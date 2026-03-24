#!/bin/zsh

set -euo pipefail

container_name="eventstore.db"
image="eventstore/eventstore:24.10.5-bookworm-slim"

if docker ps --format '{{.Names}}' | grep -qx "$container_name"; then
  echo "EventStoreDB is already running."
  exit 0
fi

if docker ps -a --format '{{.Names}}' | grep -qx "$container_name"; then
  echo "Starting existing EventStoreDB container..."
  docker start "$container_name" >/dev/null
  echo "EventStoreDB started."
  exit 0
fi

echo "Creating and starting EventStoreDB container..."

docker run -d \
  --name "$container_name" \
  -p 2113:2113 \
  -p 1113:1113 \
  -e EVENTSTORE_CLUSTER_SIZE=1 \
  -e EVENTSTORE_RUN_PROJECTIONS=All \
  -e EVENTSTORE_START_STANDARD_PROJECTIONS=true \
  -e EVENTSTORE_INSECURE=true \
  -e EVENTSTORE_ENABLE_ATOM_PUB_OVER_HTTP=true \
  -v eventstore-volume-data:/var/lib/eventstore \
  -v eventstore-volume-logs:/var/log/eventstore \
  "$image" >/dev/null

echo "EventStoreDB started."