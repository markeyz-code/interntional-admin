<template>
  <div class="space-y-6">
    <div class="bg-white p-6 border border-gray-200 rounded-lg flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Universities</h1>
        <p class="text-sm text-gray-500 mt-1">Manage partner universities and institutions.</p>
      </div>
      <button class="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm">
        + Add University
      </button>
    </div>

    <!-- Filters -->
    <UiTableFilters 
      v-model="filters" 
      :statusOptions="[
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]"
    />

    <!-- Empty State -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="p-12 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No Universities Found</h3>
        <p class="text-gray-500 mt-1">There are no universities currently registered in the system.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSeoMeta } from '#imports';
import UiTableFilters from '@/components/ui/TableFilters.vue';

useSeoMeta({
  title: 'Universities - UniVerse Dashboard',
});

const filters = ref({
  search: '',
  status: '',
  role: '',
  startDate: '',
  endDate: ''
});
</script>
