---
title: KTableFilterControl
description: Декларативные фильтры таблицы: multiselect, даты и числа.
tags: [component, filters, table]
---

# KTableFilterControl

Компонент создаётся автоматически внутри `KDataTable`, если в колонке задано
поле `filter`. Его также можно использовать отдельно.

```javascript
import {
  KTableFilterControl,
  isKTableFilterActive,
  type KTableFilterDefinition,
  type KTableFilterValues,
} from '@kokhanenko/ui/table-filters';
```

## Типы фильтров

```javascript
const columns = [
  {
    key: 'date',
    label: 'Дата',
    filter: {
      type: 'date-range',
      label: 'Период',
      min: '2024-01-01',
      max: '2030-12-31',
    },
  },
  {
    key: 'category',
    label: 'Категория',
    filter: {
      type: 'multi-select',
      options: [
        { value: 'primary', label: 'Основная' },
        { value: 'secondary', label: 'Дополнительная' },
      ],
      showSelectAll: true,
      allSelectionMode: 'implicit-empty',
    },
  },
  {
    key: 'value',
    label: 'Значение',
    filter: { type: 'number-range', step: 1, min: 0 },
  },
] satisfies KDataTableColumn[];
```

| `type` | Значение | Дополнительные поля |
| --- | --- | --- |
| `multi-select` | `(string \| number)[]` | `options`, `searchable`, `showSelectAll`, `selectAllLabel`, `allSelectionMode` |
| `date-range` | `{ from: string; to: string }` | `min`, `max` в формате даты |
| `number-range` | `{ from: number \| null; to: number \| null }` | `min`, `max`, `step` |

Общие поля definition: `label` и `placeholder`.

## Состояние и событие

```xml
<KDataTable
  :columns="columns"
  :rows="rows"
  :filters="filters"
  @update:filters="applyFilters"
/>
```

`update:filters` возвращает полную карту с сохранением значений других колонок.
Приложение обновляет URL/query state, сбрасывает страницу на первую и делает
API-запрос. Компонент не перезагружает страницу.

Multiselect остаётся открытым после каждого выбора и показывает число выбранных
значений. У выбранных строк нет отдельной цветной «обводки значения»: состояние
передаётся checkbox и семантическим оформлением строки.

## Сброс и активность

`isKTableFilterActive(value)` возвращает `true`, когда массив непустой либо
заполнена хотя бы одна граница диапазона. Сброс даёт:

- `[]` для multiselect;
- `{ from: '', to: '' }` для периода;
- `{ from: null, to: null }` для числового диапазона.

Для `implicit-empty` пустой multiselect трактуется приложением как «без
ограничения», а не как «не найдено ни одного значения».
