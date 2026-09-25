<template>
  <div class="space-y-6">
    <div class="bg-white p-6 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
      <div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Students</h1>
        <p class="text-sm text-gray-500 mt-1">Manage enrolled students and their profiles.</p>
      </div>
      <button @click="openCreateModal" class="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm">
        + Add Student
      </button>
    </div>

    <!-- Filters -->
    <UiTableFilters 
      v-model="filters" 
      :statusOptions="[
        { label: 'Enrolled', value: 'enrolled' },
        { label: 'Graduated', value: 'graduated' },
        { label: 'Suspended', value: 'suspended' }
      ]"
    />

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Data List -->
    <div v-else-if="filteredStudents.length > 0" class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th class="p-4">Name</th>
            <th class="p-4">Email</th>
            <th class="p-4">University</th>
            <th class="p-4">Programme</th>
            <th class="p-4">Status</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="student in filteredStudents" :key="student._id" class="hover:bg-gray-50 transition-colors">
            <td class="p-4 font-medium text-gray-900">{{ student.firstName }} {{ student.lastName }}</td>
            <td class="p-4 text-gray-500">{{ student.email }}</td>
            <td class="p-4 text-gray-500">{{ student.universityId?.name || 'N/A' }}</td>
            <td class="p-4 text-gray-500">{{ student.programmeId?.name || 'N/A' }}</td>
            <td class="p-4">
              <span class="px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider" :class="{
                'bg-green-100 text-green-700': student.status === 'enrolled',
                'bg-blue-100 text-blue-700': student.status === 'graduated',
                'bg-red-100 text-red-700': student.status === 'suspended'
              }">
                {{ student.status }}
              </span>
            </td>
            <td class="p-4 text-right space-x-2">
              <button @click="openEditModal(student)" class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
              <button @click="openDeleteModal(student)" class="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="p-12 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No Students Found</h3>
        <p class="text-gray-500 mt-1">There are no students matching your criteria.</p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <UiModal :isOpen="isModalOpen" :title="isEdit ? 'Edit Student' : 'Add Student'" @close="isModalOpen = false">
      <form @submit.prevent="saveStudent" class="space-y-4 px-2 pb-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input v-model="form.firstName" required type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input v-model="form.lastName" required type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="form.email" required type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <UiSelect id="stud-uni" v-model="form.universityId" label="University" placeholder="Select a university" :options="universityOptions" required />
          </div>
          <div>
            <UiSelect id="stud-prog" v-model="form.programmeId" label="Programme" placeholder="Select a programme" :options="programmeOptions" required />
          </div>
        </div>
        <div>
          <UiSelect id="stud-status" v-model="form.status" label="Status" :options="[{ label: 'Enrolled', value: 'enrolled' }, { label: 'Graduated', value: 'graduated' }, { label: 'Suspended', value: 'suspended' }]" required />
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
        <p class="text-sm text-gray-600">Are you sure you want to delete <strong>{{ activeItem?.firstName }} {{ activeItem?.lastName }}</strong>? This action cannot be undone.</p>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="isDeleteModalOpen = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
          <button @click="deleteStudent" :disabled="isDeleting" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50">
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
  title: 'Students - UniVerse Dashboard',
});

const { showToast } = useCustomToast();
const filters = ref({ search: '', status: '', role: '', startDate: '', endDate: '' });
const students = ref<any[]>([]);
const universities = ref<any[]>([]);
const programmes = ref<any[]>([]);
const loading = ref(true);

// Modals state
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isEdit = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const activeItem = ref<any>(null);

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  universityId: '',
  programmeId: '',
  status: 'enrolled'
});

// Filter programmes based on selected university
const filteredProgrammes = computed(() => {
  if (!form.value.universityId) return [];
  return programmes.value.filter(p => p.universityId === form.value.universityId || p.universityId?._id === form.value.universityId);
});

const universityOptions = computed(() => universities.value.map(u => ({ label: u.name, value: u._id })));
const programmeOptions = computed(() => filteredProgrammes.value.map(p => ({ label: p.name, value: p._id })));

const filteredStudents = computed(() => {
  return students.value.filter(student => {
    // 1. Search filter
    if (filters.value.search) {
      const query = filters.value.search.toLowerCase();
      const matchName = `${student.firstName} ${student.lastName}`.toLowerCase().includes(query);
      const matchEmail = student.email?.toLowerCase().includes(query);
      if (!matchName && !matchEmail) return false;
    }
    // 2. Status filter
    if (filters.value.status && student.status !== filters.value.status) {
      return false;
    }
    // 3. Date range filter
    if (filters.value.startDate || filters.value.endDate) {
      const createdAt = new Date(student.createdAt || new Date());
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
    const [studRes, uniRes, progRes] = await Promise.all([
      universeApi.getStudents(),
      universeApi.getUniversities(),
      universeApi.getProgrammes()
    ]);
    students.value = studRes.data || studRes;
    universities.value = uniRes.data || uniRes;
    programmes.value = progRes.data || progRes;
  } catch (err) {
    console.error('Failed to fetch data', err);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEdit.value = false;
  form.value = { firstName: '', lastName: '', email: '', universityId: '', programmeId: '', status: 'enrolled' };
  isModalOpen.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  activeItem.value = item;
  form.value = { 
    firstName: item.firstName, 
    lastName: item.lastName, 
    email: item.email, 
    universityId: item.universityId?._id || item.universityId || '', 
    programmeId: item.programmeId?._id || item.programmeId || '', 
    status: item.status 
  };
  isModalOpen.value = true;
};

const openDeleteModal = (item: any) => {
  activeItem.value = item;
  isDeleteModalOpen.value = true;
};

const saveStudent = async () => {
  if (!form.value.universityId || !form.value.programmeId) {
    showToast({ title: 'Validation Error', message: 'Please select a University and Programme', type: 'error' });
    return;
  }
  
  try {
    isSaving.value = true;
    if (isEdit.value) {
      await universeApi.updateStudent(activeItem.value._id, form.value);
      showToast({ title: 'Success', message: 'Student updated successfully', type: 'success' });
    } else {
      await universeApi.createStudent(form.value);
      showToast({ title: 'Success', message: 'Student created successfully', type: 'success' });
    }
    isModalOpen.value = false;
    fetchData(); // Refresh table
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to save student', type: 'error' });
  } finally {
    isSaving.value = false;
  }
};

const deleteStudent = async () => {
  try {
    isDeleting.value = true;
    await universeApi.deleteStudent(activeItem.value._id);
    showToast({ title: 'Success', message: 'Student deleted successfully', type: 'success' });
    isDeleteModalOpen.value = false;
    fetchData(); // Refresh table
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to delete student', type: 'error' });
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
