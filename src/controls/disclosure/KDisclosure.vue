<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  title: string;
  description?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  toggle: [value: boolean];
}>();

const onToggle = (event: Event) => {
  const open = (event.currentTarget as HTMLDetailsElement).open;
  emit('update:modelValue', open);
  emit('toggle', open);
};
</script>

<template>
  <details class="kui-disclosure" :open="modelValue" @toggle="onToggle">
    <summary class="kui-disclosure__summary">
      <span class="kui-disclosure__indicator" aria-hidden="true">›</span>
      <span class="kui-disclosure__title"><slot name="title">{{ title }}</slot></span>
      <small v-if="description || $slots.description" class="kui-disclosure__description">
        <slot name="description">{{ description }}</slot>
      </small>
    </summary>
    <div class="kui-disclosure__content"><slot /></div>
  </details>
</template>
