<template>
  <div class="space-y-6">
    <div class="bg-white p-6 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
      <div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Universities</h1>
        <p class="text-sm text-gray-500 mt-1">Manage partner universities and institutions.</p>
      </div>
      <button @click="openCreateModal" class="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm">
        + Add University
      </button>
    </div>

    <!-- Filters -->
    <UiTableFilters 
      v-model="filters" 
      :statusOptions="[
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]"
    />

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Data List -->
    <div v-else-if="filteredUniversities.length > 0" class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th class="p-4">Name</th>
            <th class="p-4">Location</th>
            <th class="p-4">Status</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="uni in filteredUniversities" :key="uni._id" class="hover:bg-gray-50 transition-colors">
            <td class="p-4 font-medium text-gray-900">{{ uni.name }}</td>
            <td class="p-4 text-gray-500">{{ uni.location }}</td>
            <td class="p-4">
              <span class="px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider bg-green-100 text-green-700">
                {{ uni.status }}
              </span>
            </td>
            <td class="p-4 text-right space-x-2">
              <button @click="openEditModal(uni)" class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
              <button @click="openDeleteModal(uni)" class="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="p-12 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No Universities Found</h3>
        <p class="text-gray-500 mt-1">There are no universities currently registered in the system.</p>
      </div>
    </div>
    
    <!-- Add/Edit Modal -->
    <UiModal :isOpen="isModalOpen" :title="isEdit ? 'Edit University' : 'Add University'" @close="isModalOpen = false">
      <form @submit.prevent="saveUniversity" class="space-y-4 px-2 pb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input v-model="form.name" required type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input v-model="form.location" required type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
        </div>
        <div>
          <UiSelect id="uni-status" v-model="form.status" label="Status" :options="[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]" />
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
          <button @click="deleteUniversity" :disabled="isDeleting" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50">
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
  title: 'Universities - UniVerse Dashboard',
});

const { showToast } = useCustomToast();
const filters = ref({ search: '', status: '', role: '', startDate: '', endDate: '' });
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
  location: '',
  status: 'active'
});

const filteredUniversities = computed(() => {
  return universities.value.filter(uni => {
    // 1. Search filter
    if (filters.value.search && !uni.name?.toLowerCase().includes(filters.value.search.toLowerCase())) {
      return false;
    }
    // 2. Status filter
    if (filters.value.status && uni.status !== filters.value.status) {
      return false;
    }
    // 3. Date range filter
    if (filters.value.startDate || filters.value.endDate) {
      const createdAt = new Date(uni.createdAt || new Date());
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

const fetchUniversities = async () => {
  try {
    loading.value = true;
    const response = await universeApi.getUniversities();
    universities.value = response.data || response;
  } catch (err) {
    console.error('Failed to fetch', err);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEdit.value = false;
  form.value = { name: '', location: '', status: 'active' };
  isModalOpen.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  activeItem.value = item;
  form.value = { ...item };
  isModalOpen.value = true;
};

const openDeleteModal = (item: any) => {
  activeItem.value = item;
  isDeleteModalOpen.value = true;
};

const saveUniversity = async () => {
  try {
    isSaving.value = true;
    if (isEdit.value) {
      await universeApi.updateUniversity(activeItem.value._id, form.value);
      showToast({ title: 'Success', message: 'University updated successfully', type: 'success' });
    } else {
      await universeApi.createUniversity(form.value);
      showToast({ title: 'Success', message: 'University created successfully', type: 'success' });
    }
    isModalOpen.value = false;
    fetchUniversities();
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to save university', type: 'error' });
  } finally {
    isSaving.value = false;
  }
};

const deleteUniversity = async () => {
  try {
    isDeleting.value = true;
    await universeApi.deleteUniversity(activeItem.value._id);
    showToast({ title: 'Success', message: 'University deleted successfully', type: 'success' });
    isDeleteModalOpen.value = false;
    fetchUniversities();
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to delete university', type: 'error' });
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => {
  fetchUniversities();
});
</script>
