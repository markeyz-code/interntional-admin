<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="close">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Create Course</h2>
            <p class="text-sm text-gray-500 mt-1">Design a new masterclass or educational course.</p>
          </div>
          <button @click="close" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-1 space-y-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Course Title <span class="text-red-500">*</span></label>
            <input v-model="form.title" type="text" placeholder="e.g. Advanced Vue.js Masterclass" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm">
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Description <span class="text-red-500">*</span></label>
            <textarea v-model="form.description" rows="4" placeholder="Describe the course content..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-gray-700">Price ($) <span class="text-gray-400">(Leave 0 for free)</span></label>
              <input v-model="form.price" type="number" min="0" placeholder="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm">
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-gray-700">Level <span class="text-red-500">*</span></label>
              <UiCombobox v-model="form.level" :options="['BEGINNER', 'INTERMEDIATE', 'ADVANCED']" placeholder="Select level" />
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-100 bg-white flex items-center justify-end gap-3">
          <button @click="close" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button 
            @click="submit" 
            :disabled="loading || !form.title || !form.description || !form.level"
            class="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-[#1f4e70] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>Create Course</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { X } from 'lucide-vue-next';
import UiCombobox from '@/components/ui/Combobox.vue';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'success']);

const loading = ref(false);
const form = reactive({
  title: '',
  description: '',
  price: '0',
  level: ''
});

const close = () => {
  emit('close');
  form.title = '';
  form.description = '';
  form.price = '0';
  form.level = '';
};

const submit = async () => {
  loading.value = true;
  try {
    await new Promise(res => setTimeout(res, 1000));
    alert('Course created successfully!');
    emit('success');
    close();
  } catch (error) {
    console.error('Failed to create course:', error);
  } finally {
    loading.value = false;
  }
};
</script>
