<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { KSelect, type KSelectOption, type KSelectValue } from '../../controls/select';
import { KColumnPicker } from '../column-picker';
import type { KColumnPickerOption, KDataTableMode, KDataTableSortDirection } from '../data-table/types';
import { KTableFilterControl, type KTableFilterDefinition, type KTableFilterValue, type KTableFilterValues } from '../table-filters';
import { KTableViewToggle } from '../table-view-toggle';

const props = withDefaults(defineProps<{
  modelValue?: string;
  placeholder?: string;
  clearLabel?: string;
  viewMode?: KDataTableMode;
  showModeToggle?: boolean;
  visibleColumns?: string[];
  columnOrder?: string[];
  columnOptions?: KColumnPickerOption[];
  columnLabel?: string;
  reorderableColumns?: boolean;
  cardSortKey?: string;
  cardSortDirection?: KDataTableSortDirection;
  cardSortOptions?: KSelectOption[];
  cardSortLabel?: string;
  filterColumns?: Array<{ key: string; label: string; filter?: KTableFilterDefinition }>;
  filters?: KTableFilterValues;
}>(), {
  modelValue: '',
  placeholder: 'Поиск',
  clearLabel: 'Очистить поиск',
  viewMode: 'table',
  showModeToggle: false,
  visibleColumns: () => [],
  columnOrder: () => [],
  columnOptions: () => [],
  columnLabel: 'Столбцы',
  reorderableColumns: false,
  cardSortKey: '',
  cardSortDirection: 'asc',
  cardSortOptions: () => [],
  cardSortLabel: 'Сортировка',
  filterColumns: () => [],
  filters: () => ({}),
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:viewMode': [value: KDataTableMode];
  'update:visibleColumns': [value: string[]];
  'update:columnOrder': [value: string[]];
  'update:cardSortKey': [value: string];
  toggleCardSortDirection: [];
  'update:filters': [filters: KTableFilterValues];
}>();

const searchInput = ref<HTMLInputElement | null>(null);
const clearSearch = async () => {
  emit('update:modelValue', '');
  await nextTick();
  searchInput.value?.focus();
};

const updateCardSort = (value: KSelectValue | KSelectValue[] | null) => {
  if (typeof value === 'string') emit('update:cardSortKey', value);
};
const updateFilter = (key: string, value: KTableFilterValue) => emit('update:filters', { ...props.filters, [key]: value });
</script>

<template>
  <div class="kui-table-toolbar">
    <div class="kui-table-toolbar__main">
      <div class="kui-table-toolbar__search">
        <input
          ref="searchInput"
          class="kui-table-toolbar__search-input"
          :value="modelValue"
          type="search"
          :placeholder="placeholder"
          :aria-label="placeholder"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        >
        <button v-if="modelValue" type="button" :aria-label="clearLabel" @click="clearSearch">×</button>
      </div>
      <div class="kui-table-toolbar__actions">
        <slot name="actions" />
        <KTableViewToggle v-if="showModeToggle" :model-value="viewMode" @update:model-value="$emit('update:viewMode', $event)" />
        <KColumnPicker
          v-if="columnOptions.length"
          :model-value="visibleColumns"
          :column-order="columnOrder"
          :options="columnOptions"
          :label="columnLabel"
          :reorderable="reorderableColumns"
          @update:model-value="$emit('update:visibleColumns', $event)"
          @update:column-order="$emit('update:columnOrder', $event)"
        />
      </div>
    </div>
    <div v-if="$slots.filters" class="kui-table-toolbar__filters"><slot name="filters" /></div>
    <div v-if="showModeToggle && viewMode === 'cards' && cardSortOptions.length" class="kui-table-toolbar__card-controls">
      <label>
        <span>{{ cardSortLabel }}</span>
        <KSelect :model-value="cardSortKey" :options="cardSortOptions" :label="cardSortLabel" :searchable="false" @update:model-value="updateCardSort" />
      </label>
      <button type="button" :aria-label="cardSortDirection === 'asc' ? 'По возрастанию' : 'По убыванию'" @click="$emit('toggleCardSortDirection')">
        {{ cardSortDirection === 'asc' ? '↑' : '↓' }}
      </button>
      <slot name="card-filters" />
      <div v-for="column in filterColumns.filter((item) => item.filter)" :key="column.key" class="kui-table-toolbar__card-filter">
        <KTableFilterControl :definition="column.filter!" :column-label="column.label" :model-value="filters[column.key]" @update:model-value="updateFilter(column.key, $event)" />
      </div>
    </div>
  </div>
</template>
