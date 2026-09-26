<template>
  <div class="space-y-6">
    <div class="bg-white p-6 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
      <div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Pending Approvals</h1>
        <p class="text-sm text-gray-500 mt-1">Review and approve or reject new account registrations.</p>
      </div>
      <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">
        <UiViewToggle v-model="viewMode" />
      </div>
    </div>

    <!-- Filters -->
    <UiTableFilters 
      v-model="filters" 
      :roleOptions="[
        { label: 'Admin', value: 'admin' },
        { label: 'Moderator', value: 'moderator' },
        { label: 'Alumni', value: 'alumni_member' },
        { label: 'Intern', value: 'intern_member' }
      ]"
    />

    <!-- Loading -->
    <div v-if="loading && pendingUsers.length === 0">
      <UiTableSpinner />
    </div>

    <div v-else-if="pendingUsers.length > 0" class="relative">
      <div v-if="loading" class="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
        <UiTableSpinner />
      </div>
      
      <!-- Grid Layout -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="user in pendingUsers" :key="user._id" class="bg-white rounded-lg border border-gray-200 flex flex-col">
          <div class="p-5 flex-1">
            <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap mb-4">
              <div class="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold flex-shrink-0">
                {{ user.firstName?.[0] }}{{ user.lastName?.[0] }}
              </div>
              <div class="overflow-hidden">
                <h3 class="text-base font-bold text-gray-900 truncate">{{ user.firstName }} {{ user.lastName }}</h3>
                <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs mb-4">
              <div>
                <span class="text-gray-500 block mb-1">Role</span>
                <span class="font-medium text-gray-900">{{ user.role.replace('_', ' ') }}</span>
              </div>
              <div>
                <span class="text-gray-500 block mb-1">Department</span>
                <span class="font-medium text-gray-900 capitalize">{{ user.department.toLowerCase().replace('_', ' ') }}</span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-0 border-t border-gray-200">
            <button 
              @click="confirmApprove(user)"
              :disabled="actionLoading === user._id"
              class="py-3 text-xs font-medium text-green-600 hover:bg-green-50 border-r border-gray-200 transition-colors disabled:opacity-50"
            >
              <span v-if="actionLoading === user._id">Processing...</span>
              <span v-else>Approve</span>
            </button>
            <button 
              @click="confirmReject(user)"
              :disabled="actionLoading === user._id"
              class="py-3 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <span v-if="actionLoading === user._id">Processing...</span>
              <span v-else>Reject</span>
            </button>
          </div>
        </div>
      </div>

      <!-- List Layout (Table) -->
      <div v-else-if="viewMode === 'list'" class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="w-full overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-4 font-semibold text-gray-900">User</th>
              <th scope="col" class="px-6 py-4 font-semibold text-gray-900">Email</th>
              <th scope="col" class="px-6 py-4 font-semibold text-gray-900">Role</th>
              <th scope="col" class="px-6 py-4 font-semibold text-gray-900">Department</th>
              <th scope="col" class="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="user in pendingUsers" :key="user._id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                  <div class="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                    {{ user.firstName?.[0] }}{{ user.lastName?.[0] }}
                  </div>
                  <div class="font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {{ user.role.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600 capitalize">
                {{ user.department.toLowerCase().replace('_', ' ') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right font-medium">
                <div class="flex items-center justify-end gap-3">
                  <button 
                    @click="confirmApprove(user)"
                    :disabled="actionLoading === user._id"
                    class="text-green-600 hover:text-green-900 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button 
                    @click="confirmReject(user)"
                    :disabled="actionLoading === user._id"
                    class="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      <!-- Pagination -->
      <UiPagination 
        class="mt-6"
        v-model:currentPage="filters.page"
        :totalPages="totalPages"
        :total="total"
        :limit="filters.limit"
      />
    </div>

    <!-- Empty State -->
    <div v-else>
      <UiEmptyState 
        title="No pending approvals" 
        description="There are currently no new account registrations waiting for review." 
        :icon="UsersIcon" 
      />
    </div>

    <!-- Confirmation Modal for Approve -->
    <UiConfirmationModal 
      :isOpen="showApproveModal"
      title="Approve User"
      :message="`Are you sure you want to approve ${selectedUser?.firstName}'s account? An email will be sent to them to set up their password.`"
      confirmText="Approve"
      @confirm="handleApprove"
      @close="showApproveModal = false"
    />

    <!-- Confirmation Modal for Reject -->
    <UiConfirmationModal 
      :isOpen="showRejectModal"
      title="Reject User"
      :message="`Are you sure you want to reject ${selectedUser?.firstName}'s application? They will be notified via email.`"
      confirmText="Reject Application"
      @confirm="handleReject"
      @close="showRejectModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '#imports';
import { ref, onMounted } from 'vue';
import { Users as UsersIcon } from 'lucide-vue-next';
import { useGetPendingUsers } from '@/composables/modules/users/useGetPendingUsers';
import { useApproveUser } from '@/composables/modules/users/useApproveUser';
import UiEmptyState from '@/components/ui/EmptyState.vue';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';
import UiViewToggle from '@/components/ui/ViewToggle.vue';
import UiTableFilters from '@/components/ui/TableFilters.vue';
import UiPagination from '@/components/ui/Pagination.vue';
import UiConfirmationModal from '@/components/ui/ConfirmationModal.vue';

useSeoMeta({
  title: 'Pending Approvals - Admin Dashboard',
})

const { loading, pendingUsers, filters, total, totalPages, getPendingUsers } = useGetPendingUsers();
const { loading: actionLoading, approveUser, rejectUser } = useApproveUser();

const viewMode = ref<'list' | 'grid'>('list');

// Confirmation Logic
const showApproveModal = ref(false);
const showRejectModal = ref(false);
const selectedUser = ref<any>(null);

const confirmApprove = (user: any) => {
  selectedUser.value = user;
  showApproveModal.value = true;
};

const confirmReject = (user: any) => {
  selectedUser.value = user;
  showRejectModal.value = true;
};

const handleApprove = () => {
  if (selectedUser.value) {
    approveUser(selectedUser.value._id).then(() => {
      getPendingUsers(); // Refresh table
      showApproveModal.value = false;
    });
  }
};

const handleReject = () => {
  if (selectedUser.value) {
    rejectUser(selectedUser.value._id).then(() => {
      getPendingUsers(); // Refresh table
      showRejectModal.value = false;
    });
  }
};

onMounted(() => getPendingUsers());
</script>
