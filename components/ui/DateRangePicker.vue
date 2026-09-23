<template>
  <div class="relative" ref="pickerContainer">
    <!-- Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
    >
      <CalendarIcon class="w-4 h-4 text-gray-400" />
      <span>{{ formattedDateRange }}</span>
      <ChevronDownIcon class="w-4 h-4 text-gray-400 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown Panel -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-[90vw] md:w-[700px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col md:flex-row overflow-hidden"
    >
      <!-- Presets Sidebar -->
      <div class="w-full md:w-48 bg-gray-50 border-r border-gray-200 flex flex-col md:h-auto overflow-x-auto md:overflow-y-auto">
        <div class="p-3 border-b border-gray-200 flex justify-between items-center md:hidden">
          <span class="text-xs font-semibold text-gray-500 uppercase">Presets</span>
          <button @click="isOpen = false" class="p-1 rounded-md hover:bg-gray-200"><XIcon class="w-4 h-4 text-gray-500" /></button>
        </div>
        <div class="p-2 flex md:flex-col gap-1 overflow-x-auto">
          <button
            v-for="preset in presets"
            :key="preset.label"
            @click="selectPreset(preset)"
            class="whitespace-nowrap md:whitespace-normal text-left px-3 py-2 text-sm rounded-md transition-colors w-full"
            :class="[
              activePreset === preset.label
                ? 'bg-brand/10 text-brand font-medium'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            ]"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <!-- Main Calendar Area -->
      <div class="flex-1 flex flex-col">
        <!-- Top bar with date inputs -->
        <div class="flex flex-col md:flex-row items-center justify-between p-4 border-b border-gray-200 gap-4">
          <div class="flex items-center gap-3 w-full md:w-auto">
            <div class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 min-w-[120px] text-center">
              {{ tempStartDate ? format(tempStartDate, 'dd MMM yyyy') : 'Start Date' }}
            </div>
            <span class="text-gray-400">-</span>
            <div class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 min-w-[120px] text-center">
              {{ tempEndDate ? format(tempEndDate, 'dd MMM yyyy') : 'End Date' }}
            </div>
          </div>
          
          <div class="hidden md:flex items-center gap-2">
            <button @click="clear" class="text-sm text-brand hover:text-brand-dark px-2 font-medium">Clear filters</button>
            <button @click="isOpen = false" class="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5">Cancel</button>
            <button @click="apply" class="text-sm bg-brand/20 text-brand hover:bg-brand/30 px-4 py-1.5 rounded-md font-medium transition-colors">Apply</button>
          </div>
        </div>

        <!-- Dual Calendars -->
        <div class="p-4 flex flex-col md:flex-row gap-8 justify-center overflow-x-auto">
          
          <!-- Left Calendar -->
          <div class="calendar-wrapper">
            <div class="flex items-center justify-between mb-4">
              <button @click="prevLeftMonth" class="p-1 rounded hover:bg-gray-100 text-gray-500">
                <ChevronLeftIcon class="w-5 h-5" />
              </button>
              <div class="font-medium text-sm text-gray-900">{{ format(leftMonth, 'MMMM yyyy') }}</div>
              <button @click="nextLeftMonth" class="p-1 rounded hover:bg-gray-100 text-gray-500 md:hidden">
                <ChevronRightIcon class="w-5 h-5" />
              </button>
              <div class="w-7 h-7 hidden md:block"></div> <!-- Spacer for layout -->
            </div>
            <div class="grid grid-cols-7 gap-1 text-center mb-2">
              <span v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="day" class="text-xs font-medium text-gray-400 w-8">{{ day }}</span>
            </div>
            <div class="grid grid-cols-7 gap-1">
              <button
                v-for="day in leftDays"
                :key="day.key"
                @click="onDateClick(day.date)"
                @mouseenter="hoverDate = day.date"
                class="w-8 h-8 rounded-full text-sm flex items-center justify-center transition-colors relative z-10"
                :class="getDayClasses(day.date, day.isCurrentMonth)"
              >
                {{ day.date.getDate() }}
              </button>
            </div>
          </div>

          <!-- Right Calendar -->
          <div class="calendar-wrapper hidden md:block">
            <div class="flex items-center justify-between mb-4">
              <div class="w-7 h-7"></div> <!-- Spacer -->
              <div class="font-medium text-sm text-gray-900">{{ format(rightMonth, 'MMMM yyyy') }}</div>
              <button @click="nextRightMonth" class="p-1 rounded hover:bg-gray-100 text-gray-500">
                <ChevronRightIcon class="w-5 h-5" />
              </button>
            </div>
            <div class="grid grid-cols-7 gap-1 text-center mb-2">
              <span v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="day" class="text-xs font-medium text-gray-400 w-8">{{ day }}</span>
            </div>
            <div class="grid grid-cols-7 gap-1">
              <button
                v-for="day in rightDays"
                :key="day.key"
                @click="onDateClick(day.date)"
                @mouseenter="hoverDate = day.date"
                class="w-8 h-8 rounded-full text-sm flex items-center justify-center transition-colors relative z-10"
                :class="getDayClasses(day.date, day.isCurrentMonth)"
              >
                {{ day.date.getDate() }}
              </button>
            </div>
          </div>

        </div>

        <!-- Mobile Actions -->
        <div class="md:hidden p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <button @click="clear" class="text-sm text-brand font-medium">Clear filters</button>
          <div class="flex gap-2">
            <button @click="isOpen = false" class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md">Cancel</button>
            <button @click="apply" class="px-4 py-2 text-sm text-white bg-brand rounded-md font-medium">Apply</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Calendar as CalendarIcon, ChevronDown as ChevronDownIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, X as XIcon } from 'lucide-vue-next';
import { 
  format, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, isBefore, isAfter, 
  subDays, startOfToday, endOfToday, subMonths as subM, startOfDay
} from 'date-fns';

const props = defineProps<{
  modelValue?: { start: Date | null, end: Date | null }
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: { start: Date | null, end: Date | null }): void
}>();

const isOpen = ref(false);
const pickerContainer = ref<HTMLElement | null>(null);

// State
const tempStartDate = ref<Date | null>(props.modelValue?.start || null);
const tempEndDate = ref<Date | null>(props.modelValue?.end || null);
const hoverDate = ref<Date | null>(null);
const activePreset = ref<string>('');

// Calendars state
const today = startOfToday();
const leftMonth = ref(startOfMonth(tempStartDate.value || today));
const rightMonth = ref(addMonths(leftMonth.value, 1));

// Presets
const presets = [
  { label: 'Today', getRange: () => ({ start: startOfToday(), end: endOfToday() }) },
  { label: 'Last 3 Days', getRange: () => ({ start: subDays(startOfToday(), 2), end: endOfToday() }) },
  { label: 'Last 7 Days', getRange: () => ({ start: subDays(startOfToday(), 6), end: endOfToday() }) },
  { label: 'Last 30 Days', getRange: () => ({ start: subDays(startOfToday(), 29), end: endOfToday() }) },
  { label: 'This Month', getRange: () => ({ start: startOfMonth(today), end: endOfToday() }) },
  { label: 'Last Month', getRange: () => {
    const lastMonth = subM(today, 1);
    return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
  }}
];

// Computed Display text
const formattedDateRange = computed(() => {
  if (props.modelValue?.start && props.modelValue?.end) {
    // Check if it matches a preset
    const start = startOfDay(props.modelValue.start);
    const end = startOfDay(props.modelValue.end);
    for (const preset of presets) {
      const pRange = preset.getRange();
      if (isSameDay(start, startOfDay(pRange.start)) && isSameDay(end, startOfDay(pRange.end))) {
        return preset.label;
      }
    }
    return `${format(props.modelValue.start, 'dd MMM yyyy')} - ${format(props.modelValue.end, 'dd MMM yyyy')}`;
  }
  return 'Last 30 Days';
});

// Sync from props
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    tempStartDate.value = newVal.start;
    tempEndDate.value = newVal.end;
    if (newVal.start) {
      leftMonth.value = startOfMonth(newVal.start);
      rightMonth.value = addMonths(leftMonth.value, 1);
    }
  }
}, { deep: true });

// Calendar days generation
const getDaysForMonth = (monthStr: Date) => {
  const start = startOfWeek(startOfMonth(monthStr));
  const end = endOfWeek(endOfMonth(monthStr));
  return eachDayOfInterval({ start, end }).map(date => ({
    date,
    isCurrentMonth: isSameMonth(date, monthStr),
    key: date.toISOString()
  }));
};

const leftDays = computed(() => getDaysForMonth(leftMonth.value));
const rightDays = computed(() => getDaysForMonth(rightMonth.value));

// Actions
const prevLeftMonth = () => {
  leftMonth.value = subM(leftMonth.value, 1);
  rightMonth.value = subM(rightMonth.value, 1);
};
const nextLeftMonth = () => {
  leftMonth.value = addMonths(leftMonth.value, 1);
  rightMonth.value = addMonths(rightMonth.value, 1);
};
const nextRightMonth = () => {
  rightMonth.value = addMonths(rightMonth.value, 1);
  leftMonth.value = addMonths(leftMonth.value, 1);
};

const selectPreset = (preset: typeof presets[0]) => {
  activePreset.value = preset.label;
  const range = preset.getRange();
  tempStartDate.value = range.start;
  tempEndDate.value = range.end;
  leftMonth.value = startOfMonth(range.start);
  rightMonth.value = addMonths(leftMonth.value, 1);
};

const onDateClick = (date: Date) => {
  activePreset.value = '';
  if (!tempStartDate.value || (tempStartDate.value && tempEndDate.value)) {
    // Start new selection
    tempStartDate.value = date;
    tempEndDate.value = null;
  } else if (tempStartDate.value && !tempEndDate.value) {
    // Complete selection
    if (isBefore(date, tempStartDate.value)) {
      tempEndDate.value = tempStartDate.value;
      tempStartDate.value = date;
    } else {
      tempEndDate.value = date;
    }
  }
};

const getDayClasses = (date: Date, isCurrentMonth: boolean) => {
  const classes = [];
  
  if (!isCurrentMonth) classes.push('text-gray-300 pointer-events-none');
  else classes.push('cursor-pointer');

  const isStart = tempStartDate.value && isSameDay(date, tempStartDate.value);
  const isEnd = tempEndDate.value && isSameDay(date, tempEndDate.value);
  const isHoveredEnd = !tempEndDate.value && tempStartDate.value && hoverDate.value && isSameDay(date, hoverDate.value) && isAfter(hoverDate.value, tempStartDate.value);
  
  const isBetween = 
    (tempStartDate.value && tempEndDate.value && isWithinInterval(date, { start: tempStartDate.value, end: tempEndDate.value })) ||
    (tempStartDate.value && !tempEndDate.value && hoverDate.value && isAfter(hoverDate.value, tempStartDate.value) && isWithinInterval(date, { start: tempStartDate.value, end: hoverDate.value }));

  if (isStart || isEnd) {
    classes.push('bg-brand text-white font-medium hover:bg-brand-dark');
  } else if (isBetween) {
    classes.push('bg-brand/10 text-brand-dark');
  } else if (isCurrentMonth) {
    classes.push('text-gray-700 hover:bg-gray-100');
  }

  return classes.join(' ');
};

const clear = () => {
  tempStartDate.value = null;
  tempEndDate.value = null;
  activePreset.value = '';
};

const apply = () => {
  if (tempStartDate.value && tempEndDate.value) {
    emit('update:modelValue', { start: tempStartDate.value, end: tempEndDate.value });
  } else {
    emit('update:modelValue', { start: null, end: null });
  }
  isOpen.value = false;
};

// Click outside
const closeDropdown = (e: MouseEvent) => {
  if (isOpen.value && pickerContainer.value && !pickerContainer.value.contains(e.target as Node)) {
    isOpen.value = false;
    // reset temps to actual
    tempStartDate.value = props.modelValue?.start || null;
    tempEndDate.value = props.modelValue?.end || null;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', closeDropdown);
});
</script>
