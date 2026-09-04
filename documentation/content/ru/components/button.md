---
title: KButton
description: Кнопка с вариантами, размерами и состоянием загрузки.
tags: [component, button]
---

# KButton

`KButton` сохраняет нативное событие `click`, поддерживает типы HTML-кнопки и
блокирует повторное действие во время загрузки.

```javascript
import { KButton } from '@kokhanenko/ui/button';
```

## Пример

```xml
<KButton variant="primary" size="md" :loading="saving" @click="save">
  Сохранить
</KButton>

<KButton variant="secondary">Отмена</KButton>
<KButton variant="danger">Удалить</KButton>
<KButton variant="ghost" size="sm">Подробнее</KButton>
```

## Props

| Prop | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Нативный тип кнопки |
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | `'primary'` | Визуальный вариант |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер контрола |
| `disabled` | `boolean` | `false` | Запрещает действие |
| `loading` | `boolean` | `false` | Показывает spinner, задаёт `aria-busy` и отключает кнопку |
| `block` | `boolean` | `false` | Растягивает кнопку по ширине контейнера |

## Slots и события

Default slot содержит подпись или произвольный контент. Событие `click`
нативное; отдельный библиотечный event не вводится.

## Особенности

- при `loading` и `disabled` элемент получает native `disabled`;
- компонент не запускает async-функцию и не управляет `loading` самостоятельно;
- для кнопок формы явно задавайте `type="submit"`.
