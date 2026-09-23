<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Enquiries</h1>
        <p class="text-sm text-gray-500 mt-1">Manage messages and inquiries from users.</p>
      </div>
      <div class="flex items-center gap-3">
        <UiViewToggle v-model="viewMode" />
      </div>
    </div>

    <!-- Filters -->
    <UiTableFilters 
      v-model="filters" 
      :statusOptions="[
        { label: 'Unread', value: 'unread' },
        { label: 'Read', value: 'read' }
      ]"
    />

    <!-- Loading -->
    <div v-if="loading && enquiries.length === 0" class="text-center py-20">
      <UiTableSpinner />
      <p class="text-gray-500 mt-4">Loading enquiries...</p>
    </div>

    <div v-else-if="enquiries.length > 0" class="relative">
      <div v-if="loading" class="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
        <UiTableSpinner />
      </div>
      <!-- Grid Layout -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="enquiry in enquiries" :key="enquiry._id" class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col" :class="{'opacity-75': enquiry.status === 'read'}">
          <div class="p-5 flex-1">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider" :class="enquiry.status === 'unread' ? 'text-brand' : 'text-gray-500'">
                {{ enquiry.status }}
              </span>
              <span class="text-xs text-gray-500">{{ new Date(enquiry.createdAt).toLocaleDateString() }}</span>
            </div>
            
            <h3 class="font-bold text-gray-900 text-lg mb-1 truncate">{{ enquiry.name }}</h3>
            <p class="text-sm font-medium text-gray-600 mb-4 truncate">{{ enquiry.email }}</p>
            
            <div class="bg-gray-50 p-3 rounded border border-gray-100 mb-4">
              <p class="text-sm text-gray-700 whitespace-pre-wrap text-sm line-clamp-4">{{ enquiry.message }}</p>
            </div>
          </div>
          <div class="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
            <button 
              v-if="enquiry.status === 'unread'"
              @click="markAsRead(enquiry._id)"
              class="text-sm font-medium text-brand hover:underline"
            >
              Mark as read
            </button>
            <span v-else class="text-sm text-gray-400 font-medium">Read</span>
            <a :href="`mailto:${enquiry.email}`" class="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1">
              <MailIcon class="w-4 h-4" /> Reply
            </a>
          </div>
        </div>
      </div>

      <!-- List Layout -->
      <div v-else-if="viewMode === 'list'" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Sender Name</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase w-1/3">Message</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th class="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="enquiry in enquiries" :key="enquiry._id" class="hover:bg-gray-50 transition-colors">
              <td class="p-4">
                 <span class="px-2 py-1 rounded text-xs font-medium" :class="enquiry.status === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'">
                   {{ enquiry.status }}
                 </span>
              </td>
              <td class="p-4">
                <p class="font-medium text-gray-900 text-sm whitespace-nowrap">{{ enquiry.name }}</p>
              </td>
              <td class="p-4">
                <span class="text-sm text-gray-600">{{ enquiry.email }}</span>
              </td>
              <td class="p-4">
                <p class="text-xs text-gray-600 truncate max-w-xs" :title="enquiry.message">{{ enquiry.message }}</p>
              </td>
              <td class="p-4 text-sm text-gray-500 whitespace-nowrap">
                {{ new Date(enquiry.createdAt).toLocaleDateString() }}
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-3">
                  <button 
                    v-if="enquiry.status === 'unread'"
                    @click="markAsRead(enquiry._id)"
                    class="text-sm font-medium text-brand hover:underline"
                  >
                    Mark read
                  </button>
                  <a :href="`mailto:${enquiry.email}`" class="text-sm font-medium text-gray-700 hover:text-gray-900 p-1 bg-white border border-gray-300 rounded">
                    <MailIcon class="w-4 h-4" />
                  </a>
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
        title="No enquiries" 
        description="There are currently no enquiries in the system." 
        :icon="MessageSquareIcon" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSeoMeta } from '#imports';
import { MessageSquare as MessageSquareIcon, Mail as MailIcon } from 'lucide-vue-next';
import { useGetEnquiries } from '@/composables/modules/enquiries/useGetEnquiries';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';
import UiEmptyState from '@/components/ui/EmptyState.vue';
import UiViewToggle from '@/components/ui/ViewToggle.vue';
import UiTableFilters from '@/components/ui/TableFilters.vue';
import UiPagination from '@/components/ui/Pagination.vue';

useSeoMeta({ title: 'Enquiries | Admin Dashboard' });

const { loading, enquiries, filters, total, totalPages, fetchEnquiries, markAsRead } = useGetEnquiries();
const viewMode = ref<'list' | 'grid'>('list');

onMounted(() => fetchEnquiries());
</script>
