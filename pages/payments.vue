<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Payments</h1>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div v-if="loading" class="p-8 text-center text-gray-500">
        <UiTableSpinner />
        <p class="mt-4">Loading payments...</p>
      </div>

      <div v-else-if="payments.length === 0" class="p-12 text-center text-gray-500">
        <Wallet class="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p class="text-lg font-medium">No payments yet</p>
        <p class="text-sm">Payments will appear here when users subscribe.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="p-4 text-sm font-semibold text-gray-600">Date</th>
              <th class="p-4 text-sm font-semibold text-gray-600">User</th>
              <th class="p-4 text-sm font-semibold text-gray-600">Plan</th>
              <th class="p-4 text-sm font-semibold text-gray-600">Amount (₦)</th>
              <th class="p-4 text-sm font-semibold text-gray-600">Reference</th>
              <th class="p-4 text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="payment in payments" :key="payment._id" class="hover:bg-gray-50 transition-colors">
              <td class="p-4 text-sm text-gray-500 whitespace-nowrap">{{ new Date(payment.createdAt).toLocaleDateString() }}</td>
              <td class="p-4">
                <p class="font-medium text-gray-900">{{ payment.userId?.firstName }} {{ payment.userId?.lastName }}</p>
                <p class="text-sm text-gray-500">{{ payment.userId?.email }}</p>
              </td>
              <td class="p-4 text-gray-700">{{ payment.subscriptionId?.name || 'N/A' }}</td>
              <td class="p-4 text-gray-900 font-medium">₦{{ (payment.amount / 100).toLocaleString() }}</td>
              <td class="p-4 text-xs text-gray-500 font-mono">{{ payment.reference }}</td>
              <td class="p-4">
                <span
                  class="px-2.5 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-700': payment.status === 'success',
                    'bg-yellow-100 text-yellow-700': payment.status === 'pending',
                    'bg-red-100 text-red-700': payment.status === 'failed',
                  }"
                >
                  {{ payment.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSeoMeta } from '#imports';
import { Wallet } from 'lucide-vue-next';
import { usePayments } from '@/composables/modules/payments/usePayments';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';

useSeoMeta({ title: 'Payments | Admin Dashboard' });

const { loading, payments, fetchAll } = usePayments();

onMounted(() => { fetchAll(); });
</script>
