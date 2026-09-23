<template>
  <div class="relative w-full h-full min-h-[300px]">
    <component
      v-if="chartData && isMounted"
      :is="chartComponent"
      :data="chartData"
      :options="mergedOptions"
      class="w-full h-full"
    />
    <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
      <span v-if="!isMounted">Loading chart...</span>
      <span v-else>No data available</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value: string) => ['line', 'bar', 'doughnut'].includes(value)
  },
  data: {
    type: Object,
    default: () => null
  },
  options: {
    type: Object,
    default: () => ({})
  }
});

const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});

const chartComponent = computed(() => {
  switch (props.type) {
    case 'line': return Line;
    case 'bar': return Bar;
    case 'doughnut': return Doughnut;
    default: return Line;
  }
});

const chartData = computed(() => props.data);

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: "'Inter', sans-serif",
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
      titleFont: { family: "'Inter', sans-serif", size: 13 },
      bodyFont: { family: "'Inter', sans-serif", size: 12 },
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
    }
  },
  elements: {
    line: {
      tension: 0.4 // smooth curves
    }
  }
};

const mergedOptions = computed(() => {
  // Deep merge for plugins if needed, but a simple spread works for most overrides
  return {
    ...defaultOptions,
    ...props.options,
    plugins: {
      ...defaultOptions.plugins,
      ...(props.options.plugins || {})
    }
  };
});
</script>
