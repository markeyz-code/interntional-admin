<template>
  <div class="space-y-6">
    <div class="bg-white p-6 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
      <div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Programs</h1>
        <p class="text-sm text-gray-500 mt-1">Manage academic programs and courses.</p>
      </div>
      <button @click="openCreateModal" class="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm">
        + Create Program
      </button>
    </div>

    <!-- Filters -->
    <UiTableFilters 
      v-model="filters" 
      :statusOptions="[
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' }
      ]"
    />

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Data List -->
    <div v-else-if="filteredPrograms.length > 0" class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th class="p-4">Name</th>
            <th class="p-4">Department</th>
            <th class="p-4">University</th>
            <th class="p-4">Status</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="program in filteredPrograms" :key="program._id" class="hover:bg-gray-50 transition-colors">
            <td class="p-4 font-medium text-gray-900">{{ program.name }}</td>
            <td class="p-4 text-gray-500">{{ program.department }}</td>
            <td class="p-4 text-gray-500">{{ program.universityId?.name || 'N/A' }}</td>
            <td class="p-4">
              <span class="px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider" :class="{
                'bg-green-100 text-green-700': program.status === 'active',
                'bg-gray-100 text-gray-700': program.status === 'draft'
              }">
                {{ program.status }}
              </span>
            </td>
            <td class="p-4 text-right space-x-2">
              <button @click="openEditModal(program)" class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
              <button @click="openDeleteModal(program)" class="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="p-12 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No Programs Found</h3>
        <p class="text-gray-500 mt-1">There are no academic programs configured yet.</p>
      </div>
    </div>
    
    <!-- Add/Edit Modal -->
    <UiModal :isOpen="isModalOpen" :title="isEdit ? 'Edit Program' : 'Create Program'" @close="isModalOpen = false">
      <form @submit.prevent="saveProgram" class="space-y-4 px-2 pb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input v-model="form.name" required type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <input v-model="form.department" required type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
        </div>
        <div>
          <UiSelect id="prog-uni" v-model="form.universityId" label="University" placeholder="Select a university" :options="universityOptions" required />
        </div>
        <div>
          <UiSelect id="prog-status" v-model="form.status" label="Status" :options="[{ label: 'Active', value: 'active' }, { label: 'Draft', value: 'draft' }]" required />
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
          <button type="submit" :disabled="isSaving" class="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand/90 disabled:opacity-50">
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </UiModal>

    <!-- Delete Confirmation Modal -->
    <UiModal :isOpen="isDeleteModalOpen" title="Confirm Delete" @close="isDeleteModalOpen = false">
      <div class="space-y-4 px-2 pb-4">
        <p class="text-sm text-gray-600">Are you sure you want to delete <strong>{{ activeItem?.name }}</strong>? This action cannot be undone.</p>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="isDeleteModalOpen = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
          <button @click="deleteProgram" :disabled="isDeleting" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50">
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useSeoMeta } from '#imports';
import UiTableFilters from '@/components/ui/TableFilters.vue';
import UiModal from '@/components/ui/Modal.vue';
import UiSelect from '@/components/ui/Select.vue';
import { universeApi } from '@/api_factory/modules/universe';
import { useCustomToast } from '@/composables/core/useCustomToast';

useSeoMeta({
  title: 'Programs - UniVerse Dashboard',
});

const { showToast } = useCustomToast();
const filters = ref({ search: '', status: '', role: '', startDate: '', endDate: '' });
const programs = ref<any[]>([]);
const universities = ref<any[]>([]);
const loading = ref(true);

// Modals state
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isEdit = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const activeItem = ref<any>(null);

const form = ref({
  name: '',
  department: '',
  universityId: '',
  status: 'active'
});

const universityOptions = computed(() => universities.value.map(u => ({ label: u.name, value: u._id })));

const filteredPrograms = computed(() => {
  return programs.value.filter(prog => {
    // 1. Search filter
    if (filters.value.search && !prog.name?.toLowerCase().includes(filters.value.search.toLowerCase())) {
      return false;
    }
    // 2. Status filter
    if (filters.value.status && prog.status !== filters.value.status) {
      return false;
    }
    // 3. Date range filter
    if (filters.value.startDate || filters.value.endDate) {
      const createdAt = new Date(prog.createdAt || new Date());
      if (filters.value.startDate && createdAt < new Date(filters.value.startDate)) return false;
      if (filters.value.endDate) {
        const end = new Date(filters.value.endDate);
        end.setHours(23, 59, 59, 999);
        if (createdAt > end) return false;
      }
    }
    return true;
  });
});

const fetchData = async () => {
  try {
    loading.value = true;
    const [progRes, uniRes] = await Promise.all([
      universeApi.getProgrammes(),
      universeApi.getUniversities()
    ]);
    programs.value = progRes.data || progRes;
    universities.value = uniRes.data || uniRes;
  } catch (err) {
    console.error('Failed to fetch data', err);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEdit.value = false;
  form.value = { name: '', department: '', universityId: '', status: 'active' };
  isModalOpen.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  activeItem.value = item;
  form.value = { 
    name: item.name, 
    department: item.department, 
    universityId: item.universityId?._id || item.universityId || '', 
    status: item.status 
  };
  isModalOpen.value = true;
};

const openDeleteModal = (item: any) => {
  activeItem.value = item;
  isDeleteModalOpen.value = true;
};

const saveProgram = async () => {
  if (!form.value.universityId) {
    showToast({ title: 'Validation Error', message: 'Please select a University', type: 'error' });
    return;
  }

  try {
    isSaving.value = true;
    if (isEdit.value) {
      await universeApi.updateProgramme(activeItem.value._id, form.value);
      showToast({ title: 'Success', message: 'Program updated successfully', type: 'success' });
    } else {
      await universeApi.createProgramme(form.value);
      showToast({ title: 'Success', message: 'Program created successfully', type: 'success' });
    }
    isModalOpen.value = false;
    fetchData();
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to save program', type: 'error' });
  } finally {
    isSaving.value = false;
  }
};

const deleteProgram = async () => {
  try {
    isDeleting.value = true;
    await universeApi.deleteProgramme(activeItem.value._id);
    showToast({ title: 'Success', message: 'Program deleted successfully', type: 'success' });
    isDeleteModalOpen.value = false;
    fetchData();
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to delete program', type: 'error' });
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
