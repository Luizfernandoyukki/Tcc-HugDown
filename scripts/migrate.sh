#!/usr/bin/env bash
set -e

# Certifique-se de ter variáveis DB_* em .env ou ambiente
if [ -z "$DB_HOST" ]; then
  echo "Variáveis DB_* não definidas. Carregue .env antes (ex: export $(cat .env | xargs))"
  exit 1
fi

mysql -h "$DB_HOST" -P "${DB_PORT:-3306}" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < migrations/add_subscription.sql
echo "Migração executada com sucesso."
