#!/bin/sh

echo "Attente de la base de données ($POSTGRES_HOST:$POSTGRES_PORT)..."

while ! nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  sleep 1
done

echo "Base de données disponible, exécution du script Python..."
python generate_fake_users.py
