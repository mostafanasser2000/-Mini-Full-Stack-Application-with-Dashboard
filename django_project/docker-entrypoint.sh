#!/bin/bash

echo "Waiting for postgres..."

while ! nc -z db 5432; do
    sleep 0.1
done

echo "PostgresSQL started"

python3 manage.py flush --no-input
python3 manage.py migrate

exec "$@"