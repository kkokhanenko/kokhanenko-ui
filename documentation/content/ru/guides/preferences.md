---
title: Пользовательские настройки
description: Хранение, debounce, миграции и проектный adapter UI-предпочтений.
tags: [preferences, adapter, users]
---

# Пользовательские настройки

Библиотека предоставляет transport-независимый controller, но не знает
авторизацию, API или текущего пользователя. Проект реализует adapter и связывает
scope с серверным хранилищем.

```javascript
import {
  createKUiPreference,
  type KUiPreferencesAdapter,
} from '@kokhanenko/ui/preferences';
```

## Контракт adapter

```javascript
export interface KUiPreferencesAdapter {
  load(scope: string): Promise<KUiPreferenceRecord | null>;
  save(scope: string, record: KUiPreferenceRecord): Promise<void>;
  remove?(scope: string): Promise<void>;
}
```

`record` содержит `version`, JSON-совместимое `value` и опциональный
`updatedAt`. Пользовательский ID не передаётся библиотеке: backend определяет
его по текущей авторизованной сессии.

## HTTP adapter приложения

```javascript
const preferencesAdapter: KUiPreferencesAdapter = {
  async load(scope) {
    const response = await fetch(`/api/ui-preferences/${encodeURIComponent(scope)}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Не удалось загрузить настройки');
    return response.json();
  },

  async save(scope, record) {
    const response = await fetch(`/api/ui-preferences/${encodeURIComponent(scope)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!response.ok) throw new Error('Не удалось сохранить настройки');
  },

  async remove(scope) {
    const response = await fetch(`/api/ui-preferences/${encodeURIComponent(scope)}`, {
      method: 'DELETE',
    });
    if (!response.ok && response.status !== 404) throw new Error('Не удалось сбросить настройки');
  },
};
```

## Controller состояния таблицы

```javascript
type TableUiState = {
  viewMode: 'table' | 'cards';
  visibleColumns: string[];
  columnOrder: string[];
  columnWidths: Record<string, number>;
  pageSize: number;
};

const defaults: TableUiState = {
  viewMode: 'table',
  visibleColumns: ['createdAt', 'title', 'status'],
  columnOrder: ['createdAt', 'title', 'status'],
  columnWidths: {},
  pageSize: 20,
};

const preference = createKUiPreference<TableUiState>({
  adapter: preferencesAdapter,
  scope: 'catalog.items.table',
  version: 3,
  defaultValue: defaults,
  debounceMs: 400,
  normalize(value, fallback) {
    const input = value as Partial<TableUiState>;
    return {
      viewMode: input.viewMode === 'cards' ? 'cards' : 'table',
      visibleColumns: Array.isArray(input.visibleColumns)
        ? input.visibleColumns.map(String)
        : fallback.visibleColumns,
      columnOrder: Array.isArray(input.columnOrder)
        ? input.columnOrder.map(String)
        : fallback.columnOrder,
      columnWidths: input.columnWidths && typeof input.columnWidths === 'object'
        ? input.columnWidths
        : fallback.columnWidths,
      pageSize: typeof input.pageSize === 'number' ? input.pageSize : fallback.pageSize,
    };
  },
  migrate(value, fromVersion, fallback) {
    if (fromVersion === 2) return { ...fallback, ...(value as object), columnWidths: {} };
    return fallback;
  },
  onError(error) {
    console.error('UI preferences:', error);
  },
});
```

## Жизненный цикл

```javascript
onMounted(async () => {
  uiState.value = await preference.load();
});

watch(uiState, (value) => preference.scheduleSave(value), { deep: true });

onBeforeUnmount(() => {
  void preference.flush();
  preference.dispose();
});
```

- `load()` возвращает сохранённое значение, результат миграции или defaults;
- `scheduleSave()` клонирует состояние и сохраняет только последнее изменение
  после debounce;
- `flush()` немедленно завершает pending save и последовательную очередь;
- `reset()` удаляет запись через adapter и возвращает defaults;
- `dispose()` отменяет несохранённый таймер, поэтому перед ним вызывайте `flush()`.

Не храните в UI preferences токены, пароли, права или бизнес-данные.
