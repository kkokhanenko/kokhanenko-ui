<script setup lang="ts">
import { ref } from 'vue';
import KSidebarNav from './KSidebarNav.vue';
import KTopbar from './KTopbar.vue';
import type { KAppBrand, KAppNavigationItem, KAppUser } from './types';

withDefaults(defineProps<{
  brand: KAppBrand;
  navigation: KAppNavigationItem[];
  activeId?: string;
  title: string;
  eyebrow?: string;
  user?: KAppUser;
  sidebarCollapsed?: boolean;
}>(), { activeId: '', eyebrow: '', user: undefined, sidebarCollapsed: false });

const emit = defineEmits<{
  navigate: [item: KAppNavigationItem];
  'update:sidebarCollapsed': [value: boolean];
}>();

const mobileOpen = ref(false);
const navigate = (item: KAppNavigationItem) => {
  emit('navigate', item);
  mobileOpen.value = false;
};
</script>

<template>
  <div class="kui-app-shell kui-scope" :class="{ 'kui-app-shell--collapsed': sidebarCollapsed, 'kui-app-shell--mobile-open': mobileOpen }">
    <button v-if="mobileOpen" type="button" class="kui-app-shell__backdrop" aria-label="Закрыть меню" @click="mobileOpen = false" />
    <aside class="kui-app-shell__sidebar">
      <KSidebarNav
        :brand="brand"
        :items="navigation"
        :active-id="activeId"
        :collapsed="sidebarCollapsed"
        @navigate="navigate"
        @expand-sidebar="emit('update:sidebarCollapsed', false)"
      >
        <template #icon="scope"><slot name="nav-icon" v-bind="scope">{{ scope.item.icon || '•' }}</slot></template>
      </KSidebarNav>
      <div class="kui-app-shell__sidebar-footer"><slot name="sidebar-footer" /></div>
      <button
        type="button"
        class="kui-app-shell__collapse"
        :aria-label="sidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'"
        @click="emit('update:sidebarCollapsed', !sidebarCollapsed)"
      >{{ sidebarCollapsed ? '→' : '←' }}</button>
      <button type="button" class="kui-app-shell__mobile-close" aria-label="Закрыть меню" @click="mobileOpen = false">×</button>
    </aside>

    <div class="kui-app-shell__main">
      <KTopbar :title="title" :eyebrow="eyebrow" :user="user" @menu="mobileOpen = true">
        <template #actions><slot name="topbar-actions" /></template>
        <template v-if="$slots.user" #user="scope"><slot name="user" v-bind="scope" /></template>
      </KTopbar>
      <main class="kui-app-shell__content"><slot /></main>
      <footer v-if="$slots.footer" class="kui-app-shell__footer"><slot name="footer" /></footer>
    </div>
  </div>
</template>
