<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <textarea
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        class="block w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors disabled:opacity-50 disabled:bg-gray-50 resize-y"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :rows="rows"
        v-bind="$attrs"
      ></textarea>
    </div>
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-gray-500 mt-1">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

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
  required: Boolean,
  disabled: Boolean,
  rows: {
    type: Number,
    default: 4
  },
  error: String,
  hint: String,
});

defineEmits(['update:modelValue']);
</script>
