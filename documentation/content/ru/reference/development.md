---
title: Разработка библиотеки
description: Локальная работа, тестирование и правила добавления компонентов.
tags: [development, tests, build]
---

# Разработка библиотеки

## Установка и проверки

```shell
npm install
npm test
npm run typecheck
npm run build
```

`npm test` запускает Vitest, `typecheck` — `vue-tsc`, `build` — Vite library
build и генерацию declarations в `dist/types`.

## Добавление компонента

1. Выберите один предметный слой: `controls`, `data`, `feedback`, `overlays` или `shell`.
2. Создайте небольшой Vue-компонент и соседний CSS-файл.
3. Добавьте локальный `index.ts`, который импортирует только этот CSS.
4. Добавьте отдельный Vite entry и `package.json#exports`.
5. Экспортируйте публичные типы, но не внутренние helpers.
6. Напишите тесты поведения, клавиатуры и emitted state.
7. Обновите страницу компонента в Docara.

## Инварианты

- Vue остаётся `peerDependency` и не попадает в bundle;
- компонент не зависит от Router, Pinia, API или продукта;
- общие токены не импортируются компонентом скрыто;
- один subpath не должен тянуть CSS несвязанных компонентов;
- бизнес-виджеты оформляются отдельным package layer;
- исправление общего контрола делается в библиотеке, а не проектным CSS-костылём.

## Документация

```shell
cd documentation
composer install
php vendor/bin/docara doctor --json
php vendor/bin/docara validate project --json
php vendor/bin/docara build production
php vendor/bin/docara verify-static build_production
```

Исходниками являются `docara.json`, `content/**` и project-owned assets.
`vendor/` и `build_*` не входят в Git. Файлы `.docara/engine/**` обновляются
только командами Docara.

## Перед выпуском

- проверить `package.json` как единственный источник версии;
- обновить `CHANGELOG.md` и документацию изменённого API;
- выполнить тесты, typecheck и production build;
- проверить, что `dist` содержит отдельные JS/CSS assets;
- отдельно согласовать tag, package publication и deployment документации.
