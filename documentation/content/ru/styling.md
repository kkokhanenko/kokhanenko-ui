---
title: Темы и стили
description: Foundation, цветовые схемы и брендовые токены Kokhanenko UI.
tags: [css, themes, tokens]
---

# Темы и стили

## Режимы light, dark и system

Foundation содержит нейтральную палитру и CSS-only контракт темы. Установите
режим на корневом элементе:

```html
<html data-kui-scheme="system">
```

Допустимы значения `light`, `dark` и `system`. Библиотека использует нативный
`color-scheme` и `light-dark()`, поэтому не содержит JavaScript-переключатель.
Выбор пользователя и его сохранение реализует приложение.

```javascript
document.documentElement.dataset.kuiScheme = 'dark';
```

## Брендовая тема проекта

Подключайте файл проекта после foundation:

```javascript
import '@kokhanenko/ui/foundation';
import './styles/theme.css';
```

```css
[data-brand="product"] {
  --kui-color-primary: light-dark(oklch(56% 0.23 25), oklch(72% 0.18 25));
  --kui-color-primary-hover: light-dark(oklch(50% 0.23 25), oklch(78% 0.15 25));
  --kui-color-primary-soft: light-dark(oklch(96% 0.04 25), oklch(28% 0.07 25));
  --kui-shell-sidebar-bg: light-dark(oklch(24% 0.025 255), oklch(13% 0.018 255));
}
```

Названия, логотипы и палитры конкретного продукта остаются в его собственном
файле темы и не входят в библиотеку.

## Группы токенов

| Группа | Примеры | Назначение |
| --- | --- | --- |
| Цвета | `--kui-color-primary`, `--kui-color-danger` | Текст, фон и состояния |
| Поверхности | `--kui-color-canvas`, `--kui-color-surface` | Фон приложения и карточек |
| Границы | `--kui-color-border`, `--kui-color-border-strong` | Контуры контролов |
| Геометрия | `--kui-radius-*`, `--kui-control-height-*` | Радиусы и высоты |
| Интервалы | `--kui-space-1` … `--kui-space-8` | Единая шкала отступов |
| Типографика | `--kui-font-family`, `--kui-font-size-*` | Шрифт и размер текста |
| Тени | `--kui-shadow-sm`, `--kui-shadow-md`, `--kui-shadow-lg` | Поднятые поверхности |
| Shell | `--kui-shell-*` | Sidebar и topbar |

## Область base styles

Класс `.kui-scope` включает типографику и `box-sizing` только внутри выбранной
области. `KAppShell` добавляет его автоматически. Для отдельных компонентов
оберните корень страницы самостоятельно.

## Ограничения браузеров

Проект сознательно не поддерживает старые браузеры. Если целевой браузер не
поддерживает OKLCH, `light-dark()` или `color-mix()`, приложение должно либо
повысить системные требования, либо предоставить собственный fallback слой.
