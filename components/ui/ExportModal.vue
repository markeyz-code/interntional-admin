<template>
  <UiModal :isOpen="isOpen" title="Export Data" @close="$emit('close')">
    <div class="space-y-6">
      <!-- Format Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2">
            <input type="radio" v-model="exportFormat" value="csv" class="text-brand focus:ring-brand">
            <span class="text-sm text-gray-700">CSV (.csv)</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" v-model="exportFormat" value="json" class="text-brand focus:ring-brand">
            <span class="text-sm text-gray-700">JSON (.json)</span>
          </label>
        </div>
      </div>

      <!-- Field Selection -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium text-gray-700">Fields to Export</label>
          <button @click="toggleAllFields" class="text-xs text-brand hover:underline">
            {{ selectedFields.length === availableFields.length ? 'Deselect All' : 'Select All' }}
          </button>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto grid grid-cols-2 gap-3">
          <label v-for="field in availableFields" :key="field.key" class="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              :value="field.key" 
              v-model="selectedFields"
              class="rounded border-gray-300 text-brand focus:ring-brand"
            >
            <span class="text-sm text-gray-700 truncate">{{ field.label }}</span>
          </label>
        </div>
        <p v-if="selectedFields.length === 0" class="text-xs text-red-500 mt-2">Please select at least one field.</p>
      </div>
    </div>

    <template #footer>
      <button @click="$emit('close')" class="px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded">
        Cancel
      </button>
      <button 
        @click="handleExport" 
        :disabled="selectedFields.length === 0 || isExporting"
        class="px-4 py-2 text-sm text-white bg-brand rounded font-medium disabled:opacity-50 flex items-center gap-2"
      >
        <svg v-if="isExporting" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-else>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        </span>
        {{ isExporting ? 'Exporting...' : 'Export Data' }}
      </button>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import UiModal from './Modal.vue';

const props = defineProps<{
  isOpen: boolean;
  data: any[];
  availableFields: { key: string; label: string }[];
  filename?: string;
}>();

const emit = defineEmits(['close']);

const exportFormat = ref<'csv' | 'json'>('csv');
const selectedFields = ref<string[]>([]);
const isExporting = ref(false);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Default select all fields when modal opens
    selectedFields.value = props.availableFields.map(f => f.key);
    exportFormat.value = 'csv';
  }
});

const toggleAllFields = () => {
  if (selectedFields.value.length === props.availableFields.length) {
    selectedFields.value = [];
  } else {
    selectedFields.value = props.availableFields.map(f => f.key);
  }
};

const handleExport = () => {
  if (selectedFields.value.length === 0 || props.data.length === 0) return;
  isExporting.value = true;

  try {
    const dataToExport = props.data.map(item => {
      const exportedItem: any = {};
      selectedFields.value.forEach(key => {
        // Handle nested fields (e.g., 'user.firstName')
        const value = key.split('.').reduce((o, i) => (o ? o[i] : ''), item);
        exportedItem[key] = value !== undefined && value !== null ? value : '';
      });
      return exportedItem;
    });

    if (exportFormat.value === 'csv') {
      downloadCSV(dataToExport);
    } else {
      downloadJSON(dataToExport);
    }

    emit('close');
  } catch (err) {
    console.error('Export failed:', err);
  } finally {
    isExporting.value = false;
  }
};

const downloadCSV = (data: any[]) => {
  const headers = selectedFields.value;
  const headerLabels = headers.map(key => props.availableFields.find(f => f.key === key)?.label || key);
  
  const csvRows = [];
  csvRows.push(headerLabels.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  downloadBlob(csvString, 'text/csv', `${props.filename || 'export'}.csv`);
};

const downloadJSON = (data: any[]) => {
  const jsonString = JSON.stringify(data, null, 2);
  downloadBlob(jsonString, 'application/json', `${props.filename || 'export'}.json`);
};

const downloadBlob = (content: string, type: string, filename: string) => {
  const blob = new Blob([content], { type: `${type};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
