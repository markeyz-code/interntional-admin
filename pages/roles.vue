<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Roles & Permissions</h1>
        <p class="text-sm text-gray-500 mt-1">Manage user roles, department assignments, and granular permissions across the platform.</p>
      </div>
      <button @click="refreshAll" class="px-4 py-2 text-sm font-medium bg-brand text-white rounded hover:bg-[#1f4e70] transition-colors">
        Refresh
      </button>
    </div>

    <!-- Stats Summary -->
    <div v-if="userStats" class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Total Users</span>
        <p class="text-2xl font-bold text-gray-900">{{ userStats.totalUsers }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Pending</span>
        <p class="text-2xl font-bold text-yellow-600">{{ userStats.pendingUsers }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Approved</span>
        <p class="text-2xl font-bold text-green-600">{{ userStats.approvedUsers }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Active Subs</span>
        <p class="text-2xl font-bold text-brand">{{ userStats.activeSubscriptions }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Recent Signups</span>
        <p class="text-2xl font-bold text-blue-600">{{ userStats.recentSignups }}</p>
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

    <!-- Users Table -->
    <div v-else class="bg-white border border-gray-200 rounded-xl">
      <div class="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-gray-900">All Users</h2>
          <p class="text-sm text-gray-500">{{ allUsers.length }} users total</p>
        </div>
        <!-- Search -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or email..."
          class="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 w-72"
        />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">User</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Department</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Permissions</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Last Login</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in filteredUsers" :key="user._id" class="hover:bg-gray-50 transition-colors">
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
              <td class="p-4">
                <select
                  :value="user.role"
                  @change="handleRoleChange(user._id, ($event.target as HTMLSelectElement).value)"
                  class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-brand/50 bg-white"
                >
                  <option v-for="role in roles" :key="role" :value="role">{{ role.replace(/_/g, ' ') }}</option>
                </select>
              </td>
              <td class="p-4">
                <select
                  :value="user.department || 'GENERAL'"
                  @change="handleDepartmentChange(user._id, ($event.target as HTMLSelectElement).value)"
                  class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-brand/50 bg-white"
                >
                  <option v-for="dept in departments" :key="dept" :value="dept">{{ dept.replace(/_/g, ' ') }}</option>
                </select>
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
            </tr>
          </tbody>
        </table>
      </div>
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
              class="flex items-center gap-3 p-3 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSeoMeta } from '#imports';
import { useRoles } from '@/composables/modules/roles/useRoles';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';

useSeoMeta({ title: 'Roles & Permissions | Admin Dashboard' });

const { loading, allUsers, userStats, fetchAllUsers, fetchUserStats, updateUserRole, updateUserDepartment, updateUserPermissions } = useRoles();

const searchQuery = ref('');
const showPermModal = ref(false);
const editingUser = ref<any>(null);
const selectedPermissions = ref<string[]>([]);

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

const filteredUsers = computed(() => {
  if (!searchQuery.value) return allUsers.value;
  const q = searchQuery.value.toLowerCase();
  return allUsers.value.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q)
  );
});

const handleRoleChange = async (userId: string, role: string) => {
  await updateUserRole(userId, role);
};

const handleDepartmentChange = async (userId: string, department: string) => {
  await updateUserDepartment(userId, department);
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
