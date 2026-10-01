<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Services & Bounties</h1>
        <p class="text-sm text-gray-500 mt-1">Manage gigs, service requests, and platform bounties.</p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="isCreateModalOpen = true" class="px-4 py-2 text-sm font-medium bg-brand text-white rounded hover:bg-[#1f4e70] transition-colors">
          Create Bounty
        </button>
      </div>
    </div>

    <UiCreateBountyModal :isOpen="isCreateModalOpen" @close="isCreateModalOpen = false" @success="handleSuccess" />

    <!-- Empty state for now -->
    <div class="bg-white border border-gray-200 rounded-lg py-20 px-6 flex flex-col items-center justify-center text-center">
      <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <Target class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-bold text-gray-900">No bounties found</h3>
      <p class="text-gray-500 mt-2 max-w-md">Bounty and service management is ready. You can start creating or managing bounties here.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSeoMeta } from '#imports';
import { Target } from 'lucide-vue-next';
import UiCreateBountyModal from '@/components/ui/CreateBountyModal.vue';

useSeoMeta({ title: 'Bounties | Admin Dashboard' });

const isCreateModalOpen = ref(false);

const handleSuccess = () => {
  console.log('Bounty created. Refreshing list...');
};
</script>
