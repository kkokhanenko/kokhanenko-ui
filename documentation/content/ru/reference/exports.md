---
title: Экспорты и типы
description: Публичные entry points и TypeScript-контракты пакета.
tags: [api, typescript, imports]
---

# Экспорты и типы

## Entry points

| Импорт | Публичный API |
| --- | --- |
| `@kokhanenko/ui` | Все UI-компоненты и общие типы, кроме preferences |
| `@kokhanenko/ui/foundation` | CSS tokens и base styles через JS entry |
| `@kokhanenko/ui/foundation.css` | Прямой CSS entry foundation |
| `@kokhanenko/ui/button` | `KButton` |
| `@kokhanenko/ui/select` | `KSelect`, `KSelectOption`, `KSelectValue` |
| `@kokhanenko/ui/tabs` | `KTabs`, `KTabOption` |
| `@kokhanenko/ui/toggle` | `KToggle` |
| `@kokhanenko/ui/data-table` | `KDataTable`, table types, `useTableSelection` |
| `@kokhanenko/ui/column-picker` | `KColumnPicker`, `KColumnPickerOption` |
| `@kokhanenko/ui/pagination` | `KPagination` |
| `@kokhanenko/ui/table-toolbar` | `KTableToolbar` |
| `@kokhanenko/ui/table-filters` | `KTableFilterControl`, filter types, helper |
| `@kokhanenko/ui/table-view-toggle` | `KTableViewToggle` |
| `@kokhanenko/ui/notice` | `KNotice` |
| `@kokhanenko/ui/tooltip` | `KTooltip` |
| `@kokhanenko/ui/action-menu` | `KActionMenu`, `KActionMenuItem` |
| `@kokhanenko/ui/modal` | `KModal` |
| `@kokhanenko/ui/app-shell` | `KAppShell`, shell types |
| `@kokhanenko/ui/preferences` | Controller и типы пользовательских настроек |

## Общие типы

```javascript
type KuiSize = 'sm' | 'md' | 'lg';

type KuiTone =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger';
```

## Табличные типы

```javascript
type KDataTableKey = string | number;
type KDataTableMode = 'table' | 'cards';
type KDataTableSortDirection = 'asc' | 'desc';
type KDataTableAlign = 'start' | 'center' | 'end';
```

## Фильтры

```javascript
type KTableFilterDefinition =
  | KTableMultiSelectFilter
  | KTableDateRangeFilter
  | KTableNumberRangeFilter;

type KTableFilterValue =
  | KSelectValue[]
  | { from: string; to: string }
  | { from: number | null; to: number | null }
  | null;

type KTableFilterValues = Record<string, KTableFilterValue>;
```

## Preferences values

Настройки должны быть JSON-совместимыми:

```javascript
type KUiPreferencePrimitive = string | number | boolean | null;

type KUiPreferenceValue =
  | KUiPreferencePrimitive
  | KUiPreferenceValue[]
  | { [key: string]: KUiPreferenceValue };
```

Не импортируйте файлы из `src/` или `dist/` по внутреннему пути. Такие импорты
не входят в semver-контракт и могут измениться без отдельной миграции.
