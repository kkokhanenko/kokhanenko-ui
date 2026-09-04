---
title: KNotice и KTooltip
description: Компоненты обратной связи и контекстных подсказок.
tags: [component, notice, tooltip]
---

# KNotice и KTooltip

## KNotice

```javascript
import { KNotice } from '@kokhanenko/ui/notice';
```

```xml
<KNotice
  v-if="warningVisible"
  tone="warning"
  title="Нужна проверка"
  dismissible
  @dismiss="warningVisible = false"
>
  Некоторые значения требуют дополнительной проверки.
</KNotice>
```

| Prop | Тип | По умолчанию |
| --- | --- | --- |
| `tone` | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` |
| `title` | `string` | `''` |
| `dismissible` | `boolean` | `false` |

Default slot содержит текст уведомления. Событие `dismiss` сообщает о нажатии
крестика, но приложение само скрывает компонент. Для `danger` используется
`role="alert"`, для остальных тонов — `role="status"`.

## KTooltip

```javascript
import { KTooltip } from '@kokhanenko/ui/tooltip';
```

```xml
<KTooltip
  text="В результат входят только подтверждённые элементы"
  label="Как формируется результат"
  placement="bottom"
>
  <template #trigger>i</template>
</KTooltip>
```

| Prop | Тип | По умолчанию |
| --- | --- | --- |
| `text` | `string` | обязательный |
| `label` | `string` | `'Подсказка'` |
| `placement` | `'top' \| 'bottom'` | `'top'` |

Tooltip открывается при hover, focus и click, закрывается при mouseleave, blur
и `Escape`. Slot `trigger` заменяет стандартный символ `?`.

Используйте tooltip для дополнительного пояснения, но не прячьте в нём
обязательные инструкции или критическую ошибку.
