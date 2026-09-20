<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-500 mb-6">{{ message }}</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('cancel')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 transition-colors"
          >
            {{ cancelText }}
          </button>
          <button
            @click="$emit('confirm')"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
});

defineEmits(['confirm', 'cancel']);
</script>
