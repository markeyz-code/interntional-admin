<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div 
      class="border border-dashed p-6 text-center rounded transition-colors"
      :class="modelValue ? 'border-brand bg-blue-50/30' : 'border-gray-300 hover:border-gray-400 cursor-pointer bg-gray-50'"
      @click="!modelValue && ($refs.fileInput as any).click()"
    >
      <input 
        ref="fileInput" 
        type="file" 
        @change="handleFileUpload" 
        :required="required" 
        :accept="accept" 
        class="hidden" 
      />
      
      <div v-if="!modelValue">
        <component :is="icon" class="mx-auto h-8 w-8 text-gray-400 mb-2" v-if="icon" />
        <p class="text-sm font-medium text-gray-700">{{ placeholder }}</p>
        <p v-if="hint" class="text-xs text-gray-500 mt-1">{{ hint }}</p>
      </div>
      <div v-else class="flex flex-col items-center">
        <component :is="successIcon" class="mx-auto h-8 w-8 text-brand mb-2" v-if="successIcon" />
        <p class="text-sm font-medium text-gray-900 truncate max-w-full">{{ modelValue.name }}</p>
        <button type="button" @click.stop="$emit('update:modelValue', null)" class="text-xs text-red-600 hover:underline mt-2">Remove file</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
  modelValue: {
    type: File,
    default: null
  },
  label: String,
  required: Boolean,
  accept: String,
  placeholder: {
    type: String,
    default: 'Click to upload file'
  },
  hint: String,
  icon: Object,
  successIcon: Object
});

const emit = defineEmits(['update:modelValue']);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.[0]) emit('update:modelValue', target.files[0]);
};
</script>
