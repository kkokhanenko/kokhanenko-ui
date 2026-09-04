---
title: CSS-токены
description: Семантические переменные foundation Kokhanenko UI.
tags: [css, tokens, theme]
---

# CSS-токены

Все токены определены на `:root` внутри CSS layer `kui.foundation`. Переопределяйте
их на `:root`, `[data-brand]` или контейнере продукта после импорта foundation.

## Основные цвета

| Токен | Назначение |
| --- | --- |
| `--kui-color-canvas` | Фон приложения |
| `--kui-color-surface` | Основная поверхность |
| `--kui-color-surface-subtle` | Вторичная поверхность |
| `--kui-color-text` | Основной текст |
| `--kui-color-text-muted` | Вторичный текст |
| `--kui-color-primary` | Основной акцент |
| `--kui-color-primary-hover` | Hover акцента |
| `--kui-color-primary-soft` | Мягкий акцентный фон |
| `--kui-color-on-primary` | Текст на акцентном фоне |
| `--kui-color-border` | Обычная граница |
| `--kui-color-border-strong` | Усиленная граница |

## Семантические состояния

| Токен | Назначение |
| --- | --- |
| `--kui-color-neutral`, `--kui-color-neutral-soft` | Нейтральное состояние |
| `--kui-color-success`, `--kui-color-success-soft` | Успех |
| `--kui-color-warning`, `--kui-color-warning-soft` | Предупреждение |
| `--kui-color-danger`, `--kui-color-danger-soft` | Ошибка или опасность |
| `--kui-color-on-danger` | Текст на danger-фоне |

## Служебные цвета и эффекты

- `--kui-color-control-thumb`;
- `--kui-color-code`, `--kui-color-code-bg`;
- `--kui-color-tooltip`, `--kui-color-tooltip-bg`;
- `--kui-color-overlay`, `--kui-color-hover-overlay`;
- `--kui-focus-ring`;
- `--kui-shadow-sm`, `--kui-shadow-md`, `--kui-shadow-lg`;
- `--kui-shadow-control-thumb`.

## Геометрия и типографика

```css
--kui-radius-sm
--kui-radius-md
--kui-radius-lg

--kui-font-family
--kui-font-size-sm
--kui-font-size-md
--kui-line-height

--kui-control-height-sm
--kui-control-height-md
--kui-control-height-lg

--kui-space-1
--kui-space-2
--kui-space-3
--kui-space-4
--kui-space-5
--kui-space-6
--kui-space-8

--kui-transition-fast
```

## AppShell

```css
--kui-shell-sidebar-bg
--kui-shell-sidebar-text
--kui-shell-sidebar-item-text
--kui-shell-sidebar-muted
--kui-shell-sidebar-border
--kui-shell-sidebar-border-strong
--kui-shell-sidebar-surface
--kui-shell-sidebar-surface-hover
--kui-shell-sidebar-focus-ring
--kui-shell-sidebar-shadow
--kui-shell-topbar-bg
--kui-shell-topbar-border
--kui-shell-topbar-shadow
```

## Пример локального бренда

```css
:root[data-brand="product"] {
  --kui-font-family: Inter, system-ui, sans-serif;
  --kui-radius-md: 10px;
  --kui-color-primary: light-dark(oklch(52% 0.2 270), oklch(76% 0.14 270));
}
```

Используйте семантические токены вместо переопределения внутренних классов
`.kui-*`. Внутренняя DOM-структура и private selectors не являются стабильным API.
