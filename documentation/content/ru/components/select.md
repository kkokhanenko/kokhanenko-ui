---
title: KSelect
description: Одиночный и множественный select с поиском и Teleport-панелью.
tags: [component, select, multiselect]
---

# KSelect

`KSelect` поддерживает одиночный и множественный выбор, disabled options,
поиск, «Выбрать все», клавиатуру и позиционирование панели через `Teleport`.

```javascript
import { KSelect, type KSelectOption, type KSelectValue } from '@kokhanenko/ui/select';
```

## Одиночный выбор

```xml
<script setup lang="ts">
import { ref } from 'vue';
import { KSelect, type KSelectOption } from '@kokhanenko/ui/select';

const priority = ref<string | number | null>('normal');
const priorities: KSelectOption[] = [
  { value: 'low', label: 'Низкий' },
  { value: 'normal', label: 'Обычный' },
  { value: 'high', label: 'Высокий', disabled: true },
];
</script>

<template>
  <KSelect v-model="priority" :options="priorities" label="Приоритет" />
</template>
```

## Множественный выбор

```xml
<KSelect
  v-model="statuses"
  :options="statusOptions"
  label="Статусы"
  multiple
  show-select-all
  all-selection-mode="implicit-empty"
  :close-on-select="false"
/>
```

В режиме `implicit-empty` пустой массив означает «выбраны все доступные
значения». Это удобно для серверных фильтров: отсутствие параметра не
ограничивает выборку. После снятия одного пункта компонент отправит явный
список оставшихся значений.

## Props

| Prop | Тип | По умолчанию |
| --- | --- | --- |
| `modelValue` | `string \| number \| Array<string \| number> \| null` | обязательный |
| `options` | `KSelectOption[]` | обязательный |
| `label` | `string` | `'Выбор'` |
| `placeholder` | `string` | `'Выберите'` |
| `multiple` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `searchable` | `boolean \| 'auto'` | `'auto'` |
| `searchThreshold` | `number` | `5` |
| `searchPlaceholder` | `string` | `'Поиск'` |
| `noResultsText` | `string` | `'Ничего не найдено'` |
| `closeOnSelect` | `boolean` | `true` |
| `showSelectAll` | `boolean` | `false` |
| `selectAllLabel` | `string` | `'Все'` |
| `allSelectionMode` | `'explicit' \| 'implicit-empty'` | `'explicit'` |
| `placement` | `'bottom-start' \| 'bottom-end'` | `'bottom-start'` |

`KSelectOption` содержит `value`, `label`, опциональные `hint` и `disabled`.

## Events и slots

| Имя | Payload | Описание |
| --- | --- | --- |
| `update:modelValue` | одиночное значение, массив или `null` | Новое состояние выбора |

| Slot | Scope | Назначение |
| --- | --- | --- |
| `value` | `{ label, selectedCount }` | Собственное отображение значения в trigger |
| `option` | `{ option }` | Разметка обычной опции |

## Клавиатура и панель

`ArrowUp`, `ArrowDown`, `Enter`, `Space` и `Escape` поддерживаются. Панель
переносится в `body`, остаётся привязанной к trigger при scroll/resize и при
нехватке места может открыться вверх. Стили темы должны быть доступны на
уровне документа, а не только локального контейнера компонента.
