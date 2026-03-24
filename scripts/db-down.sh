#!/bin/zsh

set -euo pipefail

container_name="eventstore.db"

if ! docker ps -a --format '{{.Names}}' | grep -qx "$container_name"; then
  echo "No EventStoreDB container found."
  exit 0
fi

echo "Stopping and removing EventStoreDB container..."
docker rm -f "$container_name" >/dev/null
echo "EventStoreDB stopped."