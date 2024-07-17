#!/usr/bin/env bash
#!/bin/sh

set -e

echo "Waiting for postgres on ${POSTGRES_chat}:${POSTGRES_PORT}..."
while ! nc -z "$POSTGRES_chat" "$POSTGRES_PORT"; do
  sleep 0.1
done
echo "PostgreSQL started"

npm run typeorm migration:run
npm run start:prod

exec "$@"