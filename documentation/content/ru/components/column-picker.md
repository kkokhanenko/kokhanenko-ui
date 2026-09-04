---
title: KColumnPicker
description: Выбор видимых колонок и изменение их порядка.
tags: [component, columns, drag-and-drop]
---

# KColumnPicker

```javascript
import { KColumnPicker, type KColumnPickerOption } from '@kokhanenko/ui/column-picker';
```

```xml
<KColumnPicker
  v-model="visibleColumns"
  v-model:column-order="columnOrder"
  :options="[
    { value: 'number', label: 'Номер', locked: true },
    { value: 'date', label: 'Дата' },
    { value: 'amount', label: 'Сумма' },
  ]"
  label="Столбцы отчёта"
  reorderable
/>
```

## Props

| Prop | Тип | По умолчанию |
| --- | --- | --- |
| `modelValue` | `string[]` | обязательный список видимых колонок |
| `columnOrder` | `string[]` | обязательный порядок |
| `options` | `KColumnPickerOption[]` | полный каталог колонок |
| `label` | `string` | `'Столбцы'` |
| `reorderable` | `boolean` | `false` |
| `searchable` | `boolean \| 'auto'` | `'auto'` |
| `searchThreshold` | `number` | `5` |

`locked=true` запрещает скрывать обязательную колонку. Компонент также не даёт
скрыть последнюю видимую колонку.

## Events

- `update:modelValue` — новый список видимых колонок в текущем порядке;
- `update:columnOrder` — нормализованный порядок всех известных колонок.

Неизвестные ключи исключаются, а новые options автоматически добавляются в
конец порядка.

## Изменение порядка

Drag handles скрыты по умолчанию. При `reorderable=true` пользователь нажимает
кнопку `↕` в footer и включает режим сортировки. После этого доступны:

- drag-and-drop мышью;
- pointer drag на touch-устройствах;
- `ArrowUp` и `ArrowDown` на сфокусированном handle.

При вводе поиска режим перестановки выключается, потому что менять порядок в
отфильтрованном подмножестве неоднозначно. Кнопка «Сбросить порядок» возвращает
порядок из `options`.

Панель закрывается по клику снаружи и `Escape`, после чего focus возвращается
на trigger.
