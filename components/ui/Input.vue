<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="block w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors disabled:opacity-50 disabled:bg-gray-50"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        v-bind="$attrs"
      />
    </div>
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-gray-500 mt-1">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
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
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  error: String,
  hint: String,
});

defineEmits(['update:modelValue']);
</script>
