<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Roles & Permissions</h1>
        <p class="text-sm text-gray-500 mt-1">Manage user roles, department assignments, and granular permissions across the platform.</p>
      </div>
      <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">
        <button @click="isExportModalOpen = true" class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
          Export Data
        </button>
        <button @click="refreshAll" class="px-4 py-2 text-sm font-medium bg-brand text-white rounded hover:bg-[#1f4e70] transition-colors">
          Refresh
        </button>
        <UiViewToggle v-model="viewMode" />
      </div>
    </div>

    <!-- Stats Summary -->
    <div v-if="userStats" class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Total Users</span>
        <p class="text-lg font-bold text-gray-900">{{ userStats.totalUsers }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Pending</span>
        <p class="text-lg font-bold text-yellow-600">{{ userStats.pendingUsers }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Approved</span>
        <p class="text-lg font-bold text-green-600">{{ userStats.approvedUsers }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Active Subs</span>
        <p class="text-lg font-bold text-brand">{{ userStats.activeSubscriptions }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Recent Signups</span>
        <p class="text-lg font-bold text-blue-600">{{ userStats.recentSignups }}</p>
      </div>
    </div>

    <!-- Role & Department Breakdown -->
    <div v-if="userStats" class="grid md:grid-cols-2 gap-6">
      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Role Breakdown</h2>
        <div class="space-y-3">
          <div v-for="(count, role) in userStats.roleBreakdown" :key="role" class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 capitalize">{{ (role as string).replace(/_/g, ' ').toLowerCase() }}</span>
            <span class="px-2.5 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-700">{{ count }}</span>
          </div>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Department Breakdown</h2>
        <div class="space-y-3">
          <div v-for="(count, dept) in userStats.departmentBreakdown" :key="dept" class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 capitalize">{{ (dept as string).replace(/_/g, ' ').toLowerCase() }}</span>
            <span class="px-2.5 py-1 text-xs font-bold rounded-full bg-brand/10 text-brand">{{ count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <UiTableSpinner />
      <p class="text-gray-500 mt-4">Loading users...</p>
    </div>

    <div v-else class="space-y-6">
      
      <!-- Users Header with Filters -->
      <div class="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-gray-900">All Users</h2>
          <p class="text-sm text-gray-500">{{ total }} users total</p>
        </div>
      </div>
      
      <UiTableFilters 
        v-model="filters" 
        :roleOptions="[
          { label: 'Admin', value: 'ADMIN' },
          { label: 'Moderator', value: 'MODERATOR' },
          { label: 'Department Head', value: 'DEPARTMENT_HEAD' },
          { label: 'Intern Member', value: 'INTERN_MEMBER' },
          { label: 'Alumni Member', value: 'ALUMNI_MEMBER' }
        ]"
      />

      <!-- Grid Layout -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        <div v-if="loading" class="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <UiTableSpinner />
        </div>
        <div v-for="user in allUsers" :key="user._id" class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div class="p-5 flex-1">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                <div class="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold flex-shrink-0">
                  {{ user.firstName?.[0] }}{{ user.lastName?.[0] }}
                </div>
                <div class="overflow-hidden">
                  <h3 class="text-base font-bold text-gray-900 truncate">{{ user.firstName }} {{ user.lastName }}</h3>
                  <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                </div>
              </div>
            </div>
            
            <div class="space-y-3 mb-4">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                <span class="px-2.5 py-1 text-xs font-medium rounded-full inline-block" :class="{
                  'bg-green-100 text-green-700': user.status === 'APPROVED',
                  'bg-yellow-100 text-yellow-700': user.status === 'PENDING',
                  'bg-red-100 text-red-700': user.status === 'REJECTED',
                }">{{ user.status }}</span>
              </div>
              
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Role</label>
                <p class="text-sm text-gray-900 capitalize">{{ user.role.replace(/_/g, ' ') }}</p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Department</label>
                <p class="text-sm text-gray-900 capitalize">{{ user.department?.replace(/_/g, ' ') || 'General' }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
            <span class="text-xs text-gray-500">
              Last Login: {{ user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never' }}
            </span>
            <div class="flex items-center gap-3">
              <button
                @click="openPermissionsModal(user)"
                class="text-xs font-medium text-brand hover:underline"
              >
                {{ (user.permissions || []).length }} permissions
              </button>
              <div class="w-px h-3 bg-gray-300"></div>
              <button
                @click="openEditModal(user)"
                class="text-xs font-medium text-brand hover:underline"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- List Layout (Table) -->
      <div v-else-if="viewMode === 'list'" class="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">User</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Department</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Permissions</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Last Login</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 relative">
            <div v-if="loading" class="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
              <UiTableSpinner />
            </div>
            <tr v-for="user in allUsers" :key="user._id" class="hover:bg-gray-50 transition-colors">
              <td class="p-4">
                <p class="font-medium text-gray-900 text-sm">{{ user.firstName }} {{ user.lastName }}</p>
                <p class="text-xs text-gray-500">{{ user.email }}</p>
              </td>
              <td class="p-4">
                <span class="px-2.5 py-1 text-xs font-medium rounded-full" :class="{
                  'bg-green-100 text-green-700': user.status === 'APPROVED',
                  'bg-yellow-100 text-yellow-700': user.status === 'PENDING',
                  'bg-red-100 text-red-700': user.status === 'REJECTED',
                }">{{ user.status }}</span>
              </td>
              <td class="p-4 text-sm text-gray-700 capitalize">
                {{ user.role.replace(/_/g, ' ') }}
              </td>
              <td class="p-4 text-sm text-gray-700 capitalize">
                {{ user.department?.replace(/_/g, ' ') || 'General' }}
              </td>
              <td class="p-4">
                <button
                  @click="openPermissionsModal(user)"
                  class="text-xs font-medium text-brand hover:underline"
                >
                  {{ (user.permissions || []).length }} permissions
                </button>
              </td>
              <td class="p-4 text-xs text-gray-500">
                {{ user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never' }}
              </td>
              <td class="p-4 text-right">
                <button @click="openEditModal(user)" class="text-xs font-medium text-brand hover:underline">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
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

    <!-- Permissions Modal -->
    <Teleport to="body">
      <div v-if="showPermModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50" @click.self="showPermModal = false">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-bold text-gray-900 mb-1">Edit Permissions</h3>
          <p class="text-sm text-gray-500 mb-6">{{ editingUser?.firstName }} {{ editingUser?.lastName }}</p>

          <div class="space-y-3 max-h-80 overflow-y-auto">
            <label
              v-for="perm in allPermissions"
              :key="perm"
              class="flex items-center gap-3 w-full sm:w-auto flex-wrap p-3 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                :checked="selectedPermissions.includes(perm)"
                @change="togglePermission(perm)"
                class="rounded border-gray-300 text-brand focus:ring-brand"
              />
              <div>
                <span class="text-sm font-medium text-gray-900 capitalize">{{ perm.replace(/_/g, ' ') }}</span>
              </div>
            </label>
          </div>

          <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button @click="showPermModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
            <button @click="savePermissions" class="px-6 py-2 text-sm font-medium text-white bg-brand rounded hover:bg-[#1f4e70]">Save</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit Role & Dept Modal -->
    <Teleport to="body">
      <div v-if="showEditModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50" @click.self="showEditModal = false">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-bold text-gray-900 mb-1">Edit Role & Department</h3>
          <p class="text-sm text-gray-500 mb-6">{{ editingUser?.firstName }} {{ editingUser?.lastName }}</p>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <UiSelect 
                v-model="editForm.role"
                label=""
                :options="roles.map(r => ({ label: r.replace(/_/g, ' '), value: r }))"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <UiSelect 
                v-model="editForm.department"
                label=""
                :options="departments.map(d => ({ label: d.replace(/_/g, ' '), value: d }))"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button @click="showEditModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
            <button @click="showConfirmModal = true" class="px-6 py-2 text-sm font-medium text-white bg-brand rounded hover:bg-[#1f4e70]">Update</button>
          </div>
        </div>
      </div>
    </Teleport>
    
    <UiConfirmationModal
      :isOpen="showConfirmModal"
      title="Confirm Update"
      message="Are you sure you want to update this user's role and department?"
      confirmText="Update"
      cancelText="Cancel"
      @confirm="saveEditRoleDept"
      @close="showConfirmModal = false"
    />

    <UiExportModal
      :isOpen="isExportModalOpen"
      :data="allUsers"
      :availableFields="[
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'department', label: 'Department' },
        { key: 'permissions', label: 'Permissions' },
        { key: 'createdAt', label: 'Joined Date' }
      ]"
      filename="roles_export"
      @close="isExportModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSeoMeta } from '#imports';
import { useRoles } from '@/composables/modules/roles/useRoles';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';
import UiViewToggle from '@/components/ui/ViewToggle.vue';
import UiTableFilters from '@/components/ui/TableFilters.vue';
import UiPagination from '@/components/ui/Pagination.vue';
import UiExportModal from '@/components/ui/ExportModal.vue';
import UiSelect from '@/components/ui/Select.vue';
import UiConfirmationModal from '@/components/ui/ConfirmationModal.vue';

useSeoMeta({ title: 'Roles & Permissions | Admin Dashboard' });

const { loading, allUsers, userStats, filters, total, totalPages, fetchAllUsers, fetchUserStats, updateUserRole, updateUserDepartment, updateUserPermissions } = useRoles();

const viewMode = ref<'list' | 'grid'>('list');
const isExportModalOpen = ref(false);
const showPermModal = ref(false);
const showEditModal = ref(false);
const showConfirmModal = ref(false);
const editingUser = ref<any>(null);
const selectedPermissions = ref<string[]>([]);
const editForm = ref({ role: '', department: '' });

const roles = ['ADMIN', 'MODERATOR', 'DEPARTMENT_HEAD', 'INTERN_MEMBER', 'ALUMNI_MEMBER'];
const departments = ['HEMATOLOGY', 'CHEMICAL_PATHOLOGY', 'MICROBIOLOGY', 'HISTOPATHOLOGY', 'MEDICAL_VIROLOGY', 'GENERAL'];
const allPermissions = [
  'manage_users',
  'approve_documents',
  'manage_subscriptions',
  'manage_payments',
  'manage_content',
  'view_analytics',
  'manage_jobs',
  'manage_enquiries',
  'manage_roles',
];

const handleRoleChange = async (userId: string, role: string) => {
  await updateUserRole(userId, role);
};

const handleDepartmentChange = async (userId: string, department: string) => {
  await updateUserDepartment(userId, department);
};

const openEditModal = (user: any) => {
  editingUser.value = user;
  editForm.value = { role: user.role, department: user.department || 'GENERAL' };
  showEditModal.value = true;
};

const saveEditRoleDept = async () => {
  showConfirmModal.value = false;
  if (!editingUser.value) return;
  
  if (editingUser.value.role !== editForm.value.role) {
    await updateUserRole(editingUser.value._id, editForm.value.role);
  }
  if (editingUser.value.department !== editForm.value.department) {
    await updateUserDepartment(editingUser.value._id, editForm.value.department);
  }
  showEditModal.value = false;
};

const openPermissionsModal = (user: any) => {
  editingUser.value = user;
  selectedPermissions.value = [...(user.permissions || [])];
  showPermModal.value = true;
};

const togglePermission = (perm: string) => {
  const idx = selectedPermissions.value.indexOf(perm);
  if (idx >= 0) {
    selectedPermissions.value.splice(idx, 1);
  } else {
    selectedPermissions.value.push(perm);
  }
};

const savePermissions = async () => {
  if (editingUser.value) {
    const success = await updateUserPermissions(editingUser.value._id, selectedPermissions.value);
    if (success) showPermModal.value = false;
  }
};

const refreshAll = async () => {
  await Promise.all([fetchAllUsers(), fetchUserStats()]);
};

onMounted(() => { refreshAll(); });
</script>
