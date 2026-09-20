<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 border border-gray-200 rounded-lg">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Career Hub Management</h1>
        <p class="text-sm text-gray-500 mt-1">Post and manage job opportunities for interns and alumni.</p>
      </div>
      <UiButton @click="showModal = true" class="px-6">
        Post New Job
      </UiButton>
    </div>

    <!-- Loading -->
    <div v-if="loading">
      <UiTableSpinner />
    </div>

    <!-- Empty State -->
    <div v-else-if="jobs.length === 0">
      <UiEmptyState 
        title="No jobs posted" 
        description="You haven't posted any jobs to the career hub yet." 
        :icon="BriefcaseIcon" 
      >
        <template #action>
          <button @click="showModal = true" class="mt-4 text-brand font-medium hover:underline text-sm">Post a job now</button>
        </template>
      </UiEmptyState>
    </div>

    <!-- Jobs List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="job in jobs" :key="job._id" class="bg-white rounded-lg border border-gray-200 flex flex-col group hover:border-gray-300 transition-colors">
        <div class="p-5 flex-1">
          <div class="flex items-start justify-between mb-3">
            <span class="text-[10px] font-bold text-gray-500 tracking-wider uppercase bg-gray-100 px-2 py-0.5 rounded">{{ job.location }}</span>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-1 leading-snug">{{ job.title }}</h3>
          <p class="text-sm font-medium text-brand mb-2">{{ job.company }}</p>
          <p class="text-gray-500 text-xs line-clamp-2">{{ job.description }}</p>
        </div>
        
        <div class="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <span class="text-xs text-gray-500 font-medium">Posted {{ new Date(job.createdAt).toLocaleDateString() }}</span>
          <button 
            @click="confirmDelete(job._id)" 
            :disabled="deleting === job._id" 
            class="text-xs text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 font-medium"
          >
            <span v-if="deleting === job._id">Deleting...</span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
      <div class="bg-white rounded border border-gray-200 shadow-xl w-full max-w-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-900">Post New Job</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <form @submit.prevent="handleCreate" class="p-6 space-y-4">
          <UiInput id="title" label="Job Title" v-model="form.title" required placeholder="e.g. Clinical Research Assistant" />
          
          <div class="grid grid-cols-2 gap-4">
            <UiInput id="company" label="Company / Hospital" v-model="form.company" required placeholder="e.g. General Hospital" />
            <UiInput id="location" label="Location" v-model="form.location" required placeholder="e.g. London, UK (or Remote)" />
          </div>
          
          <UiTextarea id="description" label="Description" v-model="form.description" required :rows="4" placeholder="Brief job description and requirements..." />
          
          <UiInput id="link" label="Application Link" v-model="form.link" required placeholder="https://..." />
          
          <div class="pt-2 flex justify-end gap-3">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
              Cancel
            </button>
            <UiButton type="submit" :loading="creating">
              Post Job
            </UiButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <UiConfirmationModal
      :isOpen="isDeleteModalOpen"
      title="Delete Job"
      message="Are you sure you want to delete this job posting? This action cannot be undone."
      confirmText="Delete Job"
      @confirm="handleDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '#imports';

useSeoMeta({
  title: 'Career Hub Management - InternTional Admin',
  description: 'Post and manage job opportunities for interns and alumni.',
  ogTitle: 'Career Hub Management - InternTional Admin',
  ogDescription: 'Post and manage job opportunities for interns and alumni.',
  ogImage: 'https://images.unsplash.com/photo-1579154204601-52ee6c23b202?q=80&w=2000&auto=format&fit=crop',
  twitterCard: 'summary_large_image',
})

import { ref, onMounted } from 'vue';
import { Briefcase as BriefcaseIcon, X } from 'lucide-vue-next';
import { useManageJobs } from '@/composables/modules/jobs/useManageJobs';
import UiInput from '@/components/ui/Input.vue';
import UiTextarea from '@/components/ui/Textarea.vue';
import UiButton from '@/components/ui/Button.vue';
import UiEmptyState from '@/components/ui/EmptyState.vue';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';
import UiConfirmationModal from '@/components/ui/ConfirmationModal.vue';

const { loading, creating, deleting, jobs, fetchJobs, createJob, deleteJob } = useManageJobs();

const showModal = ref(false);
const form = ref({ title: '', company: '', location: '', description: '', link: '' });

const isDeleteModalOpen = ref(false);
const selectedJobId = ref<string | null>(null);

const confirmDelete = (id: string) => {
  selectedJobId.value = id;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedJobId.value = null;
};

const handleCreate = async () => {
  const result = await createJob({ ...form.value });
  if (result) {
    showModal.value = false;
    form.value = { title: '', company: '', location: '', description: '', link: '' };
  }
};

const handleDelete = async () => {
  if (selectedJobId.value) {
    await deleteJob(selectedJobId.value);
    closeDeleteModal();
  }
};

onMounted(() => fetchJobs());
</script>
