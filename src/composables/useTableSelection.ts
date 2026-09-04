import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import type { KDataTableKey } from '../data/data-table/types';

export function useTableSelection<TRow>(
  rows: MaybeRefOrGetter<TRow[]>,
  selectedKeys: MaybeRefOrGetter<KDataTableKey[]>,
  getKey: (row: TRow, index: number) => KDataTableKey,
  update: (keys: KDataTableKey[]) => void,
) {
  const visibleKeys = computed(() => toValue(rows).map(getKey));
  const selectedSet = computed(() => new Set(toValue(selectedKeys)));
  const allVisibleSelected = computed(() => visibleKeys.value.length > 0 && visibleKeys.value.every((key) => selectedSet.value.has(key)));
  const someVisibleSelected = computed(() => !allVisibleSelected.value && visibleKeys.value.some((key) => selectedSet.value.has(key)));

  const isSelected = (key: KDataTableKey) => selectedSet.value.has(key);
  const toggle = (key: KDataTableKey) => {
    const next = new Set(selectedSet.value);
    if (next.has(key)) next.delete(key); else next.add(key);
    update([...next]);
  };
  const toggleAllVisible = () => {
    const next = new Set(selectedSet.value);
    if (allVisibleSelected.value) visibleKeys.value.forEach((key) => next.delete(key));
    else visibleKeys.value.forEach((key) => next.add(key));
    update([...next]);
  };
  const clear = () => update([]);

  return { allVisibleSelected, clear, isSelected, selectedSet, someVisibleSelected, toggle, toggleAllVisible, visibleKeys };
}
