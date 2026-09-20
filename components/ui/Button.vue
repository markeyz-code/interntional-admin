<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
      variantStyles[variant],
      sizeStyles[size]
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <Loader2 v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Loader2 } from 'lucide-vue-next';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

const variantStyles: Record<string, string> = {
  primary: 'bg-brand text-white hover:bg-[#1f4e70] focus:ring-brand',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
  outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const sizeStyles: Record<string, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
};
</script>
