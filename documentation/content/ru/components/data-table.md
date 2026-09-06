---
title: KDataTable
description: Универсальная controlled-таблица с сортировкой, фильтрами, действиями и режимом карточек.
tags: [component, table, sorting, actions]
---

# KDataTable

`KDataTable` отображает переданные строки и сообщает о действиях пользователя.
Она не сортирует, не фильтрует и не загружает серверные данные самостоятельно.

```javascript
import {
  KDataTable,
  type KDataTableColumn,
  type KDataTableKey,
} from '@kokhanenko/ui/data-table';
```

## Базовый пример

```xml
<script setup lang="ts">
import { ref } from 'vue';
import { KDataTable, type KDataTableColumn } from '@kokhanenko/ui/data-table';

type Item = { id: number; createdAt: string; title: string; value: number };

const columns: KDataTableColumn<Item>[] = [
  { key: 'createdAt', label: 'Дата создания', sortable: true, width: 160 },
  { key: 'title', label: 'Название', sortable: true, minWidth: 240 },
  { key: 'value', label: 'Значение', sortable: true, align: 'end' },
];
const rows = ref<Item[]>([]);
const sortKey = ref('createdAt');
const sortDirection = ref<'asc' | 'desc'>('desc');

function changeSort(key: string) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
  void loadRows();
}
</script>

<template>
  <KDataTable
    :columns="columns"
    :rows="rows"
    :sort-key="sortKey"
    :sort-direction="sortDirection"
    caption="Список элементов"
    @sort="changeSort"
  >
    <template #cell-value="{ value }">
      {{ Number(value).toLocaleString('ru-RU') }}
    </template>
  </KDataTable>
</template>
```

## Описание колонки

| Поле | Тип | Назначение |
| --- | --- | --- |
| `key` | `string` | Ключ колонки и имя scoped slot |
| `label` | `string` | Заголовок и mobile label |
| `kind` | `'text' \| 'actions'` | Тип отображения ячейки; `actions` показывает меню действий |
| `value` | `(row) => unknown` | Вычисление значения вместо `row[key]` |
| `actions` | `(row) => KDataTableAction[]` | Действия для колонки `kind: 'actions'` |
| `sortable` | `boolean` | Показывает кнопку сортировки |
| `align` | `'start' \| 'center' \| 'end'` | Выравнивание |
| `width` | `number` | Начальная ширина в px |
| `minWidth`, `maxWidth` | `number` | Границы resize в px |
| `headerClass`, `cellClass` | `string` | Дополнительные классы |
| `filter` | `KTableFilterDefinition` | Декларативный фильтр заголовка |

## Props

| Prop | Тип | По умолчанию |
| --- | --- | --- |
| `columns` | `KDataTableColumn[]` | обязательный |
| `rows` | `object[]` | обязательный |
| `rowKey` | `string \| ((row, index) => string \| number)` | `'id'` |
| `caption` | `string` | `''` |
| `emptyText` | `string` | `'Нет данных'` |
| `loading` | `boolean` | `false` |
| `loadingText` | `string` | `'Загрузка…'` |
| `mode` | `'table' \| 'cards'` | `'table'` |
| `sortKey` | `string` | `''` |
| `sortDirection` | `'asc' \| 'desc'` | `'asc'` |
| `selectable` | `boolean` | `false` |
| `selectedKeys` | `(string \| number)[]` | `[]` |
| `selectAllLabel` | `string` | русская подпись по умолчанию |
| `selectRowLabel` | `(row, index) => string` | подпись по номеру строки |
| `rowClickable` | `boolean` | `false` |
| `resizable` | `boolean` | `false` |
| `columnWidths` | `Record<string, number>` | `{}` |
| `filters` | `KTableFilterValues` | `{}` |

## Events

| Event | Payload |
| --- | --- |
| `sort` | `key: string` |
| `update:selectedKeys` | `KDataTableKey[]` |
| `update:columnWidths` | `Record<string, number>` |
| `action` | `{ row, action, column }` |
| `rowClick` | исходный объект строки |
| `update:filters` | полная карта фильтров |

`rowClick` отправляется только при `rowClickable=true`. Checkbox выбора строки
не инициирует клик строки.

## Slots

Для каждой колонки доступен `cell-<key>` со scope
`{ row, value, column, index }`. Если slot отсутствует, выводится строковое
представление вычисленного значения.

## Колонка действий

Для стандартного меню в ячейке задайте `kind: 'actions'` и функцию `actions`:

```ts
const columns: KDataTableColumn<User>[] = [
  { key: 'name', label: 'Пользователь' },
  {
    key: 'actions',
    label: 'Действия',
    kind: 'actions',
    actions: (row) => [
      { id: 'edit', label: 'Редактировать' },
      { id: 'delete', label: 'Удалить', tone: 'danger' },
    ],
  },
];
```

Выбранное действие библиотека не выполняет, а сообщает приложению:

```vue
<KDataTable :columns="columns" :rows="users" @action="handleAction" />
```

`handleAction` получает `{ row, action, column }`; API-запросы, навигация,
подтверждения и права доступа остаются ответственностью приложения. Если
нужна нестандартная разметка, слот `cell-actions` имеет приоритет над
стандартным меню.

## Cards mode и resize

В `mode="cards"` сохраняется та же семантическая таблица, но CSS отображает
строки как карточки и использует `data-label` для подписей. Resize включается
явно; ширину можно менять pointer-событиями или стрелками с шагом 10 px.
