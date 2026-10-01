<template>
  <div class="flex items-center bg-gray-100 rounded-lg p-1">
    <button 
      @click="$emit('update:modelValue', 'list')"
      :class="[
        'p-1.5 rounded-md transition-all duration-200 focus:outline-none flex items-center justify-center',
        modelValue === 'list' 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
      ]"
      title="List View"
    >
      <List class="w-4 h-4" />
    </button>
    <button 
      @click="$emit('update:modelValue', 'grid')"
      :class="[
        'p-1.5 rounded-md transition-all duration-200 focus:outline-none flex items-center justify-center',
        modelValue === 'grid' 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
      ]"
      title="Grid View"
    >
      <LayoutGrid class="w-4 h-4" />
    </button>
    <button 
      v-if="allowKanban"
      @click="$emit('update:modelValue', 'kanban')"
      :class="[
        'p-1.5 rounded-md transition-all duration-200 focus:outline-none flex items-center justify-center',
        modelValue === 'kanban' 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
      ]"
      title="Kanban View"
    >
      <Kanban class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { List, LayoutGrid, Kanban } from 'lucide-vue-next';

defineProps<{
  modelValue: 'list' | 'grid' | 'kanban',
  allowKanban?: boolean
}>();

defineEmits<{
  (e: 'update:modelValue', value: 'list' | 'grid' | 'kanban'): void
}>();
</script>
