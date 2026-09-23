<template>
  <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Previous
      </button>
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages || totalPages === 0"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Next
      </button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{{ startIndex }}</span>
          to
          <span class="font-medium">{{ endIndex }}</span>
          of
          <span class="font-medium">{{ total }}</span>
          results
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button 
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
          >
            <span class="sr-only">Previous</span>
            <ChevronLeft class="h-5 w-5" aria-hidden="true" />
          </button>
          
          <button
            v-for="page in pages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              page === currentPage 
                ? 'relative z-10 inline-flex items-center bg-brand px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand' 
                : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            ]"
          >
            {{ page }}
          </button>

          <button 
            @click="nextPage"
            :disabled="currentPage === totalPages || totalPages === 0"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
          >
            <span class="sr-only">Next</span>
            <ChevronRight class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
}>();

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
}>();

const startIndex = computed(() => {
  if (props.total === 0) return 0;
  return (props.currentPage - 1) * props.limit + 1;
});

const endIndex = computed(() => {
  return Math.min(props.currentPage * props.limit, props.total);
});

const pages = computed(() => {
  const visiblePages = 5;
  let start = Math.max(1, props.currentPage - Math.floor(visiblePages / 2));
  let end = Math.min(props.totalPages, start + visiblePages - 1);

  if (end - start + 1 < visiblePages) {
    start = Math.max(1, end - visiblePages + 1);
  }

  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
});

const prevPage = () => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1);
  }
};

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('update:currentPage', props.currentPage + 1);
  }
};

const goToPage = (page: number) => {
  emit('update:currentPage', page);
};
</script>
