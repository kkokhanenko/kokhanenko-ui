---
title: Серверные таблицы
description: Интеграция поиска, фильтров, сортировки и пагинации с API.
tags: [table, api, server-filtering]
---

# Серверные таблицы

Правильная граница: библиотека редактирует query state, проект отправляет его в
API, backend фильтрует БД и возвращает страницу данных.

## Состояние запроса

```javascript
type TableQuery = {
  search: string;
  page: number;
  pageSize: number;
  sort: string;
  direction: 'asc' | 'desc';
  filters: KTableFilterValues;
};

const query = reactive<TableQuery>({
  search: '',
  page: 1,
  pageSize: 20,
  sort: 'date',
  direction: 'desc',
  filters: {
    date: { from: '', to: '' },
    category: [],
    status: [],
    value: { from: null, to: null },
  },
});
```

## Подключение компонентов

```xml
<KTableToolbar
  v-model="query.search"
  v-model:view-mode="ui.viewMode"
  v-model:visible-columns="ui.visibleColumns"
  v-model:column-order="ui.columnOrder"
  :show-mode-toggle="true"
  :column-options="columnOptions"
/>

<KDataTable
  :columns="visibleOrderedColumns"
  :rows="response.rows"
  :loading="loading"
  :sort-key="query.sort"
  :sort-direction="query.direction"
  :filters="query.filters"
  :mode="ui.viewMode"
  :column-widths="ui.columnWidths"
  @sort="changeSort"
  @update:filters="changeFilters"
  @update:column-widths="ui.columnWidths = $event"
/>

<KPagination
  v-model:page="query.page"
  v-model:page-size="query.pageSize"
  :total-pages="response.totalPages"
  :total-rows="response.totalRows"
/>
```

## Нормализация запроса

```javascript
function toApiParams(state: TableQuery) {
  const date = state.filters.date as KTableDateRangeValue;
  const value = state.filters.value as KTableNumberRangeValue;

  return {
    q: state.search.trim() || undefined,
    page: state.page,
    per_page: state.pageSize,
    sort: state.sort,
    direction: state.direction,
    date_from: date.from || undefined,
    date_to: date.to || undefined,
    value_from: value.from ?? undefined,
    value_to: value.to ?? undefined,
    category: state.filters.category,
    status: state.filters.status,
  };
}
```

Отправляйте стабильные коды (`ready`, `primary`), а подписи оставляйте в options.
Пустой массив в `implicit-empty` не добавляйте в запрос: он означает «все».

## Загрузка без перезагрузки страницы

```javascript
let requestId = 0;

async function loadRows() {
  const current = ++requestId;
  loading.value = true;
  try {
    const result = await tableApi.list(toApiParams(query));
    if (current === requestId) response.value = result;
  } finally {
    if (current === requestId) loading.value = false;
  }
}

watch(
  () => [query.page, query.pageSize, query.sort, query.direction, query.filters],
  loadRows,
  { deep: true },
);
```

Для текста поиска примените debounce на стороне проекта. При изменении поиска,
фильтра или `pageSize` сначала установите `page=1`. Новый запрос не должен
перезагружать документ или закрывать открытый multiselect.

## Ответ API

```json
{
  "rows": [],
  "page": 1,
  "pageSize": 20,
  "totalRows": 0,
  "totalPages": 1,
  "filterOptions": {
    "categories": [{"value":"primary","label":"Основная"}],
    "statuses": [{"value":"ready","label":"Готово"}]
  }
}
```

Backend должен whitelist-ить sort keys, проверять типы фильтров и использовать
параметризованные SQL-запросы.
