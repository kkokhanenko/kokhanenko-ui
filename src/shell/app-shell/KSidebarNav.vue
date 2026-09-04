<script setup lang="ts">
import { ref, watch } from 'vue';
import type { KAppBrand, KAppNavigationItem } from './types';

const props = defineProps<{
  brand: KAppBrand;
  items: KAppNavigationItem[];
  activeId?: string;
  collapsed: boolean;
}>();

const emit = defineEmits<{
  navigate: [item: KAppNavigationItem];
  'expand-sidebar': [];
}>();
const expandedIds = ref(new Set<string>());
const isActive = (item: KAppNavigationItem) => item.id === props.activeId || item.children?.some((child) => child.id === props.activeId);
const isExpanded = (item: KAppNavigationItem) => expandedIds.value.has(item.id);
const toggleGroup = (item: KAppNavigationItem) => {
  if (props.collapsed) emit('expand-sidebar');
  const next = new Set(expandedIds.value);
  if (next.has(item.id)) next.delete(item.id);
  else next.add(item.id);
  expandedIds.value = next;
};
const activate = (event: MouseEvent, item: KAppNavigationItem) => {
  if (item.disabled) { event.preventDefault(); return; }
  if (item.children?.length) { event.preventDefault(); toggleGroup(item); return; }
  if (!item.href) event.preventDefault();
  emit('navigate', item);
};

watch(() => props.activeId, (activeId) => {
  const parent = props.items.find((item) => item.children?.some((child) => child.id === activeId));
  if (parent) expandedIds.value = new Set([...expandedIds.value, parent.id]);
}, { immediate: true });
</script>

<template>
  <div class="kui-app-sidebar__brand">
    <span v-if="brand.logoUrl" class="kui-app-sidebar__logo"><img :src="brand.logoUrl" :alt="brand.logoAlt || ''"></span>
    <span v-else class="kui-app-sidebar__logo kui-app-sidebar__logo--fallback" aria-hidden="true">{{ brand.name.slice(0, 1) }}</span>
    <span v-if="!collapsed" class="kui-app-sidebar__brand-copy">
      <strong>{{ brand.name }}</strong>
      <small v-if="brand.subtitle">{{ brand.subtitle }}</small>
    </span>
  </div>

  <nav class="kui-app-sidebar__nav" aria-label="Основная навигация">
    <div v-for="item in items" :key="item.id" class="kui-app-sidebar__group">
      <component
        :is="item.href ? 'a' : 'button'"
        :href="item.href"
        :type="item.href ? undefined : 'button'"
        class="kui-app-sidebar__item"
        :class="{ 'kui-app-sidebar__item--active': isActive(item) }"
        :aria-current="isActive(item) ? 'page' : undefined"
        :aria-disabled="item.disabled || undefined"
        :aria-expanded="item.children?.length ? isExpanded(item) : undefined"
        :title="collapsed ? item.label : undefined"
        @click="activate($event, item)"
      >
        <span class="kui-app-sidebar__icon" aria-hidden="true"><slot name="icon" :item="item">{{ item.icon || '•' }}</slot></span>
        <span v-if="!collapsed" class="kui-app-sidebar__item-copy">
          <strong>{{ item.label }}</strong>
          <small v-if="item.hint">{{ item.hint }}</small>
        </span>
        <span v-if="item.badge !== undefined && !collapsed" class="kui-app-sidebar__badge">{{ item.badge }}</span>
        <span v-if="item.children?.length" class="kui-app-sidebar__caret" :class="{ 'kui-app-sidebar__caret--open': isExpanded(item) }" :title="collapsed ? `Подразделов: ${item.children.length}` : undefined" aria-hidden="true">{{ item.children.length }}</span>
      </component>

      <div v-if="item.children?.length && (isExpanded(item) || collapsed)" class="kui-app-sidebar__children">
        <component
          :is="child.href ? 'a' : 'button'"
          v-for="child in item.children"
          :key="child.id"
          :href="child.href"
          :type="child.href ? undefined : 'button'"
          class="kui-app-sidebar__child"
          :class="{ 'kui-app-sidebar__child--active': child.id === activeId }"
          :aria-current="child.id === activeId ? 'page' : undefined"
          :aria-disabled="child.disabled || undefined"
          :title="collapsed ? child.label : undefined"
          @click="activate($event, child)"
        >
          <strong>{{ child.label }}</strong>
          <small v-if="child.hint">{{ child.hint }}</small>
        </component>
      </div>
    </div>
  </nav>
</template>
