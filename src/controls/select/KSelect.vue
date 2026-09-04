<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue';
import { useDismissableLayer } from '../../composables/useDismissableLayer';
import { useFloatingPanel } from '../../composables/useFloatingPanel';
import type { KSelectOption, KSelectValue } from './types';

const props = withDefaults(defineProps<{
  modelValue: KSelectValue | KSelectValue[] | null;
  options: KSelectOption[];
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  searchable?: boolean | 'auto';
  searchThreshold?: number;
  searchPlaceholder?: string;
  noResultsText?: string;
  closeOnSelect?: boolean;
  showSelectAll?: boolean;
  selectAllLabel?: string;
  allSelectionMode?: 'explicit' | 'implicit-empty';
  placement?: 'bottom-start' | 'bottom-end';
}>(), {
  label: 'Выбор',
  placeholder: 'Выберите',
  multiple: false,
  disabled: false,
  searchable: 'auto',
  searchThreshold: 5,
  searchPlaceholder: 'Поиск',
  noResultsText: 'Ничего не найдено',
  closeOnSelect: true,
  showSelectAll: false,
  selectAllLabel: 'Все',
  allSelectionMode: 'explicit',
  placement: 'bottom-start',
});

const emit = defineEmits<{ 'update:modelValue': [value: KSelectValue | KSelectValue[] | null] }>();
const open = ref(false);
const query = ref('');
const activeIndex = ref(-1);
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const listboxId = `kui-select-${useId()}`;

const valuesEqual = (left: KSelectValue, right: KSelectValue) => Object.is(left, right);
const selectedValues = computed<KSelectValue[]>(() => props.multiple && Array.isArray(props.modelValue) ? props.modelValue : []);
const selectedOption = computed(() => props.options.find((option) => !Array.isArray(props.modelValue) && props.modelValue !== null && valuesEqual(option.value, props.modelValue)));
const canSearch = computed(() => props.searchable === true || (props.searchable === 'auto' && props.options.length > props.searchThreshold));
const filteredOptions = computed(() => {
  const normalized = query.value.trim().toLocaleLowerCase();
  if (!normalized) return props.options;
  return props.options.filter((option) => `${option.label} ${option.hint || ''}`.toLocaleLowerCase().includes(normalized));
});
const selectableOptions = computed(() => props.options.filter((option) => !option.disabled));
const allSelected = computed(() => {
  if (!props.multiple || !props.showSelectAll || !selectableOptions.value.length) return false;
  if (props.allSelectionMode === 'implicit-empty' && selectedValues.value.length === 0) return true;
  return selectableOptions.value.every((option) => selectedValues.value.some((value) => valuesEqual(value, option.value)));
});
const selectedCount = computed(() => allSelected.value ? selectableOptions.value.length : selectedValues.value.length);
const selectedLabel = computed(() => {
  if (!props.multiple) return selectedOption.value?.label || props.placeholder;
  const count = selectedCount.value;
  if (!count) return props.placeholder;
  if (count === 1 && selectedValues.value.length === 1) return props.options.find((option) => valuesEqual(option.value, selectedValues.value[0]))?.label || props.placeholder;
  return `Выбрано: ${count}`;
});

const isSelected = (value: KSelectValue) => props.multiple
  ? (props.showSelectAll && props.allSelectionMode === 'implicit-empty' && selectedValues.value.length === 0)
    || selectedValues.value.some((selected) => valuesEqual(selected, value))
  : props.modelValue !== null && !Array.isArray(props.modelValue) && valuesEqual(props.modelValue, value);

type RenderedOption = { key: string; label: string; hint?: string; disabled: boolean; selectAll: boolean; option?: KSelectOption };
const renderedOptions = computed<RenderedOption[]>(() => [
  ...(props.multiple && props.showSelectAll
    ? [{ key: '__select-all__', label: props.selectAllLabel, disabled: selectableOptions.value.length === 0, selectAll: true }]
    : []),
  ...filteredOptions.value.map((option) => ({
    key: `${typeof option.value}:${option.value}`,
    label: option.label,
    hint: option.hint,
    disabled: Boolean(option.disabled),
    selectAll: false,
    option,
  })),
]);
const renderedSelected = (item: RenderedOption) => item.selectAll ? allSelected.value : Boolean(item.option && isSelected(item.option.value));

const close = () => {
  open.value = false;
  query.value = '';
  activeIndex.value = -1;
};

const { panelStyle, updateAfterRender } = useFloatingPanel(triggerRef, panelRef, open, () => props.placement);
useDismissableLayer([triggerRef, panelRef], close, () => open.value);

const openPanel = async () => {
  if (props.disabled) return;
  open.value = true;
  const selectedIndex = renderedOptions.value.findIndex((item) => !item.disabled && renderedSelected(item));
  activeIndex.value = selectedIndex >= 0
    ? selectedIndex
    : renderedOptions.value.findIndex((item) => !item.disabled);
  await updateAfterRender();
  if (canSearch.value) panelRef.value?.querySelector<HTMLInputElement>('.kui-select__search')?.focus();
};

const toggle = () => open.value ? close() : void openPanel();

const select = (option: KSelectOption) => {
  if (option.disabled) return;
  if (props.multiple) {
    const values = props.showSelectAll && props.allSelectionMode === 'implicit-empty' && selectedValues.value.length === 0
      ? selectableOptions.value.map((item) => item.value)
      : [...selectedValues.value];
    const index = values.findIndex((value) => valuesEqual(value, option.value));
    if (index >= 0) values.splice(index, 1); else values.push(option.value);
    const normalized = props.showSelectAll && props.allSelectionMode === 'implicit-empty'
      && selectableOptions.value.length > 0
      && selectableOptions.value.every((item) => values.some((value) => valuesEqual(value, item.value)))
      ? []
      : values;
    emit('update:modelValue', normalized);
    if (!props.closeOnSelect) return;
  } else {
    emit('update:modelValue', option.value);
  }
  close();
  nextTick(() => triggerRef.value?.focus());
};

const selectAll = () => {
  if (!props.multiple || !props.showSelectAll || !selectableOptions.value.length) return;
  if (props.allSelectionMode === 'implicit-empty') emit('update:modelValue', []);
  else emit('update:modelValue', allSelected.value ? [] : selectableOptions.value.map((option) => option.value));
  if (props.closeOnSelect) {
    close();
    nextTick(() => triggerRef.value?.focus());
  }
};

const selectRendered = (item: RenderedOption) => item.selectAll ? selectAll() : item.option && select(item.option);

const moveActive = (step: number) => {
  const options = renderedOptions.value;
  const enabledIndexes = options.flatMap((item, index) => item.disabled ? [] : [index]);
  if (!enabledIndexes.length) return;
  const current = enabledIndexes.indexOf(activeIndex.value);
  const currentPosition = current >= 0 ? current : (step > 0 ? -1 : 0);
  const nextPosition = (currentPosition + step + enabledIndexes.length) % enabledIndexes.length;
  const next = enabledIndexes[nextPosition];
  activeIndex.value = next;
  nextTick(() => panelRef.value?.querySelector<HTMLElement>(`[data-option-index="${next}"]`)?.scrollIntoView({ block: 'nearest' }));
};

const onKeydown = (event: KeyboardEvent) => {
  if (!open.value && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
    event.preventDefault();
    void openPanel();
    return;
  }
  if (!open.value) return;
  if (event.key === 'ArrowDown') { event.preventDefault(); moveActive(1); }
  if (event.key === 'ArrowUp') { event.preventDefault(); moveActive(-1); }
  if (event.key === 'Enter' && renderedOptions.value[activeIndex.value]) { event.preventDefault(); selectRendered(renderedOptions.value[activeIndex.value]); }
  if (event.key === 'Escape') { event.preventDefault(); close(); triggerRef.value?.focus(); }
};

watch(renderedOptions, () => { activeIndex.value = renderedOptions.value.findIndex((item) => !item.disabled); });
</script>

<template>
  <div class="kui-select">
    <button
      ref="triggerRef"
      type="button"
      class="kui-select__trigger"
      :class="{ 'kui-select__trigger--open': open }"
      role="combobox"
      :aria-label="label"
      :aria-controls="listboxId"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :disabled="disabled"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span class="kui-select__value"><slot name="value" :label="selectedLabel" :selected-count="selectedCount">{{ selectedLabel }}</slot></span>
      <span class="kui-select__chevron" aria-hidden="true">▾</span>
    </button>

    <Teleport to="body">
      <div v-if="open" ref="panelRef" class="kui-select__panel" :style="panelStyle" @keydown="onKeydown">
        <input
          v-if="canSearch"
          v-model="query"
          class="kui-select__search"
          type="search"
          :placeholder="searchPlaceholder"
          :aria-label="searchPlaceholder"
        >
        <div :id="listboxId" class="kui-select__list" role="listbox" :aria-multiselectable="multiple || undefined">
          <button
            v-for="(item, index) in renderedOptions"
            :key="item.key"
            type="button"
            class="kui-select__option"
            :class="{ 'kui-select__option--active': index === activeIndex, 'kui-select__option--selected': renderedSelected(item), 'kui-select__option--select-all': item.selectAll }"
            role="option"
            :aria-selected="renderedSelected(item)"
            :disabled="item.disabled"
            :data-option-index="index"
            @mouseenter="activeIndex = index"
            @click="selectRendered(item)"
          >
            <span v-if="multiple" class="kui-select__check" aria-hidden="true">{{ renderedSelected(item) ? '✓' : '' }}</span>
            <span class="kui-select__option-copy">
              <span class="kui-select__option-label">
                <span v-if="item.selectAll">{{ item.label }}</span>
                <slot v-else name="option" :option="item.option">{{ item.label }}</slot>
              </span>
              <span v-if="item.hint" class="kui-select__option-hint">{{ item.hint }}</span>
            </span>
          </button>
          <span v-if="!renderedOptions.length" class="kui-select__empty">{{ noResultsText }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>
