#!/bin/sh
set -e

# Wait for MySQL to be ready
echo "Waiting for database at $DB_HOST:$DB_PORT..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Database not ready, sleeping 1s..."
  sleep 1
done
echo "Database is up!"

echo "create init migration"
npm run migration:generate -- src/migrations/init
# Run migrations and show output
echo "Running migrations..."
npm run migration:run

echo "Building the app..."
npm run build
# Start the app and show logs
echo "Starting the application..."
npm run start:prod
