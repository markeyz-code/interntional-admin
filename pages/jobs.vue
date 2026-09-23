<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Career Hub</h1>
        <p class="text-sm text-gray-500 mt-1">Manage job postings and career opportunities.</p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="isUploadModalOpen = true"
          class="px-4 py-2 text-sm font-medium bg-brand text-white rounded hover:bg-[#1f4e70] transition-colors"
        >
          Post Job
        </button>
        <UiViewToggle v-model="viewMode" />
      </div>
    </div>

    <!-- Filters -->
    <UiTableFilters 
      v-model="filters" 
    />

    <!-- Loading -->
    <div v-if="loading && jobs.length === 0" class="text-center py-20">
      <UiTableSpinner />
      <p class="text-gray-500 mt-4">Loading jobs...</p>
    </div>

    <div v-else-if="jobs.length > 0" class="relative">
      <div v-if="loading" class="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
        <UiTableSpinner />
      </div>
      <!-- Grid Layout -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="job in jobs" :key="job._id" class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div class="p-5 flex-1">
            <h3 class="font-bold text-gray-900 text-lg mb-1 truncate">{{ job.title }}</h3>
            <p class="text-brand font-medium text-sm mb-4">{{ job.company }}</p>
            
            <div class="space-y-2 text-sm text-gray-600 mb-4">
              <div class="flex items-center gap-2">
                <MapPinIcon class="w-4 h-4 text-gray-400" />
                <span class="truncate">{{ job.location }}</span>
              </div>
              <div class="flex items-center gap-2">
                <ClockIcon class="w-4 h-4 text-gray-400" />
                <span>{{ new Date(job.createdAt).toLocaleDateString() }}</span>
              </div>
            </div>

            <p class="text-sm text-gray-500 line-clamp-3 mb-4">{{ job.description }}</p>
          </div>
          <div class="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
            <a :href="job.link" target="_blank" class="text-sm font-medium text-brand hover:underline">
              View Posting ↗
            </a>
            <button 
              @click="confirmDelete(job._id)"
              :disabled="deleting === job._id"
              class="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              {{ deleting === job._id ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>

      <!-- List Layout -->
      <div v-else-if="viewMode === 'list'" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Job Title</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Location</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Date Posted</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="job in jobs" :key="job._id" class="hover:bg-gray-50 transition-colors">
              <td class="p-4">
                <p class="font-bold text-gray-900 text-sm">{{ job.title }}</p>
                <p class="text-xs text-gray-500 truncate max-w-xs">{{ job.description }}</p>
              </td>
              <td class="p-4">
                <span class="text-sm font-medium text-brand">{{ job.company }}</span>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-1.5 text-sm text-gray-600">
                  <MapPinIcon class="w-3.5 h-3.5 text-gray-400" />
                  {{ job.location }}
                </div>
              </td>
              <td class="p-4 text-sm text-gray-600">
                <div class="flex items-center gap-1.5">
                  <ClockIcon class="w-3.5 h-3.5 text-gray-400" />
                  {{ new Date(job.createdAt).toLocaleDateString() }}
                </div>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-4">
                  <a :href="job.link" target="_blank" class="text-sm font-medium text-brand hover:underline">
                    View
                  </a>
                  <button 
                    @click="confirmDelete(job._id)"
                    :disabled="deleting === job._id"
                    class="text-sm font-medium text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
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

    <!-- Empty State -->
    <div v-else>
      <UiEmptyState 
        title="No jobs posted" 
        description="Try adjusting your filters or there are currently no active job postings." 
        :icon="BriefcaseIcon" 
      />
    </div>

    <!-- Modals -->
    <UiConfirmationModal
      :isOpen="isDeleteModalOpen"
      title="Delete Job Posting"
      message="Are you sure you want to delete this job posting? This action cannot be undone."
      @close="isDeleteModalOpen = false"
      @confirm="executeDelete"
    />

    <UiModal :isOpen="isUploadModalOpen" title="Post a Job" @close="closeUploadModal">
      <form id="postJobForm" @submit.prevent="submitUpload" class="space-y-4">
        <UiInput v-model="uploadForm.title" label="Job Title" required placeholder="e.g. Medical Lab Scientist" />
        <UiInput v-model="uploadForm.company" label="Company / Hospital" required placeholder="e.g. Lagos State University Teaching Hospital" />
        <UiInput v-model="uploadForm.location" label="Location" required placeholder="e.g. Lagos, Nigeria" />
        <UiInput v-model="uploadForm.link" label="Application Link" type="url" required placeholder="https://..." />
        <UiTextarea v-model="uploadForm.description" label="Job Description" required placeholder="Describe the role and requirements..." />
      </form>
      <template #footer>
        <button type="button" @click="closeUploadModal" class="px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded">Cancel</button>
        <button type="submit" form="postJobForm" :disabled="creating" class="px-4 py-2 text-sm text-white bg-brand rounded font-medium disabled:opacity-50">
          {{ creating ? 'Posting...' : 'Post Job' }}
        </button>
      </template>
    </UiModal>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSeoMeta } from '#imports';
import { Briefcase as BriefcaseIcon, MapPin as MapPinIcon, Clock as ClockIcon } from 'lucide-vue-next';
import { useManageJobs } from '@/composables/modules/jobs/useManageJobs';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';
import UiEmptyState from '@/components/ui/EmptyState.vue';
import UiViewToggle from '@/components/ui/ViewToggle.vue';
import UiModal from '@/components/ui/Modal.vue';
import UiConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import UiInput from '@/components/ui/Input.vue';
import UiTextarea from '@/components/ui/Textarea.vue';
import UiTableFilters from '@/components/ui/TableFilters.vue';
import UiPagination from '@/components/ui/Pagination.vue';

useSeoMeta({ title: 'Career Hub | Admin Dashboard' });

const { loading, creating, deleting, jobs, filters, total, totalPages, fetchJobs, createJob, deleteJob } = useManageJobs();
const viewMode = ref<'list' | 'grid'>('list');

// Delete State
const isDeleteModalOpen = ref(false);
const jobToDelete = ref<string | null>(null);

const confirmDelete = (id: string) => {
  jobToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
  if (jobToDelete.value) {
    await deleteJob(jobToDelete.value);
    isDeleteModalOpen.value = false;
    jobToDelete.value = null;
  }
};

// Upload State
const isUploadModalOpen = ref(false);
const uploadForm = ref({
  title: '',
  company: '',
  location: '',
  link: '',
  description: ''
});

const closeUploadModal = () => {
  isUploadModalOpen.value = false;
  uploadForm.value = { title: '', company: '', location: '', link: '', description: '' };
};

const submitUpload = async () => {
  const success = await createJob(uploadForm.value);
  if (success) closeUploadModal();
};

onMounted(() => fetchJobs());
</script>
