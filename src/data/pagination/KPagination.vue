<script setup lang="ts">
import { computed } from 'vue';
import { KSelect, type KSelectValue } from '../../controls/select';

const props = withDefaults(defineProps<{
  page: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  pageSizeLabel?: string;
  summary?: string;
}>(), {
  pageSizeOptions: () => [5, 10, 20, 50],
  showPageSize: true,
  pageSizeLabel: 'Строк на странице',
  summary: '',
});

const emit = defineEmits<{
  'update:page': [page: number];
  'update:pageSize': [pageSize: number];
}>();

const normalizedTotalPages = computed(() => Math.max(1, props.totalPages));
const normalizedPage = computed(() => Math.min(Math.max(1, props.page), normalizedTotalPages.value));
const pageOptions = computed(() => props.pageSizeOptions.map((value) => ({ value, label: String(value) })));
const pageItems = computed(() => {
  const total = normalizedTotalPages.value;
  const current = normalizedPage.value;
  if (total <= 7) return Array.from({ length: total }, (_, index) => ({ type: 'page' as const, page: index + 1, key: `page-${index + 1}` }));
  const candidates = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((page) => candidates.add(page));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((page) => candidates.add(page));
  const pages = [...candidates].filter((page) => page >= 1 && page <= total).sort((left, right) => left - right);
  const items: Array<{ type: 'page'; page: number; key: string } | { type: 'ellipsis'; key: string }> = [];
  let previous = 0;
  pages.forEach((page) => {
    if (previous && page - previous > 1) items.push({ type: 'ellipsis', key: `ellipsis-${previous}-${page}` });
    items.push({ type: 'page', page, key: `page-${page}` });
    previous = page;
  });
  return items;
});
const go = (page: number) => emit('update:page', Math.min(Math.max(1, page), normalizedTotalPages.value));
const updatePageSize = (value: KSelectValue | KSelectValue[] | null) => {
  if (typeof value === 'number') emit('update:pageSize', value);
};
</script>

<template>
  <footer v-if="totalRows > 0" class="kui-pagination">
    <div class="kui-pagination__summary">
      <span>{{ summary || `Страница ${normalizedPage} из ${normalizedTotalPages}. Всего строк: ${totalRows}` }}</span>
      <slot name="summary" />
    </div>
    <div class="kui-pagination__controls">
      <label v-if="showPageSize" class="kui-pagination__size">
        <span>{{ pageSizeLabel }}</span>
        <KSelect
          :model-value="pageSize"
          :options="pageOptions"
          :label="pageSizeLabel"
          :searchable="false"
          placement="bottom-end"
          @update:model-value="updatePageSize"
        />
      </label>
      <nav v-if="normalizedTotalPages > 1" class="kui-pagination__pages" aria-label="Пагинация таблицы">
        <button type="button" :disabled="normalizedPage <= 1" aria-label="Первая страница" @click="go(1)">«</button>
        <button type="button" :disabled="normalizedPage <= 1" aria-label="Предыдущая страница" @click="go(normalizedPage - 1)">‹</button>
        <template v-for="item in pageItems" :key="item.key">
          <span v-if="item.type === 'ellipsis'" class="kui-pagination__ellipsis" aria-hidden="true">…</span>
          <button
            v-else
            type="button"
            :class="{ 'kui-pagination__page--active': item.page === normalizedPage }"
            :aria-current="item.page === normalizedPage ? 'page' : undefined"
            @click="go(item.page)"
          >{{ item.page }}</button>
        </template>
        <button type="button" :disabled="normalizedPage >= normalizedTotalPages" aria-label="Следующая страница" @click="go(normalizedPage + 1)">›</button>
        <button type="button" :disabled="normalizedPage >= normalizedTotalPages" aria-label="Последняя страница" @click="go(normalizedTotalPages)">»</button>
      </nav>
    </div>
  </footer>
</template>
