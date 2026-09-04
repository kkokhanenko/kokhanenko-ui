<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean;
  label?: string;
  description?: string;
  disabled?: boolean;
}>(), { label: '', description: '', disabled: false });

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<template>
  <label class="kui-toggle" :class="{ 'kui-toggle--disabled': disabled }">
    <input
      class="kui-toggle__input"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    >
    <span class="kui-toggle__track" aria-hidden="true"><span class="kui-toggle__thumb" /></span>
    <span v-if="label || description" class="kui-toggle__copy">
      <span v-if="label" class="kui-toggle__label">{{ label }}</span>
      <span v-if="description" class="kui-toggle__description">{{ description }}</span>
    </span>
  </label>
</template>
