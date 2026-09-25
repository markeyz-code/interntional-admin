<template>
  <div class="space-y-6">
    <div class="bg-white p-6 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
      <div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Active Users</h1>
        <p class="text-sm text-gray-500 mt-1">Manage approved users across the platform.</p>
      </div>
      <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">
        <button @click="isExportModalOpen = true" class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
          Export Data
        </button>
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
    <div v-if="loading && users.length === 0">
      <UiTableSpinner />
    </div>

    <div v-else-if="users.length > 0" class="relative">
      <div v-if="loading" class="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
        <UiTableSpinner />
      </div>
      
      <!-- Grid Layout -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="user in users" :key="user._id" class="bg-white rounded-lg border border-gray-200 flex flex-col">
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
          <div class="grid gap-0 border-t border-gray-200">
            <button 
              @click="confirmRevoke(user)"
              :disabled="revokeLoading === user._id"
              class="py-3 text-xs font-medium text-red-600 hover:bg-red-50 border-r border-gray-200 transition-colors disabled:opacity-50"
            >
              <span v-if="revokeLoading === user._id">Processing...</span>
              <span v-else>Revoke Access</span>
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
            <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50 transition-colors">
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
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ user.role.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600 capitalize">
                {{ user.department.toLowerCase().replace('_', ' ') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right font-medium">
                <button 
                  @click="confirmRevoke(user)"
                  :disabled="revokeLoading === user._id"
                  class="text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  <span v-if="revokeLoading === user._id">Processing...</span>
                  <span v-else>Revoke</span>
                </button>
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
        title="No active users found" 
        description="Try adjusting your filters or there are currently no approved users." 
        :icon="UsersIcon" 
      />
    </div>

    <!-- Confirmation Modal -->
    <UiConfirmationModal 
      :isOpen="showConfirmModal"
      title="Revoke Access"
      :message="`Are you sure you want to revoke access for ${selectedUser?.firstName}? They will no longer be able to log in.`"
      confirmText="Revoke Access"
      @confirm="handleRevoke"
      @close="showConfirmModal = false"
    />
    
    <UiExportModal
      :isOpen="isExportModalOpen"
      :data="users"
      :availableFields="[
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'department', label: 'Department' },
        { key: 'createdAt', label: 'Joined Date' }
      ]"
      filename="users_export"
      @close="isExportModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '#imports';

useSeoMeta({
  title: 'Active Users - Admin Dashboard',
})

import { ref, onMounted } from 'vue';
import { Users as UsersIcon } from 'lucide-vue-next';
import { useGetActiveUsers } from '@/composables/modules/users/useGetActiveUsers';
import { useRevokeUser } from '@/composables/modules/users/useRevokeUser';
import UiEmptyState from '@/components/ui/EmptyState.vue';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';
import UiViewToggle from '@/components/ui/ViewToggle.vue';
import UiTableFilters from '@/components/ui/TableFilters.vue';
import UiPagination from '@/components/ui/Pagination.vue';
import UiConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import UiExportModal from '@/components/ui/ExportModal.vue';

const { loading, users, filters, total, totalPages, fetchActiveUsers } = useGetActiveUsers();
const { loading: revokeLoading, revokeUser } = useRevokeUser();

const viewMode = ref<'list' | 'grid'>('list');
const isExportModalOpen = ref(false);

// Revoke Confirmation Logic
const showConfirmModal = ref(false);
const selectedUser = ref<any>(null);

const confirmRevoke = (user: any) => {
  selectedUser.value = user;
  showConfirmModal.value = true;
};

const handleRevoke = () => {
  if (selectedUser.value) {
    revokeUser(selectedUser.value._id, () => {
      fetchActiveUsers(); // Refresh table
      showConfirmModal.value = false;
    });
  }
};

onMounted(() => fetchActiveUsers());
</script>
