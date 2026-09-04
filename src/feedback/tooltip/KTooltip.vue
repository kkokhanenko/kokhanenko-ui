<script setup lang="ts">
import { ref } from 'vue';

withDefaults(defineProps<{ text: string; label?: string; placement?: 'top' | 'bottom' }>(), {
  label: 'Подсказка',
  placement: 'top',
});

const open = ref(false);
const show = () => { open.value = true; };
const hide = () => { open.value = false; };
</script>

<template>
  <span class="kui-tooltip" :class="`kui-tooltip--${placement}`" @mouseenter="show" @mouseleave="hide">
    <button
      type="button"
      class="kui-tooltip__trigger"
      :aria-label="label"
      :aria-expanded="open"
      @focus="show"
      @blur="hide"
      @click="open = !open"
      @keydown.esc="hide"
    ><slot name="trigger">?</slot></button>
    <span v-show="open" class="kui-tooltip__bubble" role="tooltip">{{ text }}</span>
  </span>
</template>
