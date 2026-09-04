<script setup lang="ts">
import type { KDataTableMode } from '../data-table/types';

withDefaults(defineProps<{
  modelValue: KDataTableMode;
  tableLabel?: string;
  cardsLabel?: string;
}>(), { tableLabel: 'Показать таблицей', cardsLabel: 'Показать карточками' });

defineEmits<{ 'update:modelValue': [mode: KDataTableMode] }>();
</script>

<template>
  <div class="kui-table-view-toggle" role="group" aria-label="Режим отображения">
    <button
      type="button"
      :class="{ 'kui-table-view-toggle__button--active': modelValue === 'table' }"
      :aria-label="tableLabel"
      :title="tableLabel"
      :aria-pressed="modelValue === 'table'"
      @click="$emit('update:modelValue', 'table')"
    >☷</button>
    <button
      type="button"
      :class="{ 'kui-table-view-toggle__button--active': modelValue === 'cards' }"
      :aria-label="cardsLabel"
      :title="cardsLabel"
      :aria-pressed="modelValue === 'cards'"
      @click="$emit('update:modelValue', 'cards')"
    >▦</button>
  </div>
</template>
