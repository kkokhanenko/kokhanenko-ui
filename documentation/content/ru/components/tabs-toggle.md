---
title: KTabs и KToggle
description: Вкладки и булев переключатель.
tags: [component, tabs, toggle]
---

# KTabs и KToggle

## KTabs

```javascript
import { KTabs, type KTabOption } from '@kokhanenko/ui/tabs';
```

```xml
<KTabs
  v-model="section"
  :options="[
    { value: 'overview', label: 'Обзор' },
    { value: 'items', label: 'Элементы' },
    { value: 'settings', label: 'Настройки' },
  ]"
  variant="tabs"
/>
```

### Props

| Prop | Тип | По умолчанию |
| --- | --- | --- |
| `modelValue` | `string` | обязательный |
| `options` | `KTabOption[]` | обязательный |
| `label` | `string` | `'Разделы'` |
| `variant` | `'tabs' \| 'segmented'` | `'tabs'` |

`KTabOption` содержит `value`, `label` и опциональный `disabled`. Событие
`update:modelValue` возвращает `value`. Slot `tab` получает `{ option, active }`.

Вариант `tabs` показывает классическую линию вкладок без «кружков»;
`segmented` объединяет элементы в единый переключатель. Горизонтальная
прокрутка появляется только при фактическом переполнении.

Компонент реализует роли `tablist`/`tab`, `aria-selected` и управление
`ArrowLeft`, `ArrowRight`, `Home`, `End`.

## KToggle

```javascript
import { KToggle } from '@kokhanenko/ui/toggle';
```

```xml
<KToggle
  v-model="emailNotifications"
  label="Email-уведомления"
  description="Отправлять письмо после завершения операции"
/>
```

| Prop | Тип | По умолчанию |
| --- | --- | --- |
| `modelValue` | `boolean` | обязательный |
| `label` | `string` | `''` |
| `description` | `string` | `''` |
| `disabled` | `boolean` | `false` |

Событие `update:modelValue` возвращает `boolean`. В основе находится нативный
`checkbox`, поэтому переключатель работает с клавиатуры и формами доступности.
