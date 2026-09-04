<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useDismissableLayer } from '../../composables/useDismissableLayer';
import { useFloatingPanel } from '../../composables/useFloatingPanel';
import type { KActionMenuItem } from './types';

const props = withDefaults(defineProps<{
  items: KActionMenuItem[];
  label?: string;
  disabled?: boolean;
  placement?: 'bottom-start' | 'bottom-end';
}>(), { label: 'Действия', disabled: false, placement: 'bottom-end' });

const emit = defineEmits<{ select: [item: KActionMenuItem] }>();
const open = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const visibleItems = computed(() => props.items.filter((item) => !item.hidden));
const close = () => { open.value = false; };
const { panelStyle, updateAfterRender } = useFloatingPanel(triggerRef, panelRef, open, () => props.placement);
useDismissableLayer([triggerRef, panelRef], close, () => open.value);


const toggle = async () => {
  if (props.disabled || !visibleItems.value.length) return;
  open.value = !open.value;
  if (open.value) {
    await updateAfterRender();
    panelRef.value?.querySelector<HTMLElement>('.kui-action-menu__item:not(:disabled)')?.focus();
  }
};

const select = (item: KActionMenuItem) => {
  if (item.disabled) return;
  emit('select', item);
  close();
  nextTick(() => triggerRef.value?.focus());
};

const onPanelKeydown = (event: KeyboardEvent) => {
  const items = [...(panelRef.value?.querySelectorAll<HTMLButtonElement>('.kui-action-menu__item:not(:disabled)') || [])];
  const current = items.indexOf(document.activeElement as HTMLButtonElement);
  if (event.key === 'ArrowDown' && items.length) { event.preventDefault(); items[(current + 1) % items.length].focus(); }
  if (event.key === 'ArrowUp' && items.length) { event.preventDefault(); items[(current - 1 + items.length) % items.length].focus(); }
  if (event.key === 'Escape') { event.preventDefault(); close(); triggerRef.value?.focus(); }
};
</script>

<template>
  <span class="kui-action-menu">
    <button
      ref="triggerRef"
      type="button"
      class="kui-action-menu__trigger"
      :disabled="disabled || !visibleItems.length"
      :aria-label="label"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="toggle"
    ><slot name="trigger" :open="open"><span aria-hidden="true">•••</span></slot></button>
    <Teleport to="body">
      <div v-if="open" ref="panelRef" class="kui-action-menu__panel" role="menu" :style="panelStyle" @keydown="onPanelKeydown">
        <button
          v-for="item in visibleItems"
          :key="item.id"
          type="button"
          class="kui-action-menu__item"
          :class="{ 'kui-action-menu__item--danger': item.tone === 'danger' }"
          :disabled="item.disabled"
          role="menuitem"
          @click="select(item)"
        >
          <span v-if="item.icon" class="kui-action-menu__icon" aria-hidden="true">{{ item.icon }}</span>
          <slot name="item" :item="item">{{ item.label }}</slot>
        </button>
      </div>
    </Teleport>
  </span>
</template>
