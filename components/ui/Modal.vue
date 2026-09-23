<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
          @click="$emit('close')"
          aria-hidden="true"
        ></div>

        <!-- Modal Panel -->
        <div 
          class="relative bg-white rounded-xl shadow-2xl w-full flex flex-col overflow-hidden"
          :class="maxWidthClass"
        >
          <!-- Header -->
          <div v-if="title" class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
            <button 
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <!-- Close button if no header -->
          <button 
            v-else
            @click="$emit('close')"
            class="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 bg-white/80 p-1 rounded-md backdrop-blur shadow-sm"
          >
            <X class="w-5 h-5" />
          </button>

          <!-- Body -->
          <div class="px-6 py-4 overflow-y-auto max-h-[70vh]">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: 'md' // sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, full
  }
});

defineEmits(['close']);

const maxWidthClass = computed(() => {
  const map: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    'full': 'max-w-full m-4',
  };
  return map[props.maxWidth] || 'max-w-md';
});
</script>
