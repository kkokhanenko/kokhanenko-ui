<script setup lang="ts">
import type { KAppUser } from './types';

defineProps<{ title: string; eyebrow?: string; user?: KAppUser }>();
defineEmits<{ menu: [] }>();
</script>

<template>
  <header class="kui-app-topbar">
    <button type="button" class="kui-app-topbar__menu" aria-label="Открыть меню" @click="$emit('menu')">☰</button>
    <div class="kui-app-topbar__heading">
      <span v-if="eyebrow" class="kui-app-topbar__eyebrow">{{ eyebrow }}</span>
      <h1 class="kui-app-topbar__title">{{ title }}</h1>
    </div>
    <div class="kui-app-topbar__actions">
      <slot name="actions" />
      <slot name="user" :user="user">
        <span v-if="user" class="kui-app-topbar__user">
          <img v-if="user.avatarUrl" class="kui-app-topbar__avatar" :src="user.avatarUrl" :alt="user.name">
          <span v-else class="kui-app-topbar__avatar kui-app-topbar__avatar--fallback" aria-hidden="true">{{ user.initials || user.name.slice(0, 1) }}</span>
          <span class="kui-app-topbar__user-name">{{ user.name }}</span>
        </span>
      </slot>
    </div>
  </header>
</template>
