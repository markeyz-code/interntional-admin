<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="close">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Invite Team Member</h2>
            <p class="text-sm text-gray-500 mt-1">Send an invitation link with a specific role and permissions.</p>
          </div>
          <button @click="close" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto flex-1 bg-gray-50/50 space-y-8">
        
        <!-- Basic Info -->
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Email Address <span class="text-red-500">*</span></label>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="admin@medlabconvo.com" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm"
            >
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Role <span class="text-red-500">*</span></label>
            <UiCombobox 
              v-model="form.role" 
              :options="availableRoles" 
              placeholder="Select or type custom role..." 
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Department <span class="text-gray-400">(Optional)</span></label>
            <UiCombobox 
              v-model="form.department" 
              :options="['SALES', 'SUPPORT', 'MARKETING', 'TECHNICAL', 'CONTENT', 'GENERAL']" 
              placeholder="Select or type custom department..." 
            />
          </div>
        </div>

        <!-- Granular Permissions Grid -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-md font-bold text-gray-900">Granular Permissions</h3>
              <p class="text-sm text-gray-500">Configure exact access levels for this administrator.</p>
            </div>
            <button @click="toggleSelectAll" class="text-sm font-medium text-brand hover:text-[#1f4e70]">{{ isAllSelected ? 'Unselect All' : 'Select All' }}</button>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Module</th>
                  <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">View</th>
                  <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Create</th>
                  <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Edit</th>
                  <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Delete</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="mod in permissionModules" :key="mod.id" class="hover:bg-gray-50/50">
                  <td class="px-6 py-4">
                    <span class="text-sm font-medium text-gray-900">{{ mod.label }}</span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <input type="checkbox" :value="`view_${mod.id}`" v-model="form.permissions" class="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand">
                  </td>
                  <td class="px-6 py-4 text-center">
                    <input type="checkbox" :value="`create_${mod.id}`" v-model="form.permissions" class="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand">
                  </td>
                  <td class="px-6 py-4 text-center">
                    <input type="checkbox" :value="`edit_${mod.id}`" v-model="form.permissions" class="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand">
                  </td>
                  <td class="px-6 py-4 text-center">
                    <input type="checkbox" :value="`delete_${mod.id}`" v-model="form.permissions" class="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-gray-100 bg-white flex items-center justify-end gap-3">
        <button @click="close" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button 
          @click="submit" 
          :disabled="loading || !form.email"
          class="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-[#1f4e70] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>Send Invitation</span>
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { X } from 'lucide-vue-next';
import { useNuxtApp } from '#imports';
import { useBusinessContext } from '@/composables/core/useBusinessContext';
import UiCombobox from './Combobox.vue';
import { useRoles } from '@/composables/modules/roles/useRoles';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'success']);

const { inviteAdmin, fetchCustomRoles } = useRoles();
const { activeBusiness } = useBusinessContext();

const loading = ref(false);

const permissionModules = [
  { id: 'users', label: 'Users & Approvals' },
  { id: 'roles', label: 'Roles & Permissions' },
  { id: 'vault', label: 'Vault Management' },
  { id: 'jobs', label: 'Career Hub' },
  { id: 'mentorship', label: 'Mentorship' },
  { id: 'courses', label: 'Masterclasses (Courses)' },
  { id: 'marketplace', label: 'Creator Hub (Marketplace)' },
  { id: 'bounties', label: 'Services & Bounties' },
  { id: 'events', label: 'Events' },
  { id: 'content', label: 'Content Management' },
  { id: 'forms', label: 'Forms' },
  { id: 'enquiries', label: 'Enquiries' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'payments', label: 'Payments' },
  { id: 'analytics', label: 'Analytics' },
];



const form = reactive({
  email: '',
  role: 'ADMIN',
  department: '',
  permissions: [] as string[]
});

const defaultRoles = ['ADMIN', 'MODERATOR', 'DEPARTMENT_HEAD', 'MANAGER', 'SUPER_ADMIN'];
const availableRoles = ref([...defaultRoles]);

const customRolesMap = ref<Record<string, string[]>>({});

onMounted(async () => {
  const roles = await fetchCustomRoles();
  const customRoleKeys: string[] = [];
  
  roles.forEach((r: any) => {
    customRoleKeys.push(r.name);
    customRolesMap.value[r.name] = r.permissions;
  });

  availableRoles.value = [...defaultRoles, ...customRoleKeys];
});

import { watch } from 'vue';
watch(() => form.role, (newRole) => {
  if (customRolesMap.value[newRole]) {
    form.permissions = customRolesMap.value[newRole];
  }
});

const isAllSelected = computed(() => {
  const totalPerms = permissionModules.length * 4;
  return form.permissions.length === totalPerms;
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    form.permissions = [];
  } else {
    const allPerms: string[] = [];
    permissionModules.forEach(mod => {
      allPerms.push(`view_${mod.id}`, `create_${mod.id}`, `edit_${mod.id}`, `delete_${mod.id}`);
    });
    form.permissions = allPerms;
  }
};

const close = () => {
  emit('close');
  // Reset form
  form.email = '';
  form.role = 'ADMIN';
  form.department = '';
  form.permissions = [];
};

const submit = async () => {
  if (!form.email) return;
  
  loading.value = true;
  try {
    const payload = {
      ...form,
      adminPlatform: activeBusiness.value === 'internTional' ? 'interntional' : 'universe'
    };
    await inviteAdmin(payload);
    emit('success');
    close();
  } catch (error) {
    console.error('Failed to send invite:', error);
    alert('Failed to send invitation. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>
