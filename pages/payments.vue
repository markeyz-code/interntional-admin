<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-bold text-gray-900 tracking-tight">Payments & Revenue</h1>
        <p class="text-sm text-gray-500 mt-1">Track transactions and subscription payments.</p>
      </div>
      <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">
        <button @click="isExportModalOpen = true" class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
          Export Data
        </button>
        <UiViewToggle v-model="viewMode" />
      </div>
    </div>

    <!-- Filters -->
    <UiTableFilters 
      v-model="filters" 
      :statusOptions="[
        { label: 'Success', value: 'SUCCESS' },
        { label: 'Failed', value: 'FAILED' },
        { label: 'Pending', value: 'PENDING' }
      ]"
    />

    <!-- Loading -->
    <div v-if="loading && payments.length === 0" class="text-center py-20">
      <UiTableSpinner />
      <p class="text-gray-500 mt-4">Loading payments...</p>
    </div>

    <div v-else-if="payments.length > 0" class="relative">
      <div v-if="loading" class="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
        <UiTableSpinner />
      </div>
      <!-- Grid Layout -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="payment in payments" :key="payment._id" class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div class="p-5 flex-1">
            <div class="flex items-center justify-between mb-4">
              <span class="text-lg font-black text-gray-900">${{ payment.amount }}</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="payment.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ payment.status }}
              </span>
            </div>
            
            <div class="space-y-2 text-sm text-gray-600 mb-4">
              <div class="flex justify-between">
                <span class="text-gray-500">Reference:</span>
                <span class="font-medium font-mono text-xs">{{ payment.reference }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Plan:</span>
                <span class="font-medium text-brand">{{ payment.planId?.name || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Date:</span>
                <span class="font-medium">{{ new Date(payment.createdAt).toLocaleDateString() }}</span>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 p-3 border-t border-gray-200 text-center">
            <span class="text-xs font-medium text-gray-500">User ID: {{ payment.userId?._id || payment.userId }}</span>
          </div>
        </div>
      </div>

      <!-- List Layout -->
      <div v-else-if="viewMode === 'list'" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Reference</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">User ID</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Plan</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="payment in payments" :key="payment._id" class="hover:bg-gray-50 transition-colors">
              <td class="p-4">
                <span class="font-mono text-xs text-gray-900">{{ payment.reference }}</span>
              </td>
              <td class="p-4">
                <span class="text-xs text-gray-500">{{ payment.userId?._id || payment.userId }}</span>
              </td>
              <td class="p-4">
                <span class="text-sm font-medium text-brand">{{ payment.planId?.name || 'N/A' }}</span>
              </td>
              <td class="p-4">
                <span class="text-sm font-bold text-gray-900">${{ payment.amount }}</span>
              </td>
              <td class="p-4">
                <span class="px-2.5 py-1 text-xs font-medium rounded-full inline-block" :class="payment.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  {{ payment.status }}
                </span>
              </td>
              <td class="p-4 text-sm text-gray-500 text-right whitespace-nowrap">
                {{ new Date(payment.createdAt).toLocaleDateString() }}
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
        title="No payments found" 
        description="There are currently no transaction records." 
        :icon="CreditCardIcon" 
      />
    </div>
    <!-- Modals -->
    <UiExportModal
      :isOpen="isExportModalOpen"
      :data="payments"
      :availableFields="[
        { key: 'user.firstName', label: 'First Name' },
        { key: 'user.lastName', label: 'Last Name' },
        { key: 'user.email', label: 'Email' },
        { key: 'amount', label: 'Amount' },
        { key: 'currency', label: 'Currency' },
        { key: 'status', label: 'Status' },
        { key: 'reference', label: 'Reference' },
        { key: 'paymentMethod', label: 'Method' },
        { key: 'createdAt', label: 'Date' }
      ]"
      filename="payments_export"
      @close="isExportModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSeoMeta } from '#imports';
import { CreditCard as CreditCardIcon } from 'lucide-vue-next';
import { usePayments } from '@/composables/modules/payments/usePayments';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';
import UiEmptyState from '@/components/ui/EmptyState.vue';
import UiViewToggle from '@/components/ui/ViewToggle.vue';
import UiTableFilters from '@/components/ui/TableFilters.vue';
import UiPagination from '@/components/ui/Pagination.vue';
import UiExportModal from '@/components/ui/ExportModal.vue';

useSeoMeta({ title: 'Payments | Admin Dashboard' });

const { loading, payments, filters, total, totalPages, fetchAll } = usePayments();
const viewMode = ref<'list' | 'grid'>('list');
const isExportModalOpen = ref(false);

onMounted(() => fetchAll());
</script>
