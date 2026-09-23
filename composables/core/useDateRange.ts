import { ref, watch } from 'vue';
import { startOfToday, subDays, endOfToday } from 'date-fns';

const today = startOfToday();
const globalDateRange = ref({
  start: subDays(today, 29),
  end: endOfToday()
});

export const useDateRange = () => {
  // Ensure we always have Date objects (Nuxt SSR serializes them to strings)
  if (typeof globalDateRange.value.start === 'string') {
    globalDateRange.value.start = new Date(globalDateRange.value.start);
  }
  if (typeof globalDateRange.value.end === 'string') {
    globalDateRange.value.end = new Date(globalDateRange.value.end);
  }

  const setDateRange = (range: { start: Date | null, end: Date | null }) => {
    globalDateRange.value = {
      start: range.start || subDays(startOfToday(), 29),
      end: range.end || endOfToday()
    };
  };

  return {
    dateRange: globalDateRange,
    setDateRange
  };
};
