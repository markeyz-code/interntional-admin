<template>
  <UiModal 
    :isOpen="isOpen" 
    @close="$emit('close')"
    maxWidth="5xl"
    :title="title"
  >
    <div class="flex flex-col items-center justify-center min-h-[500px] w-full bg-gray-100 rounded-lg overflow-hidden relative">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
        <UiTableSpinner />
      </div>

      <!-- PDF Viewer -->
      <iframe 
        v-if="isPdf"
        :src="fileUrl"
        class="w-full h-[70vh] border-0"
        @load="loading = false"
      ></iframe>

      <!-- Image Viewer -->
      <img 
        v-else-if="isImage"
        :src="fileUrl"
        class="max-w-full max-h-[70vh] object-contain"
        @load="loading = false"
        @error="handleError"
        alt="Asset preview"
      />

      <!-- Unsupported / Error -->
      <div v-else class="text-center p-8">
        <p class="text-red-500 mb-2">Unable to preview this file type.</p>
        <a :href="fileUrl" target="_blank" class="text-brand hover:underline font-medium">
          Open in new tab instead
        </a>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import UiModal from './Modal.vue';
import UiTableSpinner from './TableSpinner.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    default: 'unknown'
  },
  title: {
    type: String,
    default: 'Asset Preview'
  }
});

defineEmits(['close']);

const loading = ref(true);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loading.value = true;
  }
});

const isPdf = computed(() => {
  return props.fileType.toLowerCase() === 'pdf' || props.fileUrl.toLowerCase().endsWith('.pdf');
});

const isImage = computed(() => {
  const t = props.fileType.toLowerCase();
  if (['image', 'jpg', 'jpeg', 'png', 'gif', 'webp'].includes(t)) return true;
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(props.fileUrl);
});

const handleError = () => {
  loading.value = false;
};
</script>
