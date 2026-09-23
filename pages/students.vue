<template>
  <div class="space-y-6">
    <div class="bg-white p-6 border border-gray-200 rounded-lg flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Students</h1>
        <p class="text-sm text-gray-500 mt-1">Manage enrolled students and their profiles.</p>
      </div>
      <button class="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm">
        + Add Student
      </button>
    </div>

    <!-- Filters -->
    <UiTableFilters 
      v-model="filters" 
      :statusOptions="[
        { label: 'Enrolled', value: 'enrolled' },
        { label: 'Graduated', value: 'graduated' },
        { label: 'Suspended', value: 'suspended' }
      ]"
    />

    <!-- Empty State -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="p-12 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No Students Found</h3>
        <p class="text-gray-500 mt-1">There are no students matching your criteria.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSeoMeta } from '#imports';
import UiTableFilters from '@/components/ui/TableFilters.vue';

useSeoMeta({
  title: 'Students - UniVerse Dashboard',
});

const filters = ref({
  search: '',
  status: '',
  role: '',
  startDate: '',
  endDate: ''
});
</script>
