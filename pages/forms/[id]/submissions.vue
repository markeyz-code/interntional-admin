<template>
  <div class="space-y-6 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-4 bg-white p-6 rounded-xl border border-gray-200">
      <NuxtLink to="/forms" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </NuxtLink>
      <div>
        <h1 class="text-xl font-bold text-gray-900">{{ form?.title || 'Form Submissions' }}</h1>
        <p class="text-sm text-gray-500">{{ submissions.length }} Responses Total</p>
      </div>
      <div class="ml-auto flex items-center gap-3">
        <button @click="exportToExcel" v-if="submissions.length > 0" class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Export Excel
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
      
      <!-- Filters Sidebar -->
      <div class="lg:col-span-1 space-y-4">
        <div class="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
          <h3 class="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Filters</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-2">Search Name/Email</label>
              <input v-model="searchQuery" type="text" placeholder="Search..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand focus:border-brand" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-2">Status</label>
              <div class="space-y-2">
                <label v-for="status in statusOptions" :key="status.value" class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="filterStatus" :value="status.value" class="text-brand focus:ring-brand">
                  <span class="text-sm text-gray-700">{{ status.label }}</span>
                </label>
              </div>
            </div>
            
            <button @click="resetFilters" class="w-full mt-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Submissions List -->
      <div class="lg:col-span-3 space-y-4">
        <div v-if="filteredSubmissions.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          No submissions found matching your filters.
        </div>
        
        <div v-for="sub in filteredSubmissions" :key="sub._id" class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div class="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 cursor-pointer" @click="toggleExpand(sub._id)">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-sm">
                {{ (sub.submitterName || 'A')[0].toUpperCase() }}
              </div>
              <div>
                <h3 class="font-bold text-gray-900">{{ sub.submitterName || 'Anonymous' }}</h3>
                <p class="text-xs text-gray-500">{{ sub.submitterEmail }} • {{ new Date(sub.createdAt).toLocaleString() }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4" @click.stop>
              <UiSelect :id="`status-${sub._id}`" v-model="sub.status" :options="statusDropdownOptions" @update:modelValue="updateSubStatus(sub)" inputClass="text-xs font-bold uppercase px-3 py-1.5 rounded-lg border border-gray-200 bg-white min-w-[130px]" />
              <button class="p-2 text-gray-400 hover:text-gray-900 transition-colors" @click="toggleExpand(sub._id)">
                <svg class="w-5 h-5 transform transition-transform" :class="{ 'rotate-180': expandedSubId === sub._id }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
            </div>
          </div>
          
          <!-- Expanded Content -->
          <div v-if="expandedSubId === sub._id" class="p-6 space-y-6">
            <div v-for="(val, key) in sub.data" :key="key">
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ key }}</h4>
              <div v-if="isHtmlContent(val as string)" class="prose prose-sm max-w-none text-gray-800 bg-gray-50/50 rounded-lg p-4 border border-gray-100 response-html-content" v-html="val"></div>
              <div v-else class="text-gray-800 text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100">{{ val }}</div>
            </div>
            
            <div class="flex justify-end pt-4 border-t border-gray-100">
              <button @click="deleteSub(sub._id)" class="px-4 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                Delete Submission
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSeoMeta } from '#imports';
import { formsApi } from '@/api_factory/modules/forms';
import { useCustomToast } from '@/composables/core/useCustomToast';
import UiSelect from '@/components/ui/Select.vue';
import * as XLSX from 'xlsx';

const route = useRoute();
const formId = route.params.id as string;
const { showToast } = useCustomToast();

const loading = ref(true);
const form = ref<any>(null);
const submissions = ref<any[]>([]);
const expandedSubId = ref<string | null>(null);

// Filters
const filterStatus = ref('all');
const searchQuery = ref('');

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under-review' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' }
];

const statusDropdownOptions = [
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under-review' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' }
];

const filteredSubmissions = computed(() => {
  let filtered = submissions.value;
  
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(s => s.status === filterStatus.value);
  }
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(s => 
      (s.submitterName && s.submitterName.toLowerCase().includes(q)) || 
      (s.submitterEmail && s.submitterEmail.toLowerCase().includes(q))
    );
  }
  
  return filtered;
});

const resetFilters = () => {
  filterStatus.value = 'all';
  searchQuery.value = '';
};

const toggleExpand = (id: string) => {
  expandedSubId.value = expandedSubId.value === id ? null : id;
};

const fetchData = async () => {
  loading.value = true;
  try {
    const [formRes, subsRes] = await Promise.all([
      formsApi.getForm(formId),
      formsApi.getSubmissions(formId)
    ]);
    
    form.value = formRes.data || formRes;
    submissions.value = subsRes.data || subsRes;
    
    useSeoMeta({ title: `Submissions - ${form.value?.title} | Admin` });
  } catch (error) {
    console.error(error);
    showToast({ title: 'Error', message: 'Failed to load submissions.', type: 'error' });
  } finally {
    loading.value = false;
  }
};

const updateSubStatus = async (sub: any) => {
  try {
    await formsApi.updateSubmission(sub._id, { status: sub.status });
    showToast({ 
      title: 'Status Updated', 
      message: `Submission status successfully changed to ${sub.status}. An email and notification have been sent.`, 
      type: 'success' 
    });
  } catch (e) {
    showToast({ title: 'Update Failed', message: 'Could not update submission status.', type: 'error' });
    console.error(e);
  }
};

const deleteSub = async (id: string) => {
  if (!confirm('Are you sure you want to delete this submission?')) return;
  try {
    await formsApi.deleteSubmission(id);
    submissions.value = submissions.value.filter(s => s._id !== id);
    showToast({ title: 'Deleted', message: 'Submission deleted.', type: 'success' });
  } catch (e) {
    showToast({ title: 'Error', message: 'Failed to delete.', type: 'error' });
  }
};

const exportToExcel = () => {
  if (!submissions.value || submissions.value.length === 0) return;
  
  const flattened = submissions.value.map(sub => {
    return {
      'Date Submitted': new Date(sub.createdAt).toLocaleString(),
      'Submitter Name': sub.submitterName || 'Anonymous',
      'Submitter Email': sub.submitterEmail || 'N/A',
      'Status': sub.status,
      ...(sub.data || {})
    };
  });
  
  const ws = XLSX.utils.json_to_sheet(flattened);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Submissions');
  XLSX.writeFile(wb, `${form.value?.title || 'Form'}_Responses.xlsx`);
};

const isHtmlContent = (val: string): boolean => {
  if (!val || typeof val !== 'string') return false;
  return /<[a-z][\s\S]*>/i.test(val);
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Rendered HTML content in responses */
.response-html-content :deep(h1) { font-size: 1.5em; font-weight: 700; margin: 0.4em 0 0.2em; color: #111827; }
.response-html-content :deep(h2) { font-size: 1.25em; font-weight: 700; margin: 0.3em 0 0.15em; color: #1f2937; }
.response-html-content :deep(h3) { font-size: 1.1em; font-weight: 600; margin: 0.25em 0 0.1em; color: #374151; }
.response-html-content :deep(p) { margin: 0.25em 0; line-height: 1.6; }
.response-html-content :deep(ul) { list-style-type: disc; padding-left: 1.5em; margin: 0.3em 0; }
.response-html-content :deep(ol) { list-style-type: decimal; padding-left: 1.5em; margin: 0.3em 0; }
.response-html-content :deep(li) { margin: 0.1em 0; }
.response-html-content :deep(blockquote) { border-left: 3px solid #60a5fa; padding: 0.4em 0.8em; margin: 0.4em 0; background: #eff6ff; border-radius: 0 6px 6px 0; color: #1e40af; font-style: italic; }
.response-html-content :deep(pre) { background: #1f2937; color: #f9fafb; padding: 0.8em; border-radius: 6px; font-family: monospace; font-size: 0.85em; overflow-x: auto; margin: 0.4em 0; }
.response-html-content :deep(code) { background: #f3f4f6; padding: 1px 4px; border-radius: 3px; font-family: monospace; font-size: 0.9em; color: #e11d48; }
.response-html-content :deep(a) { color: #2563eb; text-decoration: underline; }
.response-html-content :deep(img) { max-width: 100%; height: auto; border-radius: 6px; margin: 6px 0; }
.response-html-content :deep(table) { width: 100%; border-collapse: collapse; margin: 6px 0; }
.response-html-content :deep(th), .response-html-content :deep(td) { border: 1px solid #d1d5db; padding: 6px 10px; text-align: left; font-size: 0.85em; }
.response-html-content :deep(th) { background: #f9fafb; font-weight: 600; }
.response-html-content :deep(hr) { border: none; border-top: 1px solid #e5e7eb; margin: 0.6em 0; }
</style>
