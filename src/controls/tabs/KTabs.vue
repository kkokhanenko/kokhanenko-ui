<script setup lang="ts">
import type { KTabOption } from './types';

const props = withDefaults(defineProps<{
  modelValue: string;
  options: KTabOption[];
  label?: string;
  variant?: 'tabs' | 'segmented';
}>(), { label: 'Разделы', variant: 'tabs' });

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const select = (option: KTabOption) => {
  if (!option.disabled) emit('update:modelValue', option.value);
};

const onKeydown = (event: KeyboardEvent, index: number) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const enabled = props.options.map((option, optionIndex) => ({ option, optionIndex })).filter(({ option }) => !option.disabled);
  if (!enabled.length) return;
  const current = enabled.findIndex(({ optionIndex }) => optionIndex === index);
  let next = current;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = enabled.length - 1;
  if (event.key === 'ArrowRight') next = (current + 1) % enabled.length;
  if (event.key === 'ArrowLeft') next = (current - 1 + enabled.length) % enabled.length;
  select(enabled[next].option);
  requestAnimationFrame(() => {
    const group = (event.currentTarget as HTMLElement).parentElement;
    group?.querySelector<HTMLElement>(`[data-kui-tab-value="${CSS.escape(enabled[next].option.value)}"]`)?.focus();
  });
};
</script>

<template>
  <div class="kui-tabs" :class="`kui-tabs--${variant}`" role="tablist" :aria-label="label">
    <button
      v-for="(option, index) in options"
      :key="option.value"
      type="button"
      role="tab"
      class="kui-tabs__tab"
      :class="{ 'kui-tabs__tab--active': option.value === modelValue }"
      :data-kui-tab-value="option.value"
      :aria-selected="option.value === modelValue"
      :tabindex="option.value === modelValue ? 0 : -1"
      :disabled="option.disabled"
      @click="select(option)"
      @keydown="onKeydown($event, index)"
    >
      <slot name="tab" :option="option" :active="option.value === modelValue">{{ option.label }}</slot>
    </button>
  </div>
</template>
