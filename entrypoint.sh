#!/bin/sh

echo "Esperando banco de dados..."

while ! nc -z "$POSTGRES_HOST" 5432; do
  sleep 1
done

echo "Banco disponível!"

# Espera até que a tabela conferencias_conferencia exista (máximo 60 tentativas)
if [ "$ROLE" = "importer" ]; then
  echo "Verificando se as tabelas estão disponíveis..."
  for i in $(seq 1 60); do
    TABLE_EXISTS=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT to_regclass('conferencias_conferencia');")
    if [ "$TABLE_EXISTS" = "conferencias_conferencia" ]; then
      echo "Tabela conferencias_conferencia existe! Executando importação..."
      exec python3 backend/jogadados.py
    else
      echo "Aguardando tabelas do Django serem criadas... ($i/60)"
      sleep 2
    fi
  done
  echo "Erro: Tabela conferencias_conferencia não foi criada após aguardar."
  exit 1
fi

echo "Executando migrations..."
python backend/manage.py migrate

if [ "$DJANGO_ENV" = "prod" ]; then
  echo "Coletando arquivos estáticos..."
  python backend/manage.py collectstatic --noinput

  echo "Iniciando servidor Gunicorn (produção)..."
  exec gunicorn backend.project.wsgi:application --bind 0.0.0.0:8000
else
  echo "Iniciando servidor de desenvolvimento..."
  exec python backend/manage.py runserver 0.0.0.0:8000
fi
