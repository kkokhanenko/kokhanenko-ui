<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useDismissableLayer } from '../../composables/useDismissableLayer';
import { useFloatingPanel } from '../../composables/useFloatingPanel';
import type { KColumnPickerOption } from '../data-table/types';

const props = withDefaults(defineProps<{
  modelValue: string[];
  columnOrder: string[];
  options: KColumnPickerOption[];
  label?: string;
  reorderable?: boolean;
  searchable?: boolean | 'auto';
  searchThreshold?: number;
}>(), {
  label: 'Столбцы',
  reorderable: false,
  searchable: 'auto',
  searchThreshold: 5,
});

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
  'update:columnOrder': [value: string[]];
}>();

const open = ref(false);
const query = ref('');
const reorderMode = ref(false);
const draggedValue = ref('');
const dragOverValue = ref('');
const dragOverPosition = ref<'before' | 'after'>('before');
const pointerDragId = ref<number | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const optionMap = computed(() => new Map(props.options.map((option) => [option.value, option])));
const normalizedOrder = computed(() => {
  const ordered = props.columnOrder.filter((value) => optionMap.value.has(value));
  props.options.forEach((option) => { if (!ordered.includes(option.value)) ordered.push(option.value); });
  return ordered;
});
const orderedOptions = computed(() => normalizedOrder.value.map((value) => optionMap.value.get(value)).filter((option): option is KColumnPickerOption => Boolean(option)));
const canSearch = computed(() => props.searchable === true || (props.searchable === 'auto' && props.options.length > props.searchThreshold));
const filteredOptions = computed(() => {
  const normalized = query.value.trim().toLocaleLowerCase();
  return normalized ? orderedOptions.value.filter((option) => option.label.toLocaleLowerCase().includes(normalized)) : orderedOptions.value;
});
const selected = computed(() => new Set(props.modelValue));
const canReorder = computed(() => props.reorderable && !query.value.trim());
const showReorderControls = computed(() => canReorder.value && reorderMode.value);

const clearDragState = () => {
  draggedValue.value = '';
  dragOverValue.value = '';
  dragOverPosition.value = 'before';
  pointerDragId.value = null;
};
const close = () => {
  open.value = false;
  query.value = '';
  reorderMode.value = false;
  clearDragState();
};
const { panelStyle, updateAfterRender } = useFloatingPanel(triggerRef, panelRef, open, () => 'bottom-end');
useDismissableLayer([triggerRef, panelRef], close, () => open.value);

const toggle = async () => {
  if (open.value) close();
  else {
    open.value = true;
    await updateAfterRender();
  }
};
const toggleColumn = (option: KColumnPickerOption) => {
  if (option.locked) return;
  const next = new Set(selected.value);
  if (next.has(option.value)) {
    if (next.size <= 1) return;
    next.delete(option.value);
  } else next.add(option.value);
  emit('update:modelValue', normalizedOrder.value.filter((value) => next.has(value)));
};
const emitColumnOrder = (order: string[]) => {
  const allowed = new Set(props.options.map((option) => option.value));
  const normalized = order.filter((value, index) => allowed.has(value) && order.indexOf(value) === index);
  props.options.forEach((option) => { if (!normalized.includes(option.value)) normalized.push(option.value); });
  emit('update:columnOrder', normalized);
  emit('update:modelValue', normalized.filter((value) => selected.value.has(value)));
};
const move = (value: string, step: number) => {
  const order = [...normalizedOrder.value];
  const index = order.indexOf(value);
  const target = index + step;
  if (index < 0 || target < 0 || target >= order.length) return;
  [order[index], order[target]] = [order[target], order[index]];
  emitColumnOrder(order);
};
const toggleReorderMode = () => {
  if (!canReorder.value) return;
  reorderMode.value = !reorderMode.value;
  clearDragState();
};
const resetOrder = () => emitColumnOrder(props.options.map((option) => option.value));

const startDrag = (value: string, event: DragEvent) => {
  if (!showReorderControls.value) return;
  draggedValue.value = value;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    const option = (event.currentTarget as HTMLElement | null)?.closest<HTMLElement>('.kui-column-picker__option');
    if (option) event.dataTransfer.setDragImage(option, 18, Math.max(18, option.getBoundingClientRect().height / 2));
  }
};
const dragOverOption = (targetValue: string, event: DragEvent) => {
  if (!showReorderControls.value || !draggedValue.value || targetValue === draggedValue.value) {
    dragOverValue.value = '';
    return;
  }
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  dragOverValue.value = targetValue;
  dragOverPosition.value = event.clientY > rect.top + rect.height / 2 ? 'after' : 'before';
};
const dropOn = (targetValue: string) => {
  const sourceValue = draggedValue.value;
  const position = dragOverValue.value === targetValue ? dragOverPosition.value : 'before';
  clearDragState();
  if (!showReorderControls.value || !sourceValue || !targetValue || sourceValue === targetValue) return;
  const order = [...normalizedOrder.value];
  const from = order.indexOf(sourceValue);
  if (from < 0 || !order.includes(targetValue)) return;
  order.splice(from, 1);
  const targetIndex = order.indexOf(targetValue);
  order.splice(position === 'after' ? targetIndex + 1 : targetIndex, 0, sourceValue);
  emitColumnOrder(order);
};
const findPointerDropTarget = (event: PointerEvent) => {
  const option = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('.kui-column-picker__option');
  if (!option || !panelRef.value?.contains(option)) return null;
  const value = option.dataset.value || '';
  if (!value || value === draggedValue.value) return null;
  const rect = option.getBoundingClientRect();
  return { value, position: event.clientY > rect.top + rect.height / 2 ? 'after' as const : 'before' as const };
};
const movePointerDrag = (event: PointerEvent) => {
  if (pointerDragId.value !== event.pointerId || !draggedValue.value) return;
  event.preventDefault();
  const target = findPointerDropTarget(event);
  dragOverValue.value = target?.value || '';
  if (target) dragOverPosition.value = target.position;
};
const endPointerDrag = (event: PointerEvent) => {
  if (pointerDragId.value !== event.pointerId) return;
  event.preventDefault();
  const targetValue = dragOverValue.value;
  dropOn(targetValue);
  window.removeEventListener('pointermove', movePointerDrag);
  window.removeEventListener('pointerup', endPointerDrag);
  window.removeEventListener('pointercancel', endPointerDrag);
};
const startPointerDrag = (value: string, event: PointerEvent) => {
  if (!showReorderControls.value) return;
  const handle = event.currentTarget as HTMLElement | null;
  handle?.focus();
  event.preventDefault();
  event.stopPropagation();
  draggedValue.value = value;
  pointerDragId.value = event.pointerId;
  handle?.setPointerCapture?.(event.pointerId);
  window.addEventListener('pointermove', movePointerDrag, { passive: false });
  window.addEventListener('pointerup', endPointerDrag, { passive: false });
  window.addEventListener('pointercancel', endPointerDrag, { passive: false });
};
const reorderWithKeyboard = (value: string, event: KeyboardEvent) => {
  if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
  event.preventDefault();
  move(value, event.key === 'ArrowUp' ? -1 : 1);
};
const onPanelKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return;
  event.preventDefault();
  event.stopPropagation();
  close();
  nextTick(() => triggerRef.value?.focus());
};

watch(query, (value) => {
  if (value.trim()) {
    reorderMode.value = false;
    clearDragState();
  }
});
onBeforeUnmount(() => {
  window.removeEventListener('pointermove', movePointerDrag);
  window.removeEventListener('pointerup', endPointerDrag);
  window.removeEventListener('pointercancel', endPointerDrag);
});
</script>

<template>
  <div class="kui-column-picker">
    <button ref="triggerRef" type="button" class="kui-column-picker__trigger" aria-haspopup="dialog" :aria-expanded="open" @click="toggle">
      <span>{{ label }}</span><span class="kui-column-picker__count">{{ modelValue.length }}</span><span aria-hidden="true">▾</span>
    </button>
    <Teleport to="body">
      <section v-if="open" ref="panelRef" class="kui-column-picker__panel" :style="panelStyle" role="dialog" :aria-label="label" @keydown="onPanelKeydown">
        <input v-if="canSearch" v-model="query" type="search" class="kui-column-picker__search" placeholder="Поиск" aria-label="Поиск столбцов">
        <div class="kui-column-picker__list">
          <div
            v-for="option in filteredOptions"
            :key="option.value"
            class="kui-column-picker__option"
            :class="{
              'is-selected': selected.has(option.value),
              'is-locked': option.locked,
              'is-reorderable': showReorderControls,
              'is-dragging': draggedValue === option.value,
              'is-drop-before': dragOverValue === option.value && dragOverPosition === 'before',
              'is-drop-after': dragOverValue === option.value && dragOverPosition === 'after',
            }"
            :data-value="option.value"
            @dragover.prevent="dragOverOption(option.value, $event)"
            @dragleave="dragOverValue === option.value && (dragOverValue = '')"
            @drop.stop.prevent="dropOn(option.value)"
          >
            <button
              v-if="showReorderControls"
              type="button"
              class="kui-column-picker__drag"
              draggable="true"
              :aria-label="`Переместить «${option.label}». Используйте перетаскивание или стрелки вверх и вниз`"
              @click.stop
              @pointerdown.stop="startPointerDrag(option.value, $event)"
              @dragstart.stop="startDrag(option.value, $event)"
              @dragend.stop="clearDragState"
              @keydown="reorderWithKeyboard(option.value, $event)"
            >⋮⋮</button>
            <label>
              <input type="checkbox" :checked="selected.has(option.value)" :disabled="option.locked" @change="toggleColumn(option)">
              <span>{{ option.label }}</span>
            </label>
          </div>
          <span v-if="!filteredOptions.length" class="kui-column-picker__empty">Ничего не найдено</span>
        </div>
        <div v-if="reorderable && !query.trim()" class="kui-column-picker__footer">
          <button
            type="button"
            class="kui-column-picker__reorder-toggle"
            :class="{ 'is-active': reorderMode }"
            :aria-pressed="reorderMode"
            :aria-label="reorderMode ? 'Завершить изменение порядка' : 'Изменить порядок столбцов'"
            :title="reorderMode ? 'Завершить изменение порядка' : 'Изменить порядок столбцов'"
            @click="toggleReorderMode"
          >↕</button>
          <button type="button" class="kui-column-picker__reset" @click="resetOrder">Сбросить порядок</button>
        </div>
      </section>
    </Teleport>
  </div>
</template>
