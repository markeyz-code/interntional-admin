<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Subscriptions</h1>
        <p class="text-sm text-gray-500 mt-1">Manage pricing plans and subscription tiers.</p>
      </div>
      <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">
        <button @click="isExportModalOpen = true" class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
          Export Data
        </button>
        <button 
          @click="openCreateModal"
          class="px-4 py-2 text-sm font-medium bg-brand text-white rounded hover:bg-[#1f4e70] transition-colors"
        >
          Create Plan
        </button>
        <UiViewToggle v-model="viewMode" />
      </div>
    </div>

    <!-- Filters -->
    <UiTableFilters 
      v-model="filters" 
    />

    <!-- Loading -->
    <div v-if="loading && subscriptions.length === 0" class="text-center py-20">
      <UiTableSpinner />
      <p class="text-gray-500 mt-4">Loading subscriptions...</p>
    </div>

    <div v-else-if="subscriptions.length > 0" class="relative">
      <div v-if="loading" class="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
        <UiTableSpinner />
      </div>
      <!-- Grid Layout -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="plan in subscriptions" :key="plan._id" class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
          <div v-if="plan.bannerImage" class="h-32 w-full">
            <img :src="plan.bannerImage" class="w-full h-full object-cover" />
          </div>
          <div class="p-6 flex-1 text-center border-b border-gray-100 relative">
            <h3 class="font-bold text-gray-900 text-lg mb-1">{{ plan.name }}</h3>
            <p class="text-xs text-gray-500 mb-4">{{ plan.description || 'No description provided' }}</p>
            <div class="flex items-baseline justify-center gap-1 mb-4">
              <span class="text-lg font-black text-gray-900">${{ plan.price }}</span>
              <span class="text-sm font-medium text-gray-500">/ {{ plan.durationMonths }} mo</span>
            </div>
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider" :class="plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'">
              {{ plan.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="bg-gray-50 p-4 flex items-center justify-center gap-4">
            <button @click="openEditModal(plan)" class="text-sm font-medium text-brand hover:underline">Edit</button>
            <button 
              @click="confirmDelete(plan._id)"
              class="text-sm font-medium text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- List Layout -->
      <div v-else-if="viewMode === 'list'" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Plan Name</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Duration</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="plan in subscriptions" :key="plan._id" class="hover:bg-gray-50 transition-colors">
              <td class="p-4 flex items-center gap-3">
                <img v-if="plan.bannerImage" :src="plan.bannerImage" class="w-10 h-10 object-cover rounded" />
                <div v-else class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                  <CreditCardIcon class="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p class="font-bold text-gray-900 text-sm">{{ plan.name }}</p>
                  <p class="text-xs text-gray-500 truncate max-w-xs">{{ plan.description }}</p>
                </div>
              </td>
              <td class="p-4">
                <span class="text-sm font-bold text-gray-900">${{ plan.price }}</span>
              </td>
              <td class="p-4">
                <span class="text-sm text-gray-600">{{ plan.durationMonths }} months</span>
              </td>
              <td class="p-4">
                <span class="px-2.5 py-1 text-xs font-medium rounded-full inline-block" :class="plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'">
                  {{ plan.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-4">
                  <button @click="openEditModal(plan)" class="text-sm font-medium text-brand hover:underline">Edit</button>
                  <button 
                    @click="confirmDelete(plan._id)"
                    class="text-sm font-medium text-red-600 hover:text-red-900"
                  >
                    Delete
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
        title="No subscription plans" 
        description="There are currently no pricing plans configured." 
        :icon="CreditCardIcon" 
      />
    </div>

    <!-- Modals -->
    <UiConfirmationModal
      :isOpen="isDeleteModalOpen"
      :isLoading="loading"
      title="Delete Subscription Plan"
      message="Are you sure you want to delete this plan? Active subscribers will not be immediately affected, but new subscriptions won't be possible."
      @close="isDeleteModalOpen = false"
      @confirm="executeDelete"
    />

    <UiModal :isOpen="isCreateModalOpen" :title="isEditMode ? 'Edit Plan' : 'Create Plan'" @close="closeCreateModal" maxWidth="5xl">
      <form id="createPlanForm" @submit.prevent="submitCreate" class="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[75vh] overflow-y-auto p-1">
        <!-- Left Column: Core Settings & Banner -->
        <div class="space-y-4">
          <h3 class="text-base font-bold text-gray-900 border-b pb-2">Core Settings</h3>
          <UiInput v-model="createForm.name" label="Plan Name *" required placeholder="e.g. Premium Access" />
          <UiInput v-model.number="createForm.price" label="Price (in minor units e.g. kobo/cents) *" type="number" required placeholder="500000" />
          <UiInput v-model.number="createForm.durationMonths" label="Duration (Months) *" type="number" required placeholder="1" />
          <UiTextarea v-model="createForm.description" label="Description" placeholder="Plan details..." />
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
            <div class="relative w-full h-32 bg-gray-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:bg-gray-100 hover:border-brand/50 transition-all cursor-pointer group overflow-hidden" @click="($refs as any).bannerInput?.click()">
              <img v-if="createForm.bannerImage || createForm.bannerImagePreview" :src="createForm.bannerImagePreview || createForm.bannerImage" class="absolute inset-0 w-full h-full object-cover z-10" />
              <div v-if="createForm.bannerImage || createForm.bannerImagePreview" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center">
                <span class="text-white text-xs font-bold">Change Image</span>
              </div>
              <template v-if="!(createForm.bannerImage || createForm.bannerImagePreview)">
                <svg v-if="!uploadingBanner" class="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p v-if="!uploadingBanner" class="text-xs text-gray-400">Click to upload banner</p>
                <div v-if="uploadingBanner" class="flex flex-col items-center">
                  <div class="w-6 h-6 border-3 border-brand/20 border-t-brand rounded-full animate-spin mb-1"></div>
                  <p class="text-xs text-brand font-medium">{{ bannerProgress }}%</p>
                </div>
              </template>
            </div>
            <input ref="bannerInput" type="file" accept="image/*" class="hidden" @change="handleBannerUpload" />
            <button v-if="createForm.bannerImage || createForm.bannerImagePreview" @click.prevent="createForm.bannerImage = ''; createForm.bannerImagePreview = ''; createForm.bannerImageFile = null;" type="button" class="mt-1 text-xs text-red-500 hover:text-red-700 font-medium">Remove Image</button>
          </div>
        </div>

        <!-- Right Column: Access Controls & Courses -->
        <div class="space-y-6">
          <h3 class="text-base font-bold text-gray-900 border-b pb-2">Access Controls</h3>
          
          <div class="grid grid-cols-2 gap-4">
            <UiInput v-model.number="createForm.maxMentorshipRequests" label="Max Mentorships/mo" type="number" placeholder="5" />
            <UiInput v-model.number="createForm.eventDiscountPercentage" label="Event Discount %" type="number" placeholder="10" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded border border-gray-100 hover:border-brand/30 transition-colors">
              <input type="checkbox" v-model="createForm.canAccessVault" class="rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700">Access Vault</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded border border-gray-100 hover:border-brand/30 transition-colors">
              <input type="checkbox" v-model="createForm.canPostArticles" class="rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700">Post Articles</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded border border-gray-100 hover:border-brand/30 transition-colors">
              <input type="checkbox" v-model="createForm.canAccessGlobalCommunity" class="rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700">Global Community</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded border border-gray-100 hover:border-brand/30 transition-colors">
              <input type="checkbox" v-model="createForm.canAccessPremiumJobs" class="rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700">Premium Jobs</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded border border-gray-100 hover:border-brand/30 transition-colors">
              <input type="checkbox" v-model="createForm.canMessageMentorsDirectly" class="rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700">Message Mentors</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded border border-gray-100 hover:border-brand/30 transition-colors">
              <input type="checkbox" v-model="createForm.resumeReviewIncluded" class="rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700">Resume Review</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded border border-gray-100 hover:border-brand/30 transition-colors">
              <input type="checkbox" v-model="createForm.mockInterviewsIncluded" class="rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700">Mock Interviews</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded border border-gray-100 hover:border-brand/30 transition-colors">
              <input type="checkbox" v-model="createForm.canAccessPremiumResources" class="rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700">Premium Resources</span>
            </label>
          </div>

          <label class="flex items-center gap-2 cursor-pointer p-3 bg-brand/5 rounded-lg border border-brand/20">
            <input type="checkbox" v-model="createForm.isActive" class="rounded border-gray-300 text-brand focus:ring-brand" />
            <span class="text-sm text-brand font-bold">Plan is Active & Visible</span>
          </label>

          <div class="mt-6 space-y-4">
            <div class="flex items-center justify-between border-b pb-2">
              <h3 class="text-base font-bold text-gray-900">Selar Courses Integration</h3>
              <button type="button" @click="addCategory" class="text-xs font-medium bg-gray-900 text-white px-2 py-1 rounded hover:bg-gray-800">
                + Add Category
              </button>
            </div>
            
            <div v-if="createForm.sellarCourses.length === 0" class="text-center py-6 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
              <p class="text-sm text-gray-500">No courses added. Add a category to start.</p>
            </div>

            <div v-for="(cat, cIdx) in createForm.sellarCourses" :key="cIdx" class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
              <div class="flex items-center gap-3">
                <input v-model="cat.category" placeholder="Category Name (e.g. Hematology)" class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md font-bold focus:ring-brand focus:border-brand" />
                <button type="button" @click="createForm.sellarCourses.splice(cIdx, 1)" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded transition-colors" title="Remove Category">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>

              <div class="pl-4 border-l-2 border-gray-200 space-y-3">
                <div v-for="(course, idx) in cat.courses" :key="idx" class="bg-white border border-gray-100 p-3 rounded shadow-sm relative group">
                  <button type="button" @click="cat.courses.splice(idx, 1)" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                  <div class="grid grid-cols-1 gap-2 pr-6">
                    <input v-model="course.title" placeholder="Course Title *" class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-brand focus:border-brand" required />
                    <input v-model="course.link" placeholder="Selar Link (https://selar.co/...) *" class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-brand focus:border-brand" required />
                    <textarea v-model="course.description" placeholder="Short Description (Optional)" class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-brand focus:border-brand" rows="2"></textarea>
                    <div class="relative w-full h-20 bg-gray-50 rounded border border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group" @click="triggerCourseImageUpload(cIdx, idx)">
                      <img v-if="course.image || course.imagePreview" :src="course.imagePreview || course.image" class="absolute inset-0 w-full h-full object-cover" />
                      <div v-if="course.image || course.imagePreview" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span class="text-white text-xs font-bold">Change Cover</span>
                      </div>
                      <div v-if="!(course.image || course.imagePreview)" class="text-center">
                        <svg class="w-5 h-5 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span class="text-xs text-gray-500">Upload Cover (Opt)</span>
                      </div>
                    </div>
                    <input :ref="el => setCourseImageRef(el, cIdx, idx)" type="file" accept="image/*" class="hidden" @change="e => handleCourseImageUpload(e, course)" />
                  </div>
                </div>
                
                <button type="button" @click="addCourse(cat)" class="text-xs font-medium text-brand hover:underline flex items-center gap-1 mt-2">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Add Course to {{ cat.category || 'Category' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <template #footer>
        <button type="button" @click="closeCreateModal" class="px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded">Cancel</button>
        <button type="submit" form="createPlanForm" :disabled="loading || uploadingBanner" class="px-4 py-2 text-sm text-white bg-brand rounded font-medium disabled:opacity-50">
          {{ loading ? 'Saving...' : 'Save Plan' }}
        </button>
      </template>
    </UiModal>

    <UiExportModal
      :isOpen="isExportModalOpen"
      :data="subscriptions"
      :availableFields="[
        { key: 'name', label: 'Plan Name' },
        { key: 'description', label: 'Description' },
        { key: 'price', label: 'Price' },
        { key: 'durationMonths', label: 'Duration (Months)' },
        { key: 'isActive', label: 'Status' }
      ]"
      filename="subscriptions_export"
      @close="isExportModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSeoMeta } from '#imports';
import axios from 'axios';
import { CreditCard as CreditCardIcon } from 'lucide-vue-next';
import { useSubscriptions } from '@/composables/modules/subscriptions/useSubscriptions';
import { storageApi } from '@/api_factory/modules/storage';
import { useCustomToast } from '@/composables/core/useCustomToast';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';
import UiEmptyState from '@/components/ui/EmptyState.vue';
import UiViewToggle from '@/components/ui/ViewToggle.vue';
import UiModal from '@/components/ui/Modal.vue';
import UiConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import UiInput from '@/components/ui/Input.vue';
import UiTextarea from '@/components/ui/Textarea.vue';
import UiTableFilters from '@/components/ui/TableFilters.vue';
import UiPagination from '@/components/ui/Pagination.vue';
import UiExportModal from '@/components/ui/ExportModal.vue';

useSeoMeta({ title: 'Subscriptions | Admin Dashboard' });

const { showToast } = useCustomToast();
const { loading, subscriptions, filters, total, totalPages, fetchAll, createPlan, updatePlan, deletePlan } = useSubscriptions();
const viewMode = ref<'list' | 'grid'>('list');
const isExportModalOpen = ref(false);

// Delete State
const isDeleteModalOpen = ref(false);
const planToDelete = ref<string | null>(null);

const confirmDelete = (id: string) => {
  planToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
  if (planToDelete.value) {
    await deletePlan(planToDelete.value);
    isDeleteModalOpen.value = false;
    planToDelete.value = null;
  }
};

// Create / Edit State
const isCreateModalOpen = ref(false);
const isEditMode = ref(false);
const planToEdit = ref<string | null>(null);
const uploadingBanner = ref(false);
const bannerProgress = ref(0);

const createForm = ref({
  name: '',
  description: '',
  bannerImage: '',
  bannerImagePreview: '',
  bannerImageFile: null as File | null,
  price: null as number | null,
  durationMonths: 1,
  maxMentorshipRequests: 0,
  canAccessVault: false,
  canPostArticles: false,
  canAccessGlobalCommunity: false,
  canAccessPremiumJobs: false,
  canMessageMentorsDirectly: false,
  resumeReviewIncluded: false,
  mockInterviewsIncluded: false,
  canAccessPremiumResources: false,
  eventDiscountPercentage: 0,
  isActive: true,
  features: [] as string[],
  sellarCourses: [] as { category: string; courses: any[] }[]
});

const addCategory = () => {
  createForm.value.sellarCourses.push({ category: '', courses: [] });
};

const addCourse = (cat: any) => {
  cat.courses.push({ title: '', link: '', description: '', image: '', imagePreview: '', imageFile: null });
};

const courseImageRefs = ref<{ [key: string]: HTMLInputElement | null }>({});

const setCourseImageRef = (el: any, cIdx: number, idx: number) => {
  if (el) {
    courseImageRefs.value[`${cIdx}-${idx}`] = el as HTMLInputElement;
  }
};

const triggerCourseImageUpload = (cIdx: number, idx: number) => {
  const el = courseImageRefs.value[`${cIdx}-${idx}`];
  if (el) el.click();
};

const handleCourseImageUpload = (e: Event, course: any) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast({ title: 'Error', message: 'Please select an image file', type: 'error' });
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast({ title: 'Error', message: 'Image must be less than 5MB', type: 'error' });
    return;
  }
  course.imageFile = file;
  course.imagePreview = URL.createObjectURL(file);
};

const handleBannerUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast({ title: 'Error', message: 'Please select an image file', type: 'error' });
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast({ title: 'Error', message: 'Image must be less than 5MB', type: 'error' });
    return;
  }
  createForm.value.bannerImageFile = file;
  createForm.value.bannerImagePreview = URL.createObjectURL(file);
};

const performBannerUpload = async (file: File) => {
  uploadingBanner.value = true;
  bannerProgress.value = 0;
  try {
    const { data: sigData } = await storageApi.getUploadSignature({ folder: 'admin/plans' });
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', sigData.apiKey);
    fd.append('timestamp', sigData.timestamp.toString());
    fd.append('signature', sigData.signature);
    fd.append('folder', sigData.folder);
    if (sigData.eager) fd.append('eager', sigData.eager);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`;
    const { data: uploadResult } = await axios.post(cloudinaryUrl, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (ev) => {
        if (ev.total) bannerProgress.value = Math.round((ev.loaded / ev.total) * 100);
      },
    });
    createForm.value.bannerImage = uploadResult.secure_url;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to upload banner');
  } finally {
    uploadingBanner.value = false;
  }
};

const performGenericImageUpload = async (file: File, folder: string = 'admin/plans/courses') => {
  try {
    const { data: sigData } = await storageApi.getUploadSignature({ folder });
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', sigData.apiKey);
    fd.append('timestamp', sigData.timestamp.toString());
    fd.append('signature', sigData.signature);
    fd.append('folder', sigData.folder);
    if (sigData.eager) fd.append('eager', sigData.eager);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`;
    const { data: uploadResult } = await axios.post(cloudinaryUrl, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return uploadResult.secure_url;
  } catch (err) {
    console.error('Failed generic upload', err);
    throw err;
  }
};

const openCreateModal = () => {
  isEditMode.value = false;
  planToEdit.value = null;
  createForm.value = { 
    name: '', description: '', bannerImage: '', bannerImagePreview: '', bannerImageFile: null, price: null, durationMonths: 1, 
    maxMentorshipRequests: 0, canAccessVault: false, canPostArticles: false, 
    canAccessGlobalCommunity: false, canAccessPremiumJobs: false, canMessageMentorsDirectly: false,
    resumeReviewIncluded: false, mockInterviewsIncluded: false, canAccessPremiumResources: false,
    eventDiscountPercentage: 0, isActive: true, features: [], sellarCourses: []
  };
  isCreateModalOpen.value = true;
};

const openEditModal = (plan: any) => {
  isEditMode.value = true;
  planToEdit.value = plan._id;
  
  // Handle migration from old flat sellar courses array if necessary
  let parsedCourses = [];
  if (plan.sellarCourses && Array.isArray(plan.sellarCourses)) {
    // Check if it's the old format [{category: '...', link: '...'}]
    if (plan.sellarCourses.length > 0 && !plan.sellarCourses[0].courses) {
      const migrated = plan.sellarCourses.map((c: any) => ({
        category: c.category,
        courses: [{ title: 'Course', link: c.link, image: '', imagePreview: '', imageFile: null }]
      }));
      parsedCourses = migrated;
    } else {
      parsedCourses = JSON.parse(JSON.stringify(plan.sellarCourses)).map((cat: any) => {
        cat.courses = cat.courses.map((course: any) => ({
          ...course,
          imagePreview: '',
          imageFile: null
        }));
        return cat;
      });
    }
  }

  createForm.value = {
    name: plan.name,
    description: plan.description || '',
    bannerImage: plan.bannerImage || '',
    bannerImagePreview: '',
    bannerImageFile: null,
    price: plan.price,
    durationMonths: plan.durationMonths,
    maxMentorshipRequests: plan.maxMentorshipRequests || 0,
    canAccessVault: plan.canAccessVault || false,
    canPostArticles: plan.canPostArticles || false,
    canAccessGlobalCommunity: plan.canAccessGlobalCommunity || false,
    canAccessPremiumJobs: plan.canAccessPremiumJobs || false,
    canMessageMentorsDirectly: plan.canMessageMentorsDirectly || false,
    resumeReviewIncluded: plan.resumeReviewIncluded || false,
    mockInterviewsIncluded: plan.mockInterviewsIncluded || false,
    canAccessPremiumResources: plan.canAccessPremiumResources || false,
    eventDiscountPercentage: plan.eventDiscountPercentage || 0,
    isActive: plan.isActive,
    features: plan.features || [],
    sellarCourses: parsedCourses
  };
  isCreateModalOpen.value = true;
};

const closeCreateModal = () => {
  isCreateModalOpen.value = false;
  isEditMode.value = false;
  planToEdit.value = null;
  createForm.value = { 
    name: '', description: '', bannerImage: '', bannerImagePreview: '', bannerImageFile: null, price: null, durationMonths: 1, 
    maxMentorshipRequests: 0, canAccessVault: false, canPostArticles: false, 
    canAccessGlobalCommunity: false, canAccessPremiumJobs: false, canMessageMentorsDirectly: false,
    resumeReviewIncluded: false, mockInterviewsIncluded: false, canAccessPremiumResources: false,
    eventDiscountPercentage: 0, isActive: true, features: [], sellarCourses: [] 
  };
};

const submitCreate = async () => {
  try {
    if (createForm.value.bannerImageFile) {
      await performBannerUpload(createForm.value.bannerImageFile);
    }
    
    // Upload course images
    uploadingBanner.value = true; // reuse loading state visually
    for (const cat of createForm.value.sellarCourses) {
      for (const course of cat.courses) {
        if (course.imageFile) {
          course.image = await performGenericImageUpload(course.imageFile);
        }
      }
    }
    uploadingBanner.value = false;

    const payload = JSON.parse(JSON.stringify(createForm.value));
    delete payload.bannerImagePreview;
    delete payload.bannerImageFile;
    
    for (const cat of payload.sellarCourses) {
      for (const course of cat.courses) {
        delete course.imagePreview;
        delete course.imageFile;
      }
    }

    let success = false;
    if (isEditMode.value && planToEdit.value) {
      success = await updatePlan(planToEdit.value, payload);
    } else {
      success = await createPlan(payload);
    }
    if (success) closeCreateModal();
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to save plan details.', type: 'error' });
    uploadingBanner.value = false;
  }
};

onMounted(() => fetchAll());
</script>
