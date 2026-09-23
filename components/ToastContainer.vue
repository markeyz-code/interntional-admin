<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts" :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border min-w-72 max-w-sm"
        :class="toastClasses(toast.type)"
      >
        <!-- Icon -->
        <div class="flex-shrink-0 mt-0.5">
          <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5 text-green-500" />
          <XCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-red-500" />
          <AlertTriangle v-else-if="toast.type === 'warning'" class="w-5 h-5 text-yellow-500" />
          <Info v-else class="w-5 h-5 text-brand" />
        </div>
        <!-- Content -->
        <div class="flex-1">
          <p class="text-sm font-semibold text-gray-900">{{ toast.title }}</p>
          <p class="text-xs text-gray-600 mt-0.5">{{ toast.message }}</p>
        </div>
        <!-- Close -->
        <button @click="removeToast(toast.id)" class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition">
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useCustomToast } from '@/composables/core/useCustomToast';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next';

const { toasts, removeToast } = useCustomToast();

const toastClasses = (type?: string) => {
  const map: Record<string, string> = {
    success: 'bg-white border-green-200',
    error: 'bg-white border-red-200',
    warning: 'bg-white border-yellow-200',
    info: 'bg-white border-blue-200',
  };
  return map[type || 'info'] || 'bg-white border-gray-200';
};
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to { opacity: 0; transform: translateX(100%); }
</style>
