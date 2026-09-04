---
title: KTableToolbar
description: Общий поиск и композиция управляющих элементов таблицы.
tags: [component, toolbar, table]
---

# KTableToolbar

`KTableToolbar` объединяет search input, actions slot, переключатель вида,
выбор колонок и controls карточного режима.

```javascript
import { KTableToolbar } from '@kokhanenko/ui/table-toolbar';
```

## Пример

```xml
<KTableToolbar
  v-model="query"
  v-model:view-mode="viewMode"
  v-model:visible-columns="visibleColumns"
  v-model:column-order="columnOrder"
  v-model:card-sort-key="cardSortKey"
  placeholder="Найти элемент"
  :show-mode-toggle="true"
  :column-options="columnOptions"
  :reorderable-columns="true"
  :card-sort-options="sortOptions"
  :filter-columns="columns"
  :filters="filters"
  @toggle-card-sort-direction="toggleDirection"
  @update:filters="applyFilters"
>
  <template #actions>
    <KButton variant="secondary">Экспорт</KButton>
  </template>
</KTableToolbar>
```

## Props

| Prop | Тип | По умолчанию |
| --- | --- | --- |
| `modelValue` | `string` | `''` |
| `placeholder` | `string` | `'Поиск'` |
| `clearLabel` | `string` | `'Очистить поиск'` |
| `viewMode` | `'table' \| 'cards'` | `'table'` |
| `showModeToggle` | `boolean` | `false` |
| `visibleColumns` | `string[]` | `[]` |
| `columnOrder` | `string[]` | `[]` |
| `columnOptions` | `KColumnPickerOption[]` | `[]` |
| `columnLabel` | `string` | `'Столбцы'` |
| `reorderableColumns` | `boolean` | `false` |
| `cardSortKey` | `string` | `''` |
| `cardSortDirection` | `'asc' \| 'desc'` | `'asc'` |
| `cardSortOptions` | `KSelectOption[]` | `[]` |
| `cardSortLabel` | `string` | `'Сортировка'` |
| `filterColumns` | массив колонок с `filter` | `[]` |
| `filters` | `KTableFilterValues` | `{}` |

## Events

Компонент поддерживает `update:modelValue`, `update:viewMode`,
`update:visibleColumns`, `update:columnOrder`, `update:cardSortKey`,
`toggleCardSortDirection` и `update:filters`.

## Slots

- `actions` — действия справа от поиска;
- `filters` — дополнительные фильтры под основной строкой;
- `card-filters` — дополнительные controls только для карточного режима.

Поле поиска имеет `type="search"`, но библиотека также показывает собственную
единственную кнопку очистки, чтобы поведение было одинаковым в браузерах. После
очистки focus возвращается в поле.

Компонент не применяет debounce и не выполняет запрос. Это делает проектный
query adapter.
