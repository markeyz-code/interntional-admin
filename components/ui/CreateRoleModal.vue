<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="close">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Create Custom Role</h2>
            <p class="text-sm text-gray-500 mt-1">Define a new role and its specific permissions.</p>
          </div>
          <button @click="close" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto flex-1 bg-gray-50/50 space-y-8">
        
        <!-- Basic Info -->
        <div class="grid gap-6">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Role Name <span class="text-red-500">*</span></label>
            <input 
              v-model="form.roleName" 
              type="text" 
              placeholder="e.g. EDITOR" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm"
            >
          </div>
        </div>

        <!-- Granular Permissions Grid -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-bold text-gray-900">Permissions</h3>
              <p class="text-sm text-gray-500">Select what this role can do on the platform.</p>
            </div>
            <button 
              @click="toggleSelectAll"
              class="text-sm font-medium text-brand hover:text-brand/80"
            >
              {{ isAllSelected ? 'Deselect All' : 'Select All' }}
            </button>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div 
              v-for="module in permissionModules" 
              :key="module.id"
              class="bg-white border border-gray-200 p-4 rounded-xl"
            >
              <h4 class="font-bold text-gray-900 mb-3">{{ module.label }}</h4>
              <div class="space-y-2">
                <label v-for="action in ['view', 'create', 'edit', 'delete']" :key="action" class="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    :value="`${action}_${module.id}`"
                    v-model="form.permissions"
                    class="rounded border-gray-300 text-brand focus:ring-brand"
                  >
                  <span class="text-sm text-gray-700 capitalize">{{ action }}</span>
                </label>
              </div>
            </div>
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
          :disabled="loading || !form.roleName || form.permissions.length === 0"
          class="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-[#1f4e70] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>Create Role</span>
        </button>
      </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { X } from 'lucide-vue-next';
import { useRoles } from '@/composables/modules/roles/useRoles';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'success']);

const { createCustomRole } = useRoles();
const loading = ref(false);

const permissionModules = [
  { id: 'users', label: 'User Management' },
  { id: 'documents', label: 'Documents & Vault' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'payments', label: 'Payments & Financials' },
  { id: 'content', label: 'Content (Events, Courses)' },
  { id: 'jobs', label: 'Career Hub' },
  { id: 'enquiries', label: 'Enquiries' },
  { id: 'analytics', label: 'Analytics' },
];

const form = reactive({
  roleName: '',
  permissions: [] as string[]
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
  form.roleName = '';
  form.permissions = [];
};

const submit = async () => {
  if (!form.roleName) return;
  
  loading.value = true;
  try {
    const roleKey = form.roleName.toUpperCase().replace(/\s+/g, '_');
    
    await createCustomRole({
      name: roleKey,
      permissions: form.permissions
    });

    emit('success');
    close();
  } catch (error) {
    console.error('Failed to create role:', error);
    alert('Failed to create role. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>
