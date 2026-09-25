<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Vault Management</h1>
        <p class="text-sm text-gray-500 mt-1">Manage all educational and onboarding resources.</p>
      </div>
      <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">
        <button @click="isExportModalOpen = true" class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
          Export Data
        </button>
        <button 
          @click="isUploadModalOpen = true"
          class="px-4 py-2 text-sm font-medium bg-brand text-white rounded hover:bg-[#1f4e70] transition-colors"
        >
          Upload Resource
        </button>
        <UiViewToggle v-model="viewMode" />
      </div>
    </div>

    <!-- Filters -->
    <UiTableFilters 
      v-model="filters" 
      :categoryOptions="[
        { label: 'All', value: 'All' },
        { label: 'Study Guide', value: 'Study Guide' },
        { label: 'Clinical', value: 'Clinical' },
        { label: 'Video', value: 'Video' },
        { label: 'Past Questions', value: 'Past Questions' },
        { label: 'Other', value: 'Other' }
      ]"
    />

    <!-- Loading -->
    <div v-if="loading && resources.length === 0" class="text-center py-20">
      <UiTableSpinner />
      <p class="text-gray-500 mt-4">Loading resources...</p>
    </div>

    <div v-else-if="resources.length > 0" class="relative">
      <div v-if="loading" class="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
        <UiTableSpinner />
      </div>
      <!-- Grid Layout -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="resource in resources" :key="resource._id" class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div class="p-5 flex-1">
            <h3 class="font-bold text-gray-900 mb-1 truncate">{{ resource.title }}</h3>
            <p class="text-xs text-gray-500 mb-4 line-clamp-2">{{ resource.description || 'No description provided.' }}</p>
            
            <div class="space-y-2 mb-4">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 text-xs">
                <span class="text-gray-500">Category</span>
                <span class="font-medium text-gray-900 px-2 py-0.5 bg-gray-100 rounded">{{ resource.category }}</span>
              </div>
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 text-xs">
                <span class="text-gray-500">Type</span>
                <span class="font-medium text-brand">{{ resource.type }}</span>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
            <button 
              @click="openPreview(resource)"
              class="text-xs font-medium text-brand hover:underline flex items-center gap-1"
            >
              <FileIcon class="w-3 h-3" /> View
            </button>
            <div class="flex items-center gap-4">
              <button 
                @click="openEditModal(resource)"
                class="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Edit
              </button>
              <button 
                @click="confirmDelete(resource._id)"
                :disabled="deleting === resource._id"
                class="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {{ deleting === resource._id ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- List Layout -->
      <div v-else-if="viewMode === 'list'" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Resource Title</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Date Uploaded</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="resource in resources" :key="resource._id" class="hover:bg-gray-50 transition-colors">
              <td class="p-4">
                <p class="font-medium text-gray-900 text-sm">{{ resource.title }}</p>
                <p class="text-xs text-gray-500 truncate max-w-xs">{{ resource.description }}</p>
              </td>
              <td class="p-4">
                <span class="px-2.5 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">{{ resource.category }}</span>
              </td>
              <td class="p-4">
                <span class="text-sm font-medium text-brand">{{ resource.type }}</span>
              </td>
              <td class="p-4 text-xs text-gray-500">
                {{ new Date(resource.createdAt).toLocaleDateString() }}
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-3">
                  <button 
                    @click="openPreview(resource)"
                    class="p-1.5 text-brand hover:bg-brand/10 rounded-md transition-colors"
                    title="View Resource"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button 
                    @click="openEditModal(resource)"
                    class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                    title="Edit Resource"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button 
                    @click="confirmDelete(resource._id)"
                    :disabled="deleting === resource._id"
                    class="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    title="Delete Resource"
                  >
                    <Trash2 class="w-4 h-4" />
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
        title="Vault is empty" 
        description="Try adjusting your filters or upload a new resource to the vault." 
        :icon="FileIcon" 
      />
    </div>

    <!-- Modals -->
    <UiAssetPreviewModal
      :isOpen="!!previewResource"
      :fileUrl="previewResource?.fileUrl || ''"
      :fileType="previewResource?.type || ''"
      :title="previewResource?.title || 'Preview'"
      @close="previewResource = null"
    />

    <UiConfirmationModal
      :isOpen="isDeleteModalOpen"
      title="Delete Resource"
      message="Are you sure you want to delete this resource? This action cannot be undone."
      @close="isDeleteModalOpen = false"
      @confirm="executeDelete"
    />

    <UiModal :isOpen="isUploadModalOpen" title="Upload Resource" @close="closeUploadModal">
      <form id="uploadResourceForm" @submit.prevent="submitUpload" class="space-y-4">
        <UiInput v-model="uploadForm.title" label="Title" required placeholder="e.g. Hematology Guide" />
        <UiTextarea v-model="uploadForm.description" label="Description" placeholder="Optional description..." />
        
        <div class="grid grid-cols-2 gap-4">
          <UiSelect 
            v-model="uploadForm.category" 
            label="Category" 
            :options="['Study Guide', 'Clinical', 'Video', 'Past Questions', 'Other'].map(c => ({label: c, value: c}))" 
            required 
          />
          <UiSelect 
            v-model="uploadForm.type" 
            label="File Type" 
            :options="['PDF', 'Image', 'Video', 'Other'].map(t => ({label: t, value: t}))" 
            required 
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">File</label>
          <input 
            type="file" 
            @change="handleFileChange" 
            required
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20" 
          />
        </div>

        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="bg-brand h-2.5 rounded-full" :style="{ width: uploadProgress + '%' }"></div>
        </div>
      </form>
      <template #footer>
        <button type="button" @click="closeUploadModal" class="px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded">Cancel</button>
        <button type="submit" form="uploadResourceForm" :disabled="loading" class="px-4 py-2 text-sm text-white bg-brand rounded font-medium disabled:opacity-50">
          {{ loading ? 'Uploading...' : 'Upload' }}
        </button>
      </template>
    </UiModal>

    <!-- Edit Modal -->
    <UiModal :isOpen="isEditModalOpen" title="Edit Resource" @close="closeEditModal">
      <form id="editResourceForm" @submit.prevent="submitEdit" class="space-y-4">
        <UiInput v-model="editForm.title" label="Title" required placeholder="e.g. Hematology Guide" />
        <UiTextarea v-model="editForm.description" label="Description" placeholder="Optional description..." />
        
        <div class="grid grid-cols-2 gap-4">
          <UiSelect 
            v-model="editForm.category" 
            label="Category" 
            :options="['Study Guide', 'Clinical', 'Video', 'Past Questions', 'Other'].map(c => ({label: c, value: c}))" 
            required 
          />
          <UiSelect 
            v-model="editForm.type" 
            label="File Type" 
            :options="['PDF', 'Image', 'Video', 'Other'].map(t => ({label: t, value: t}))" 
            required 
          />
        </div>
      </form>
      <template #footer>
        <button type="button" @click="closeEditModal" class="px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded">Cancel</button>
        <button type="submit" form="editResourceForm" :disabled="loading" class="px-4 py-2 text-sm text-white bg-brand rounded font-medium disabled:opacity-50">
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </template>
    </UiModal>

    <UiExportModal
      :isOpen="isExportModalOpen"
      :data="resources"
      :availableFields="[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'description', label: 'Description' },
        { key: 'tags', label: 'Tags' },
        { key: 'type', label: 'File Type' },
        { key: 'createdAt', label: 'Date Uploaded' }
      ]"
      filename="vault_resources_export"
      @close="isExportModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSeoMeta } from '#imports';
import { FileText as FileIcon, Eye, Trash2, Edit2 } from 'lucide-vue-next';
import { useManageVault } from '@/composables/modules/vault/useManageVault';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';
import UiEmptyState from '@/components/ui/EmptyState.vue';
import UiViewToggle from '@/components/ui/ViewToggle.vue';
import UiModal from '@/components/ui/Modal.vue';
import UiAssetPreviewModal from '@/components/ui/AssetPreviewModal.vue';
import UiConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import UiInput from '@/components/ui/Input.vue';
import UiTextarea from '@/components/ui/Textarea.vue';
import UiSelect from '@/components/ui/Select.vue';
import UiTableFilters from '@/components/ui/TableFilters.vue';
import UiPagination from '@/components/ui/Pagination.vue';
import UiExportModal from '@/components/ui/ExportModal.vue';

useSeoMeta({ title: 'Vault Management | Admin Dashboard' });

const { loading, deleting, uploadProgress, resources, filters, total, totalPages, getResources, uploadResource, deleteResource, updateResource } = useManageVault();
const viewMode = ref<'list' | 'grid'>('list');
const isExportModalOpen = ref(false);

// Preview State
const previewResource = ref<any>(null);
const openPreview = (resource: any) => previewResource.value = resource;

// Delete State
const isDeleteModalOpen = ref(false);
const resourceToDelete = ref<string | null>(null);

const confirmDelete = (id: string) => {
  resourceToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
  if (resourceToDelete.value) {
    await deleteResource(resourceToDelete.value);
    isDeleteModalOpen.value = false;
    resourceToDelete.value = null;
  }
};

// Upload State
const isUploadModalOpen = ref(false);
const uploadForm = ref({
  title: '',
  description: '',
  category: 'Study Guide',
  type: 'PDF',
  file: null as File | null
});

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    uploadForm.value.file = target.files[0];
  }
};

const closeUploadModal = () => {
  isUploadModalOpen.value = false;
  uploadForm.value = { title: '', description: '', category: 'Study Guide', type: 'PDF', file: null };
};

const submitUpload = async () => {
  if (!uploadForm.value.file) return alert('Please select a file');
  const success = await uploadResource(uploadForm.value as any);
  if (success) closeUploadModal();
};

// Edit State
const isEditModalOpen = ref(false);
const editingResourceId = ref<string | null>(null);
const editForm = ref({
  title: '',
  description: '',
  category: 'Study Guide',
  type: 'PDF'
});

const openEditModal = (resource: any) => {
  editingResourceId.value = resource._id;
  editForm.value = {
    title: resource.title,
    description: resource.description || '',
    category: resource.category,
    type: resource.type
  };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingResourceId.value = null;
};

const submitEdit = async () => {
  if (editingResourceId.value) {
    const success = await updateResource(editingResourceId.value, editForm.value);
    if (success) closeEditModal();
  }
};

onMounted(() => getResources());
</script>
