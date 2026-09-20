<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Support Enquiries</h1>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div v-if="loading" class="p-8 text-center text-gray-500">
        <UiTableSpinner />
        <p class="mt-4">Loading enquiries...</p>
      </div>

      <div v-else-if="error" class="p-8 text-center text-red-500">
        {{ error }}
      </div>

      <div v-else-if="enquiries.length === 0" class="p-12 text-center text-gray-500">
        <MessageSquare class="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p class="text-lg font-medium">No enquiries found</p>
        <p class="text-sm">When users submit messages from the landing page, they will appear here.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="p-4 text-sm font-semibold text-gray-600">Status</th>
              <th class="p-4 text-sm font-semibold text-gray-600">Date</th>
              <th class="p-4 text-sm font-semibold text-gray-600">User Details</th>
              <th class="p-4 text-sm font-semibold text-gray-600">Message</th>
              <th class="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="enquiry in enquiries" :key="enquiry._id" class="hover:bg-gray-50 transition-colors" :class="{ 'bg-blue-50/30': enquiry.status === 'unread' }">
              <td class="p-4 align-top pt-5">
                <span 
                  class="px-2.5 py-1 text-xs font-medium rounded-full"
                  :class="enquiry.status === 'unread' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ enquiry.status }}
                </span>
              </td>
              <td class="p-4 align-top pt-5 text-sm text-gray-500 whitespace-nowrap">
                {{ new Date(enquiry.createdAt).toLocaleDateString() }}
              </td>
              <td class="p-4 align-top pt-5">
                <p class="font-medium text-gray-900">{{ enquiry.name }}</p>
                <p class="text-sm text-gray-500">{{ enquiry.email }}</p>
              </td>
              <td class="p-4">
                <div class="text-sm text-gray-700 max-w-md whitespace-pre-wrap">{{ enquiry.message }}</div>
              </td>
              <td class="p-4 align-top pt-5 text-right">
                <button 
                  v-if="enquiry.status === 'unread'"
                  @click="markAsRead(enquiry._id)"
                  class="text-sm text-brand hover:text-[#1f4e70] font-medium"
                >
                  Mark as Read
                </button>
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
import { MessageSquare } from 'lucide-vue-next';
import { useGetEnquiries } from '@/composables/modules/enquiries/useGetEnquiries';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';

useSeoMeta({
  title: 'Enquiries | Admin Dashboard',
});

const { loading, error, enquiries, fetchEnquiries, markAsRead } = useGetEnquiries();

onMounted(() => {
  fetchEnquiries();
});
</script>
