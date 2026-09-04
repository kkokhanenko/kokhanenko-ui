<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { KSelect, type KSelectValue } from '../../controls/select';
import { useDismissableLayer } from '../../composables/useDismissableLayer';
import { useFloatingPanel } from '../../composables/useFloatingPanel';
import type { KTableDateRangeValue, KTableFilterDefinition, KTableFilterValue, KTableNumberRangeValue } from './types';
import { isKTableFilterActive } from './types';

const props = defineProps<{ definition: KTableFilterDefinition; modelValue?: KTableFilterValue; columnLabel?: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: KTableFilterValue] }>();
const open = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const panelId = `kui-table-filter-${useId()}`;
const label = computed(() => props.definition.label || props.columnLabel || 'Фильтр');
const active = computed(() => isKTableFilterActive(props.modelValue));
const dateValue = computed<KTableDateRangeValue>(() => !Array.isArray(props.modelValue) && props.modelValue && typeof props.modelValue.from === 'string'
  ? props.modelValue as KTableDateRangeValue : { from: '', to: '' });
const numberValue = computed<KTableNumberRangeValue>(() => !Array.isArray(props.modelValue) && props.modelValue && typeof props.modelValue.from !== 'string'
  ? props.modelValue as KTableNumberRangeValue : { from: null, to: null });
const { panelStyle, updateAfterRender } = useFloatingPanel(triggerRef, panelRef, open, () => 'bottom-start');
const close = () => { open.value = false; };
useDismissableLayer([triggerRef, panelRef], close, () => open.value);
const toggle = async () => { open.value = !open.value; if (open.value) await updateAfterRender(); };
const updateMulti = (value: KSelectValue | KSelectValue[] | null) => emit('update:modelValue', Array.isArray(value) ? value : []);
const updateDate = (part: 'from' | 'to', value: string) => emit('update:modelValue', { ...dateValue.value, [part]: value });
const updateNumber = (part: 'from' | 'to', raw: string) => emit('update:modelValue', { ...numberValue.value, [part]: raw === '' ? null : Number(raw) });
const clear = () => emit('update:modelValue', props.definition.type === 'multi-select' ? [] : props.definition.type === 'date-range' ? { from: '', to: '' } : { from: null, to: null });
</script>

<template>
  <div class="kui-table-filter" :class="{ 'kui-table-filter--active': active }">
    <KSelect
      v-if="definition.type === 'multi-select'"
      :model-value="Array.isArray(modelValue) ? modelValue : []"
      :options="definition.options"
      :label="label"
      :placeholder="definition.placeholder || label"
      :searchable="definition.searchable ?? 'auto'"
      :show-select-all="definition.showSelectAll ?? true"
      :select-all-label="definition.selectAllLabel || 'Все'"
      :all-selection-mode="definition.allSelectionMode || 'implicit-empty'"
      multiple
      :close-on-select="false"
      @update:model-value="updateMulti"
    >
      <template #value="{ selectedCount }">
        <span class="kui-table-filter__multi-value">
          <span>{{ definition.placeholder || label }}</span>
          <span v-if="selectedCount" class="kui-table-filter__count" aria-live="polite">{{ selectedCount }}</span>
        </span>
      </template>
    </KSelect>
    <template v-else>
      <button ref="triggerRef" type="button" class="kui-table-filter__trigger" :aria-label="label" :aria-expanded="open" :aria-controls="panelId" @click="toggle">
        <span>{{ definition.placeholder || label }}</span><span v-if="active" class="kui-table-filter__dot" aria-label="Фильтр применён" /> <span aria-hidden="true">▾</span>
      </button>
      <Teleport to="body">
        <div v-if="open" :id="panelId" ref="panelRef" class="kui-table-filter__panel" :style="panelStyle">
          <strong>{{ label }}</strong>
          <div class="kui-table-filter__range">
            <label><span>От</span><input :type="definition.type === 'date-range' ? 'date' : 'number'" :min="definition.min" :max="definition.max" :step="definition.type === 'number-range' ? definition.step : undefined" :value="definition.type === 'date-range' ? dateValue.from : numberValue.from ?? ''" @input="definition.type === 'date-range' ? updateDate('from', ($event.target as HTMLInputElement).value) : updateNumber('from', ($event.target as HTMLInputElement).value)"></label>
            <label><span>До</span><input :type="definition.type === 'date-range' ? 'date' : 'number'" :min="definition.min" :max="definition.max" :step="definition.type === 'number-range' ? definition.step : undefined" :value="definition.type === 'date-range' ? dateValue.to : numberValue.to ?? ''" @input="definition.type === 'date-range' ? updateDate('to', ($event.target as HTMLInputElement).value) : updateNumber('to', ($event.target as HTMLInputElement).value)"></label>
          </div>
          <div class="kui-table-filter__actions"><button type="button" :disabled="!active" @click="clear">Сбросить</button><button type="button" @click="close">Готово</button></div>
        </div>
      </Teleport>
    </template>
  </div>
</template>
