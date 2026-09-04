<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  open: boolean;
  title: string;
  description?: string;
  closeLabel?: string;
  closeOnBackdrop?: boolean;
}>(), { description: '', closeLabel: 'Закрыть', closeOnBackdrop: true });

const emit = defineEmits<{ close: [] }>();
const panelRef = ref<HTMLElement | null>(null);
let previousFocus: HTMLElement | null = null;

const close = () => emit('close');
const onKeydown = (event: KeyboardEvent) => {
  if (!props.open) return;
  if (event.key === 'Escape') { event.preventDefault(); close(); }
  if (event.key !== 'Tab' || !panelRef.value) return;
  const focusable = [...panelRef.value.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
};

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    previousFocus = document.activeElement as HTMLElement | null;
    document.addEventListener('keydown', onKeydown);
    await nextTick();
    panelRef.value?.querySelector<HTMLElement>('[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus();
  } else {
    document.removeEventListener('keydown', onKeydown);
    previousFocus?.focus();
  }
}, { immediate: true });

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="kui-modal" role="presentation" @mousedown.self="closeOnBackdrop && close()">
      <section ref="panelRef" class="kui-modal__panel" role="dialog" aria-modal="true" :aria-label="title">
        <header class="kui-modal__header">
          <div>
            <h2 class="kui-modal__title">{{ title }}</h2>
            <p v-if="description" class="kui-modal__description">{{ description }}</p>
          </div>
          <button type="button" class="kui-modal__close" :aria-label="closeLabel" @click="close">×</button>
        </header>
        <div class="kui-modal__body"><slot /></div>
        <footer v-if="$slots.footer" class="kui-modal__footer"><slot name="footer" /></footer>
      </section>
    </div>
  </Teleport>
</template>
