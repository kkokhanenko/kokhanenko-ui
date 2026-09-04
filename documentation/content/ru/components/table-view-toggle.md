---
title: KTableViewToggle
description: Переключение между табличным и карточным представлением.
tags: [component, table, cards]
---

# KTableViewToggle

```javascript
import { KTableViewToggle } from '@kokhanenko/ui/table-view-toggle';
```

```xml
<KTableViewToggle
  v-model="viewMode"
  table-label="Показать списком"
  cards-label="Показать карточками"
/>
```

| Prop | Тип | По умолчанию |
| --- | --- | --- |
| `modelValue` | `'table' \| 'cards'` | обязательный |
| `tableLabel` | `string` | `'Показать таблицей'` |
| `cardsLabel` | `string` | `'Показать карточками'` |

Событие `update:modelValue` возвращает новый режим. Обе кнопки имеют
`aria-pressed`, `aria-label` и `title`.

Компонент меняет только состояние. Его обычно связывают с `mode` у
`KDataTable` и сохраняют через preferences adapter.
