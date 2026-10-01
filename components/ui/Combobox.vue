<template>
  <div class="relative" ref="dropdownRef">
    <div class="relative">
      <input
        ref="inputRef"
        type="text"
        :value="modelValue"
        @input="onInput"
        @focus="isOpen = true"
        :placeholder="placeholder"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm bg-white pr-10"
      />
      <button 
        type="button" 
        @click="isOpen = !isOpen" 
        class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <svg class="h-5 w-5 transition-transform" :class="{'rotate-180': isOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
    </div>

    <transition
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ul
        v-if="isOpen && (filteredOptions.length > 0 || customInputVisible)"
        class="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      >
        <li
          v-for="option in filteredOptions"
          :key="option"
          @click="selectOption(option)"
          class="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-brand/5 text-gray-900"
        >
          <span class="block truncate" :class="modelValue === option ? 'font-semibold text-brand' : 'font-normal'">
            {{ option }}
          </span>
          <span v-if="modelValue === option" class="absolute inset-y-0 right-0 flex items-center pr-4 text-brand">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </span>
        </li>
        <li
          v-if="customInputVisible"
          @click="selectOption(modelValue)"
          class="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-brand/5 text-brand font-medium border-t border-gray-100"
        >
          Create "{{ modelValue }}"
        </li>
        <li
          v-if="!modelValue"
          @click="focusInput"
          class="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-brand/5 text-brand font-medium border-t border-gray-100 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Add Custom {{ placeholder?.includes('role') ? 'Role' : 'Department' }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  modelValue: string;
  options: string[];
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const filteredOptions = computed(() => {
  if (!props.modelValue) return props.options;
  return props.options.filter(opt => opt.toLowerCase().includes(props.modelValue.toLowerCase()));
});

const customInputVisible = computed(() => {
  if (!props.modelValue) return false;
  // If the exact typed value exists in options, don't show "Create"
  return !props.options.some(opt => opt.toLowerCase() === props.modelValue.toLowerCase());
});

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
  isOpen.value = true;
};

const inputRef = ref<HTMLInputElement | null>(null);

const focusInput = () => {
  if (inputRef.value) {
    inputRef.value.focus();
  }
};

const selectOption = (option: string) => {
  emit('update:modelValue', option);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
