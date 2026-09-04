---
title: KModal и KActionMenu
description: Модальное окно и контекстное меню действий.
tags: [component, modal, menu]
---

# KModal и KActionMenu

## KModal

```javascript
import { KModal } from '@kokhanenko/ui/modal';
```

```xml
<KModal
  :open="dialogOpen"
  title="Удалить элемент?"
  description="Действие нельзя отменить."
  :close-on-backdrop="false"
  @close="dialogOpen = false"
>
  <p>Выбранный элемент будет удалён.</p>
  <template #footer>
    <KButton variant="secondary" @click="dialogOpen = false">Отмена</KButton>
    <KButton variant="danger" @click="remove">Удалить</KButton>
  </template>
</KModal>
```

| Prop | Тип | По умолчанию |
| --- | --- | --- |
| `open` | `boolean` | обязательный |
| `title` | `string` | обязательный |
| `description` | `string` | `''` |
| `closeLabel` | `string` | `'Закрыть'` |
| `closeOnBackdrop` | `boolean` | `true` |

Default slot — содержимое, `footer` — действия. Event `close` отправляется по
крестику, `Escape` и разрешённому клику по backdrop. Компонент не меняет `open`
самостоятельно.

Modal переносится в `body`, ограничивает Tab внутри панели, устанавливает
начальный focus и возвращает focus на предыдущий элемент после закрытия.

## KActionMenu

```javascript
import { KActionMenu, type KActionMenuItem } from '@kokhanenko/ui/action-menu';

const actions: KActionMenuItem[] = [
  { id: 'open', label: 'Открыть', icon: '↗' },
  { id: 'retry', label: 'Повторить', disabled: true },
  { id: 'delete', label: 'Удалить', tone: 'danger' },
];
```

```xml
<KActionMenu :items="actions" label="Действия элемента" @select="runAction" />
```

| Prop | Тип | По умолчанию |
| --- | --- | --- |
| `items` | `KActionMenuItem[]` | обязательный |
| `label` | `string` | `'Действия'` |
| `disabled` | `boolean` | `false` |
| `placement` | `'bottom-start' \| 'bottom-end'` | `'bottom-end'` |

Item содержит `id`, `label`, опциональные `disabled`, `hidden`, `tone` и
`icon`. Event `select` возвращает весь item. Slot `trigger` получает `{ open }`,
slot `item` — `{ item }`.

Скрытые пункты не попадают в DOM. Если видимых пунктов нет, trigger отключён.
В панели работают `ArrowUp`, `ArrowDown` и `Escape`; после выбора focus
возвращается на trigger.
