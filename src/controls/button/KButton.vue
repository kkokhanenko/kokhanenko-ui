<script setup lang="ts">
import type { KuiSize } from '../../types';

withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: KuiSize;
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
});
</script>

<template>
  <button
    :type="type"
    class="kui-button"
    :class="[`kui-button--${variant}`, `kui-button--${size}`, { 'kui-button--block': block }]"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="kui-button__spinner" aria-hidden="true" />
    <span class="kui-button__content"><slot /></span>
  </button>
</template>
