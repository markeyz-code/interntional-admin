<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        class="block w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors disabled:opacity-50 disabled:bg-gray-50 appearance-none"
        :required="required"
        :disabled="disabled"
        v-bind="$attrs"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
        <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-gray-500 mt-1">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, PropType } from 'vue';

defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  id: {
    type: String,
    required: true,
  },
  label: String,
  placeholder: String,
  options: {
    type: Array as PropType<Array<{ label: string; value: string | number }>>,
    required: true,
  },
  required: Boolean,
  disabled: Boolean,
  error: String,
  hint: String,
});

defineEmits(['update:modelValue']);
</script>
