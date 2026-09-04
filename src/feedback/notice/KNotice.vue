<script setup lang="ts">
import type { KuiTone } from '../../types';

withDefaults(defineProps<{
  tone?: KuiTone;
  title?: string;
  dismissible?: boolean;
}>(), { tone: 'neutral', title: '', dismissible: false });

const emit = defineEmits<{ dismiss: [] }>();
</script>

<template>
  <div class="kui-notice" :class="`kui-notice--${tone}`" :role="tone === 'danger' ? 'alert' : 'status'">
    <div class="kui-notice__body">
      <strong v-if="title" class="kui-notice__title">{{ title }}</strong>
      <div class="kui-notice__content"><slot /></div>
    </div>
    <button v-if="dismissible" type="button" class="kui-notice__dismiss" aria-label="Закрыть" @click="emit('dismiss')">×</button>
  </div>
</template>
