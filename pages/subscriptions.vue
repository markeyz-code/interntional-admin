<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Subscription Plans</h1>
      <button @click="openCreateModal" class="bg-brand hover:bg-[#1f4e70] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
        <Plus class="w-4 h-4" />
        Create Plan
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div v-if="loading" class="p-8 text-center text-gray-500">
        <UiTableSpinner />
        <p class="mt-4">Loading plans...</p>
      </div>

      <div v-else-if="subscriptions.length === 0" class="p-12 text-center text-gray-500">
        <CreditCard class="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p class="text-lg font-medium">No subscription plans yet</p>
        <p class="text-sm">Create your first plan to get started.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="p-4 text-sm font-semibold text-gray-600">Plan Name</th>
              <th class="p-4 text-sm font-semibold text-gray-600">Price (₦)</th>
              <th class="p-4 text-sm font-semibold text-gray-600">Duration</th>
              <th class="p-4 text-sm font-semibold text-gray-600">Features</th>
              <th class="p-4 text-sm font-semibold text-gray-600">Status</th>
              <th class="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="plan in subscriptions" :key="plan._id" class="hover:bg-gray-50 transition-colors">
              <td class="p-4">
                <p class="font-medium text-gray-900">{{ plan.name }}</p>
                <p class="text-sm text-gray-500">{{ plan.description }}</p>
              </td>
              <td class="p-4 text-gray-900 font-medium">₦{{ (plan.price / 100).toLocaleString() }}</td>
              <td class="p-4 text-gray-600">{{ plan.durationMonths }} month{{ plan.durationMonths > 1 ? 's' : '' }}</td>
              <td class="p-4">
                <div class="flex flex-wrap gap-1">
                  <span v-for="(f, i) in plan.features" :key="i" class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ f }}</span>
                </div>
              </td>
              <td class="p-4">
                <span class="px-2.5 py-1 text-xs font-medium rounded-full" :class="plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                  {{ plan.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <button @click="openEditModal(plan)" class="text-sm text-brand hover:text-[#1f4e70] font-medium">Edit</button>
                <button v-if="plan.isActive" @click="handleDelete(plan._id)" class="text-sm text-red-500 hover:text-red-700 font-medium">Deactivate</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="showModal = false"></div>
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-6">{{ editingPlan ? 'Edit Plan' : 'Create Plan' }}</h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
              <input v-model="form.name" type="text" required class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand" placeholder="e.g. Basic Plan" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input v-model="form.description" type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand" placeholder="Short description" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                <input v-model.number="formPriceNaira" type="number" required min="0" step="0.01" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand" placeholder="5000" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                <input v-model.number="form.durationMonths" type="number" required min="1" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand" placeholder="1" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
              <textarea v-model="featuresText" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand resize-none" placeholder="Access to Vault, Mentorship, Career Hub"></textarea>
            </div>
            <div v-if="editingPlan" class="flex items-center gap-2">
              <input v-model="form.isActive" type="checkbox" id="isActive" class="rounded border-gray-300" />
              <label for="isActive" class="text-sm text-gray-700">Active</label>
            </div>
            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="showModal = false" class="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" :disabled="loading" class="px-6 py-2.5 text-sm font-medium text-white bg-brand hover:bg-[#1f4e70] rounded-lg disabled:opacity-70">
                {{ editingPlan ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSeoMeta } from '#imports';
import { Plus, CreditCard } from 'lucide-vue-next';
import { useSubscriptions } from '@/composables/modules/subscriptions/useSubscriptions';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';

useSeoMeta({ title: 'Subscriptions | Admin Dashboard' });

const { loading, subscriptions, fetchAll, createPlan, updatePlan, deletePlan } = useSubscriptions();

const showModal = ref(false);
const editingPlan = ref<any>(null);
const form = ref({ name: '', description: '', durationMonths: 1, isActive: true });
const formPriceNaira = ref(0);
const featuresText = ref('');

const openCreateModal = () => {
  editingPlan.value = null;
  form.value = { name: '', description: '', durationMonths: 1, isActive: true };
  formPriceNaira.value = 0;
  featuresText.value = '';
  showModal.value = true;
};

const openEditModal = (plan: any) => {
  editingPlan.value = plan;
  form.value = { name: plan.name, description: plan.description, durationMonths: plan.durationMonths, isActive: plan.isActive };
  formPriceNaira.value = plan.price / 100;
  featuresText.value = plan.features?.join(', ') || '';
  showModal.value = true;
};

const handleSubmit = async () => {
  const data = {
    ...form.value,
    price: Math.round(formPriceNaira.value * 100), // Convert to kobo
    features: featuresText.value.split(',').map((f: string) => f.trim()).filter(Boolean),
  };

  let success: boolean;
  if (editingPlan.value) {
    success = await updatePlan(editingPlan.value._id, data);
  } else {
    success = await createPlan(data);
  }
  if (success) showModal.value = false;
};

const handleDelete = async (id: string) => {
  if (confirm('Deactivate this plan?')) {
    await deletePlan(id);
  }
};

onMounted(() => { fetchAll(); });
</script>
