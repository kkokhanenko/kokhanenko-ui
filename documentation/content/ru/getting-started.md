---
title: Установка и быстрый старт
description: Подключение Kokhanenko UI к приложению Vue 3.
tags: [installation, vue, vite]
---

# Установка и быстрый старт

## Требования

- Vue `^3.5.0`;
- современный браузер с поддержкой `light-dark()`, OKLCH и `color-mix()`;
- сборщик с поддержкой ESM и CSS imports, например Vite.

Библиотека пока приватная. Для локальной разработки подключите соседнюю
рабочую копию:

```shell
npm install ../kokhanenko-ui
```

После появления package registry устанавливайте зафиксированную версию, а не
плавающую ветку.

## Подключение foundation

Один раз импортируйте foundation в точке входа приложения:

```javascript
import { createApp } from 'vue';
import '@kokhanenko/ui/foundation';
import App from './App.vue';

createApp(App).mount('#app');
```

Foundation подключает семантические переменные, `box-sizing` внутри `.kui-scope`
и служебный класс `.kui-visually-hidden`. Он не выполняет глобальный reset.

## Первый компонент

```xml
<script setup lang="ts">
import { ref } from 'vue';
import { KButton } from '@kokhanenko/ui/button';

const saving = ref(false);

async function save() {
  saving.value = true;
  try {
    await Promise.resolve();
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <section class="kui-scope">
    <KButton :loading="saving" @click="save">Сохранить</KButton>
  </section>
</template>
```

Импорт компонента подключает только его JavaScript и собственный CSS chunk.
Foundation подключается приложением явно.

## Точечные и общие импорты

Для production-кода предпочтительны subpath imports:

```javascript
import { KSelect, type KSelectOption } from '@kokhanenko/ui/select';
import { KDataTable, type KDataTableColumn } from '@kokhanenko/ui/data-table';
```

Общий entry point удобен для прототипов, но подключает больше экспортов:

```javascript
import { KButton, KModal, KTabs } from '@kokhanenko/ui';
```

Preferences API намеренно подключается отдельно:

```javascript
import { createKUiPreference } from '@kokhanenko/ui/preferences';
```

## Следующие шаги

- [Архитектура и границы](/kokhanenko-ui/ru/architecture/)
- [Темы и CSS-токены](/kokhanenko-ui/ru/styling/)
- [Каталог компонентов](/kokhanenko-ui/ru/components/)
