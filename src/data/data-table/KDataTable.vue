<script setup lang="ts" generic="TRow extends KDataTableRow">
import { computed, onBeforeUnmount, ref, watchEffect } from 'vue';
import { useTableSelection } from '../../composables/useTableSelection';
import { KTableFilterControl, type KTableFilterValue, type KTableFilterValues } from '../table-filters';
import type {
  KDataTableColumn,
  KDataTableKey,
  KDataTableMode,
  KDataTableRow,
  KDataTableSortDirection,
} from './types';

const props = withDefaults(defineProps<{
  columns: KDataTableColumn<TRow>[];
  rows: TRow[];
  rowKey?: string | ((row: TRow, index: number) => KDataTableKey);
  caption?: string;
  emptyText?: string;
  loading?: boolean;
  loadingText?: string;
  mode?: KDataTableMode;
  sortKey?: string;
  sortDirection?: KDataTableSortDirection;
  selectable?: boolean;
  selectedKeys?: KDataTableKey[];
  selectAllLabel?: string;
  selectRowLabel?: (row: TRow, index: number) => string;
  rowClickable?: boolean;
  resizable?: boolean;
  columnWidths?: Record<string, number>;
  filters?: KTableFilterValues;
}>(), {
  rowKey: 'id',
  caption: '',
  emptyText: 'Нет данных',
  loading: false,
  loadingText: 'Загрузка…',
  mode: 'table',
  sortKey: '',
  sortDirection: 'asc',
  selectable: false,
  selectedKeys: () => [],
  selectAllLabel: 'Выбрать все строки на странице',
  selectRowLabel: (_row, index) => `Выбрать строку ${index + 1}`,
  rowClickable: false,
  resizable: false,
  columnWidths: () => ({}),
  filters: () => ({}),
});

const emit = defineEmits<{
  sort: [key: string];
  'update:selectedKeys': [keys: KDataTableKey[]];
  'update:columnWidths': [widths: Record<string, number>];
  rowClick: [row: TRow];
  'update:filters': [filters: KTableFilterValues];
}>();
const updateFilter = (key: string, value: KTableFilterValue) => emit('update:filters', { ...props.filters, [key]: value });

const getRowKey = (row: TRow, index: number): KDataTableKey => {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index);
  const value = (row as Record<string, unknown>)[props.rowKey];
  return typeof value === 'string' || typeof value === 'number' ? value : index;
};
const getCellValue = (column: KDataTableColumn<TRow>, row: TRow) => column.value ? column.value(row) : (row as Record<string, unknown>)[column.key];
const sortLabel = (column: KDataTableColumn<TRow>) => {
  if (props.sortKey !== column.key) return `Сортировать по столбцу «${column.label}»`;
  return props.sortDirection === 'asc'
    ? `Сортировать по столбцу «${column.label}» по убыванию`
    : `Сортировать по столбцу «${column.label}» по возрастанию`;
};
const ariaSort = (column: KDataTableColumn<TRow>) => props.sortKey === column.key
  ? (props.sortDirection === 'asc' ? 'ascending' : 'descending')
  : undefined;

const selected = computed(() => props.selectedKeys);
const { allVisibleSelected, isSelected, someVisibleSelected, toggle, toggleAllVisible } = useTableSelection(
  () => props.rows,
  selected,
  getRowKey,
  (keys) => emit('update:selectedKeys', keys),
);

const selectionControl = ref<HTMLInputElement | null>(null);
watchEffect(() => {
  if (selectionControl.value) selectionControl.value.indeterminate = someVisibleSelected.value;
});

const widthFor = (column: KDataTableColumn<TRow>) => props.columnWidths[column.key] ?? column.width;
const columnStyle = (column: KDataTableColumn<TRow>) => {
  const width = widthFor(column);
  return {
    width: width ? `${width}px` : undefined,
    minWidth: `${column.minWidth ?? 72}px`,
    maxWidth: column.maxWidth ? `${column.maxWidth}px` : undefined,
  };
};

let resizeCleanup: (() => void) | null = null;
const resizeColumn = (column: KDataTableColumn<TRow>, delta: number, startWidth: number) => {
  const min = column.minWidth ?? 72;
  const max = column.maxWidth ?? 900;
  const width = Math.round(Math.min(max, Math.max(min, startWidth + delta)));
  emit('update:columnWidths', { ...props.columnWidths, [column.key]: width });
};
const startResize = (event: PointerEvent, column: KDataTableColumn<TRow>) => {
  event.preventDefault();
  const th = (event.currentTarget as HTMLElement).closest('th');
  const startWidth = widthFor(column) ?? th?.getBoundingClientRect().width ?? column.minWidth ?? 72;
  const startX = event.clientX;
  const move = (moveEvent: PointerEvent) => resizeColumn(column, moveEvent.clientX - startX, startWidth);
  const stop = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', stop);
    resizeCleanup = null;
  };
  resizeCleanup?.();
  resizeCleanup = stop;
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', stop, { once: true });
};
const resizeWithKeyboard = (event: KeyboardEvent, column: KDataTableColumn<TRow>) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const width = widthFor(column) ?? column.minWidth ?? 120;
  resizeColumn(column, event.key === 'ArrowRight' ? 10 : -10, width);
};

onBeforeUnmount(() => resizeCleanup?.());
</script>

<template>
  <div class="kui-data-table" :class="[`kui-data-table--${mode}`, { 'kui-data-table--loading': loading }]">
    <div v-if="loading" class="kui-data-table__loading" role="status">
      <span class="kui-data-table__spinner" aria-hidden="true" />{{ loadingText }}
    </div>
    <div class="kui-data-table__scroll">
      <table>
        <caption v-if="caption" class="kui-visually-hidden">{{ caption }}</caption>
        <colgroup>
          <col v-if="selectable" class="kui-data-table__selection-column">
          <col v-for="column in columns" :key="column.key" :style="columnStyle(column)">
        </colgroup>
        <thead>
          <tr>
            <th v-if="selectable" class="kui-data-table__selection-cell">
              <input
                ref="selectionControl"
                type="checkbox"
                :checked="allVisibleSelected"
                :aria-label="selectAllLabel"
                @change="toggleAllVisible"
              >
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[column.headerClass, `kui-data-table__cell--${column.align || 'start'}`]"
              :style="columnStyle(column)"
              :aria-sort="column.sortable ? ariaSort(column) : undefined"
            >
              <div class="kui-data-table__header-content">
              <button
                v-if="column.sortable"
                type="button"
                class="kui-data-table__sort"
                :aria-label="sortLabel(column)"
                @click="emit('sort', column.key)"
              >
                <span>{{ column.label }}</span>
                <span aria-hidden="true">{{ sortKey === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </button>
              <span v-else>{{ column.label }}</span>
              <KTableFilterControl v-if="column.filter" :definition="column.filter" :column-label="column.label" :model-value="filters[column.key]" @update:model-value="updateFilter(column.key, $event)" />
              </div>
              <span
                v-if="resizable"
                class="kui-data-table__resizer"
                role="separator"
                tabindex="0"
                :aria-label="`Изменить ширину столбца «${column.label}»`"
                @pointerdown="startResize($event, column)"
                @keydown="resizeWithKeyboard($event, column)"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!loading && rows.length === 0">
            <td :colspan="columns.length + (selectable ? 1 : 0)" class="kui-data-table__empty">{{ emptyText }}</td>
          </tr>
          <tr
            v-for="(row, index) in rows"
            v-else
            :key="getRowKey(row, index)"
            class="kui-data-table__row"
            :class="{ 'kui-data-table__row--clickable': rowClickable }"
            @click="rowClickable && emit('rowClick', row)"
          >
            <td v-if="selectable" class="kui-data-table__selection-cell" @click.stop>
              <input
                type="checkbox"
                :checked="isSelected(getRowKey(row, index))"
                :aria-label="selectRowLabel(row, index)"
                @change="toggle(getRowKey(row, index))"
              >
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[column.cellClass, `kui-data-table__cell--${column.align || 'start'}`]"
              :data-label="column.label"
            >
              <span class="kui-data-table__cell-content">
                <slot :name="`cell-${column.key}`" :row="row" :value="getCellValue(column, row)" :column="column" :index="index">
                  {{ getCellValue(column, row) }}
                </slot>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
