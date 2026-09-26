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
        <div v-for="plan in subscriptions" :key="plan._id" class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div class="p-6 flex-1 text-center border-b border-gray-100">
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
              <td class="p-4">
                <p class="font-bold text-gray-900 text-sm">{{ plan.name }}</p>
                <p class="text-xs text-gray-500 truncate max-w-xs">{{ plan.description }}</p>
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

    <UiModal :isOpen="isCreateModalOpen" :title="isEditMode ? 'Edit Plan' : 'Create Plan'" @close="closeCreateModal">
      <form id="createPlanForm" @submit.prevent="submitCreate" class="space-y-4">
        <UiInput v-model="createForm.name" label="Plan Name" required placeholder="e.g. Premium Access" />
        <UiInput v-model.number="createForm.price" label="Price (in minor units e.g. kobo/cents)" type="number" required placeholder="500000" />
        <UiInput v-model.number="createForm.durationMonths" label="Duration (Months)" type="number" required placeholder="1" />
        <UiTextarea v-model="createForm.description" label="Description" placeholder="Plan details..." />
        
        <div class="grid grid-cols-2 gap-4 mt-4">
          <UiInput v-model.number="createForm.maxMentorshipRequests" label="Max Mentorships/mo" type="number" placeholder="5" />
          <UiInput v-model.number="createForm.eventDiscountPercentage" label="Event Discount %" type="number" placeholder="10" />
        </div>

        <div class="mt-4 space-y-2">
          <label class="block text-sm font-medium text-gray-700">Access Controls</label>
          <div class="grid grid-cols-2 gap-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="createForm.canAccessVault" class="rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700">Access Vault</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="createForm.canPostArticles" class="rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700">Post Articles</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="createForm.canAccessGlobalCommunity" class="rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700">Global Community</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="createForm.isActive" class="rounded border-gray-300 text-brand focus:ring-brand" />
              <span class="text-sm text-gray-700 font-bold">Plan is Active</span>
            </label>
          </div>
        </div>
      </form>
      <template #footer>
        <button type="button" @click="closeCreateModal" class="px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded">Cancel</button>
        <button type="submit" form="createPlanForm" :disabled="loading" class="px-4 py-2 text-sm text-white bg-brand rounded font-medium disabled:opacity-50">
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
import { CreditCard as CreditCardIcon } from 'lucide-vue-next';
import { useSubscriptions } from '@/composables/modules/subscriptions/useSubscriptions';
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
const createForm = ref({
  name: '',
  description: '',
  price: null as number | null,
  durationMonths: 1,
  maxMentorshipRequests: 0,
  canAccessVault: false,
  canPostArticles: false,
  canAccessGlobalCommunity: false,
  eventDiscountPercentage: 0,
  isActive: true,
  features: [] as string[]
});

const openCreateModal = () => {
  isEditMode.value = false;
  planToEdit.value = null;
  createForm.value = { 
    name: '', description: '', price: null, durationMonths: 1, 
    maxMentorshipRequests: 0, canAccessVault: false, canPostArticles: false, 
    canAccessGlobalCommunity: false, eventDiscountPercentage: 0,
    isActive: true, features: [] 
  };
  isCreateModalOpen.value = true;
};

const openEditModal = (plan: any) => {
  isEditMode.value = true;
  planToEdit.value = plan._id;
  createForm.value = {
    name: plan.name,
    description: plan.description || '',
    price: plan.price,
    durationMonths: plan.durationMonths,
    maxMentorshipRequests: plan.maxMentorshipRequests || 0,
    canAccessVault: plan.canAccessVault || false,
    canPostArticles: plan.canPostArticles || false,
    canAccessGlobalCommunity: plan.canAccessGlobalCommunity || false,
    eventDiscountPercentage: plan.eventDiscountPercentage || 0,
    isActive: plan.isActive,
    features: plan.features || []
  };
  isCreateModalOpen.value = true;
};

const closeCreateModal = () => {
  isCreateModalOpen.value = false;
  isEditMode.value = false;
  planToEdit.value = null;
  createForm.value = { name: '', description: '', price: null, durationMonths: 1, isActive: true, features: [] };
};

const submitCreate = async () => {
  let success = false;
  if (isEditMode.value && planToEdit.value) {
    success = await updatePlan(planToEdit.value, createForm.value);
  } else {
    success = await createPlan(createForm.value);
  }
  if (success) closeCreateModal();
};

onMounted(() => fetchAll());
</script>
