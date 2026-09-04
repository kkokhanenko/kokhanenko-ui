---
title: KAppShell
description: Универсальная оболочка приложения с sidebar, topbar и footer.
tags: [component, shell, navigation]
---

# KAppShell

`KAppShell` создаёт общую рамку продукта: боковое меню, мобильную навигацию,
шапку текущей страницы, рабочую область и footer. Компонент не зависит от Vue
Router и не знает URL приложения.

```javascript
import {
  KAppShell,
  type KAppBrand,
  type KAppNavigationItem,
  type KAppUser,
} from '@kokhanenko/ui/app-shell';
```

## Пример интеграции с Router

```xml
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { KAppShell, type KAppNavigationItem } from '@kokhanenko/ui/app-shell';

const router = useRouter();
const collapsed = ref(false);
const navigation: KAppNavigationItem[] = [
  { id: 'home', label: 'Главная', icon: '⌂', href: '/' },
  {
    id: 'catalog',
    label: 'Каталог',
    hint: 'Разделы и элементы',
    icon: '▤',
    badge: 1,
    children: [
      { id: 'items', label: 'Элементы', href: '/catalog/items' },
    ],
  },
];

function navigate(item: KAppNavigationItem) {
  if (item.href) void router.push(item.href);
}
</script>

<template>
  <KAppShell
    v-model:sidebar-collapsed="collapsed"
    :brand="{ name: 'Продукт', subtitle: 'Рабочая область' }"
    :navigation="navigation"
    active-id="items"
    eyebrow="Каталог"
    title="Элементы"
    :user="{ name: 'Пользователь', initials: 'П' }"
    @navigate="navigate"
  >
    <template #topbar-actions>
      <ThemeControl />
    </template>

    <RouterView />

    <template #footer>© Название продукта</template>
  </KAppShell>
</template>
```

## Props

| Prop | Тип | По умолчанию |
| --- | --- | --- |
| `brand` | `KAppBrand` | обязательный |
| `navigation` | `KAppNavigationItem[]` | обязательный |
| `activeId` | `string` | `''` |
| `title` | `string` | обязательный |
| `eyebrow` | `string` | `''` |
| `user` | `KAppUser` | `undefined` |
| `sidebarCollapsed` | `boolean` | `false` |

`KAppBrand`: `name`, опциональные `subtitle`, `logoUrl`, `logoAlt`.

`KAppUser`: `name`, опциональные `avatarUrl`, `initials`.

`KAppNavigationItem`: `id`, `label`, опциональные `hint`, `icon`, `href`,
`badge`, `disabled`, `children`.

## Events и slots

| Имя | Payload |
| --- | --- |
| `navigate` | выбранный `KAppNavigationItem` |
| `update:sidebarCollapsed` | `boolean` |

| Slot | Scope | Назначение |
| --- | --- | --- |
| default | — | Рабочая область |
| `nav-icon` | `{ item }` | Иконка меню |
| `topbar-actions` | — | Тема и действия страницы |
| `user` | `{ user }` | Свой блок пользователя |
| `sidebar-footer` | — | Нижняя часть sidebar |
| `footer` | — | Общий footer приложения |

## Поведение меню

- активный дочерний пункт автоматически раскрывает родительскую группу;
- в свёрнутом режиме иконка центрируется, а число подразделов остаётся видно;
- на мобильном sidebar открывается кнопкой в topbar и закрывается backdrop;
- клик по группе раскрывает её, клик по конечному пункту отправляет `navigate`;
- наличие `href` делает пункт ссылкой, но проект всё равно может обработать
  событие и использовать Router.

`KSidebarNav` и `KTopbar` — внутренние части shell и не экспортируются как
отдельные публичные компоненты.
