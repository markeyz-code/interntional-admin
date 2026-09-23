<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200 mb-6 flex flex-wrap gap-4 items-center justify-between">
    <div class="flex-1 min-w-[200px] max-w-sm">
      <UiInput 
        id="search"
        type="text" 
        :modelValue="modelValue.search"
        @update:modelValue="updateFilter('search', $event)"
        placeholder="Search..." 
      />
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <!-- Status Filter (Optional) -->
      <UiSelect 
        v-if="statusOptions.length > 0"
        id="statusFilter"
        :modelValue="modelValue.status"
        @update:modelValue="updateFilter('status', $event)"
        :options="[{label: 'All Statuses', value: ''}, ...statusOptions]"
        class="w-40"
      />

      <!-- Role Filter (Optional) -->
      <UiSelect 
        v-if="roleOptions.length > 0"
        id="roleFilter"
        :modelValue="modelValue.role"
        @update:modelValue="updateFilter('role', $event)"
        :options="[{label: 'All Roles', value: ''}, ...roleOptions]"
        class="w-40"
      />

      <!-- Date Filters -->
      <UiDateRangePicker v-model="dateRange" />

      <button 
        @click="clearFilters"
        class="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-gray-400 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
        title="Clear Filters"
      >
        <X class="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { X } from 'lucide-vue-next';
import UiInput from '@/components/ui/Input.vue';
import UiSelect from '@/components/ui/Select.vue';
import UiDateRangePicker from '@/components/ui/DateRangePicker.vue';

export interface FilterState {
  search: string;
  status: string;
  role: string;
  startDate: string;
  endDate: string;
}

const props = withDefaults(defineProps<{
  modelValue: FilterState;
  statusOptions?: { label: string; value: string }[];
  roleOptions?: { label: string; value: string }[];
}>(), {
  statusOptions: () => [],
  roleOptions: () => []
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterState): void;
}>();

const updateFilter = (key: keyof FilterState, value: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  });
};

const dateRange = computed({
  get: () => {
    return {
      start: props.modelValue.startDate ? new Date(props.modelValue.startDate) : null,
      end: props.modelValue.endDate ? new Date(props.modelValue.endDate) : null
    };
  },
  set: (val) => {
    emit('update:modelValue', {
      ...props.modelValue,
      startDate: val.start ? val.start.toISOString() : '',
      endDate: val.end ? val.end.toISOString() : ''
    });
  }
});

const clearFilters = () => {
  emit('update:modelValue', {
    search: '',
    status: '',
    role: '',
    startDate: '',
    endDate: ''
  });
};
</script>
