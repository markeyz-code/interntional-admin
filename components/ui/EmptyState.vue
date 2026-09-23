<template>
  <div class="flex flex-col items-center justify-center p-12 text-center border border-gray-200 rounded-lg bg-gray-50/50">
    <div class="bg-gray-100 p-4 rounded-full mb-4">
      <component :is="icon" class="size-8 text-gray-400" />
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-1">{{ title }}</h3>
    <p class="text-sm text-gray-500 max-w-sm">{{ description }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: 'No records found.'
  },
  icon: {
    type: [Object, Function],
    required: true
  }
});
</script>
