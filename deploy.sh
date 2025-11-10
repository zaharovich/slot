#!/usr/bin/env sh

# Остановка при ошибках
set -e

# Сборка проекта
npm run build

# Переход в папку с собранным проектом
cd dist

# Инициализация git репозитория
git init
git add -A
git commit -m 'deploy'

# Деплой в ветку gh-pages
# Замените <USERNAME>/<REPO> на свой репозиторий
git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

cd -

