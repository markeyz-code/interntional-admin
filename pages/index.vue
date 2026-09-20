<template>
  <div class="space-y-6">
    <div class="bg-white p-6 border border-gray-200 rounded-lg flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Pending User Approvals</h1>
        <p class="text-sm text-gray-500 mt-1">Approving a user grants access and starts their 24-month intern subscription timer.</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading">
      <UiTableSpinner />
    </div>

    <!-- Cards Layout -->
    <div v-else-if="pendingUsers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="user in pendingUsers" :key="user._id" class="bg-white rounded-lg border border-gray-200 flex flex-col">
        <div class="p-5 flex-1">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold flex-shrink-0">
              {{ user.firstName?.[0] }}{{ user.lastName?.[0] }}
            </div>
            <div class="overflow-hidden">
              <h3 class="text-base font-bold text-gray-900 truncate">{{ user.firstName }} {{ user.lastName }}</h3>
              <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded p-3 border border-gray-200 flex items-center justify-between">
             <div class="flex items-center gap-2 text-xs font-medium text-gray-700">
               <UserCheck class="w-4 h-4 text-gray-400" />
               Verification Doc
             </div>
             <a :href="user.verificationFileUrl" target="_blank" class="text-brand hover:text-blue-800 text-xs font-medium hover:underline transition-all">
               View File ↗
             </a>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-0 border-t border-gray-200">
          <button
            @click="confirmReject(user._id)"
            :disabled="approveLoading === user._id"
            class="py-3 text-xs font-medium text-red-600 hover:bg-red-50 border-r border-gray-200 transition-colors disabled:opacity-50"
          >
            Reject
          </button>
          <button
            @click="handleApprove(user._id)"
            :disabled="approveLoading === user._id"
            class="py-3 text-xs font-medium text-brand hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            <span v-if="approveLoading === user._id">Processing...</span>
            <span v-else>Approve</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else>
      <UiEmptyState 
        title="All caught up!" 
        description="There are no pending applications waiting for your review." 
        :icon="UsersIcon" 
      />
    </div>

    <!-- Confirmation Modal -->
    <UiConfirmationModal
      :isOpen="isRejectModalOpen"
      title="Reject Applicant"
      message="Are you sure you want to reject this applicant?"
      confirmText="Reject"
      @confirm="handleReject"
      @cancel="closeRejectModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '#imports';

useSeoMeta({
  title: 'Admin Dashboard - InternTional',
  description: 'Manage users, approvals, and content for the InternTional community.',
  ogTitle: 'Admin Dashboard - InternTional',
  ogDescription: 'Manage users, approvals, and content for the InternTional community.',
  ogImage: 'https://images.unsplash.com/photo-1579154204601-52ee6c23b202?q=80&w=2000&auto=format&fit=crop',
  twitterCard: 'summary_large_image',
})

import { ref, onMounted } from 'vue';
import { UserCheck, Users as UsersIcon } from 'lucide-vue-next';
import { useGetPendingUsers } from '@/composables/modules/users/useGetPendingUsers';
import { useApproveUser } from '@/composables/modules/users/useApproveUser';
import UiEmptyState from '@/components/ui/EmptyState.vue';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';
import UiConfirmationModal from '@/components/ui/ConfirmationModal.vue';

const { loading, pendingUsers, getPendingUsers } = useGetPendingUsers();
const { loading: approveLoading, approveUser, rejectUser } = useApproveUser();

const isRejectModalOpen = ref(false);
const selectedUserId = ref<string | null>(null);

const confirmReject = (id: string) => {
  selectedUserId.value = id;
  isRejectModalOpen.value = true;
};

const closeRejectModal = () => {
  isRejectModalOpen.value = false;
  selectedUserId.value = null;
};

const handleApprove = async (id: string) => {
  const result = await approveUser(id);
  if (result) pendingUsers.value = pendingUsers.value.filter((u) => u._id !== id);
};

const handleReject = async () => {
  if (selectedUserId.value) {
    const result = await rejectUser(selectedUserId.value);
    if (result) pendingUsers.value = pendingUsers.value.filter((u) => u._id !== selectedUserId.value);
    closeRejectModal();
  }
};

onMounted(() => getPendingUsers());
</script>
