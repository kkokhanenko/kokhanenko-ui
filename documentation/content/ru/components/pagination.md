---
title: KPagination
description: Controlled-пагинация для серверных списков.
tags: [component, pagination]
---

# KPagination

```javascript
import { KPagination } from '@kokhanenko/ui/pagination';
```

```xml
<KPagination
  v-model:page="query.page"
  v-model:page-size="query.pageSize"
  :total-pages="response.totalPages"
  :total-rows="response.totalRows"
  :page-size-options="[10, 20, 50, 100]"
  @update:page="loadRows"
  @update:page-size="changePageSize"
/>
```

## Props

| Prop | Тип | По умолчанию |
| --- | --- | --- |
| `page` | `number` | обязательный |
| `totalPages` | `number` | обязательный |
| `totalRows` | `number` | обязательный |
| `pageSize` | `number` | обязательный |
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 50]` |
| `showPageSize` | `boolean` | `true` |
| `pageSizeLabel` | `string` | `'Строк на странице'` |
| `summary` | `string` | автоматически |

События: `update:page` и `update:pageSize`. Slot `summary` добавляет информацию
рядом с основной строкой состояния.

Компонент не отображается при `totalRows=0`. Номер страницы нормализуется в
диапазон `1…totalPages`. При большом количестве страниц показываются первая,
последняя, соседние страницы и многоточия.

При изменении `pageSize` приложение обычно устанавливает `page=1`, затем
отправляет новый запрос.
