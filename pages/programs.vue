<template>
  <div class="space-y-6">
    <div class="bg-white p-6 border border-gray-200 rounded-lg flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Programs</h1>
        <p class="text-sm text-gray-500 mt-1">Manage academic programs and courses.</p>
      </div>
      <button class="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm">
        + Create Program
      </button>
    </div>

    <!-- Filters -->
    <UiTableFilters 
      v-model="filters" 
      :statusOptions="[
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' }
      ]"
    />

    <!-- Empty State -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="p-12 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No Programs Found</h3>
        <p class="text-gray-500 mt-1">There are no academic programs configured yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSeoMeta } from '#imports';
import UiTableFilters from '@/components/ui/TableFilters.vue';

useSeoMeta({
  title: 'Programs - UniVerse Dashboard',
});

const filters = ref({
  search: '',
  status: '',
  role: '',
  startDate: '',
  endDate: ''
});
</script>
