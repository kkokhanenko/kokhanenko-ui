# Kokhanenko UI

Компактная модульная UI-библиотека для Vue 3. Репозиторий называется
`kokhanenko-ui`, npm-пакет — `@kokhanenko/ui`.

Библиотека объединяет переиспользуемые UI-паттерны и не содержит API,
маршруты, бизнес-правила или другую предметную логику приложений.

## Принципы

- Каждый компонент — отдельная точка импорта и отдельный CSS chunk.
- Прямой импорт компонента не подключает остальные компоненты.
- Общий foundation подключается явно и содержит только токены и opt-in base styles.
- Нейтральная тема по умолчанию входит в foundation; брендовые темы принадлежат приложениям.
- `KAppShell` получает бренд, меню, пользователя и контент через props, события и slots.
- Vue — внешняя peer dependency и не дублируется в приложениях.

## Установка

Для локальной разработки пакет можно подключить из соседней рабочей копии:

```bash
npm install ../kokhanenko-ui
```

Для командной работы используйте фиксированные Git tags или package registry.

## Минимальный импорт

```ts
import '@kokhanenko/ui/foundation';
import { KButton } from '@kokhanenko/ui/button';
```

Для сборщиков, которые требуют прямой CSS import, доступна эквивалентная
точка `@kokhanenko/ui/foundation.css`.

```vue
<KButton :loading="saving" @click="save">Сохранить</KButton>
```

Такой импорт не включает `KSelect`, `KModal`, `KAppShell` или их стили.

## Полный импорт

Для небольшого приложения допустим общий entry point:

```ts
import * as Kui from '@kokhanenko/ui';
```

Для контроля размера production bundle предпочтительнее subpath imports.

## Оформление приложений

Foundation содержит нейтральные светлые и тёмные значения по умолчанию и контракт
семантических переменных `--kui-*`. Приложение может подключить после него
собственный файл оформления:

```ts
import '@kokhanenko/ui/foundation';
import './styles/theme.css';
```

```css
[data-theme="product"] {
  --kui-color-primary: light-dark(oklch(55% 0.2 255), oklch(75% 0.14 255));
  --kui-shell-sidebar-bg: light-dark(oklch(28% 0.04 255), oklch(14% 0.02 255));
}
```

Библиотека не хранит палитры конкретных продуктов, не выбирает тему и не
сохраняет пользовательский выбор. Цветовая схема задаётся на
любом родительском контейнере интерфейса:

```html
<html data-kui-scheme="system">
```

Допустимы `light`, `dark` и `system`. Библиотека использует нативные
`color-scheme`, `light-dark()`, OKLCH и `color-mix()`; отдельные палитры в
media queries и JavaScript runtime не нужны. Видимый переключатель и хранение
предпочтения принадлежат приложению.

## Оболочка приложения

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { KAppShell } from '@kokhanenko/ui/app-shell';

const collapsed = ref(false);
const navigation = [
  { id: 'home', label: 'Главная', icon: '⌂' },
  {
    id: 'services',
    label: 'Сервисы',
    children: [{ id: 'accounting', label: 'Распознавание расходов' }],
  },
];
</script>

<template>
  <KAppShell
    v-model:sidebar-collapsed="collapsed"
    :brand="{ name: 'Продукт', subtitle: 'Рабочая область' }"
    :navigation="navigation"
    active-id="accounting"
    title="Распознавание расходов"
    @navigate="openSection"
  >
    <router-view />
    <template #footer>© Название продукта</template>
  </KAppShell>
</template>
```

Компонент не требует Vue Router или Pinia: адаптацию выполняет приложение.

## Слои расширения

Базовый пакет содержит только универсальные компоненты. Специфичные коллекции
не добавляются в `src/index.ts` и не попадают в приложения автоматически.

Рекомендуемая модель развития:

```text
@kokhanenko/ui             универсальное ядро
@kokhanenko/ui-domain      компоненты конкретной предметной области
@kokhanenko/ui-product     составные компоненты конкретного продукта
```

Такие пакеты могут жить в отдельных репозиториях либо позднее в одном
монорепозитории. Они зависят от `@kokhanenko/ui`, но ядро не зависит от них.

## Команды

```bash
npm test
npm run typecheck
npm run build
```

После сборки проверьте, что в `dist/` существуют отдельные JS/CSS assets для
компонентов, а `vue` отсутствует внутри их bundle.
