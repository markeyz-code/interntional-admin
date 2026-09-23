<template>
  <div class="space-y-8">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">Ecosystem Dashboard</h1>
        <p class="text-gray-500 mt-1">Aggregated metrics, revenue, and platform health.</p>
      </div>
      <div class="flex gap-3">
        <button class="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm shadow-brand/20">
          <Download class="w-4 h-4" />
          Export Report
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loadingUsers || loadingAnalytics" class="flex justify-center py-32">
      <UiTableSpinner />
    </div>

    <div v-else class="space-y-8">
      <!-- HERO METRICS -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Revenue Card -->
        <div :class="[activeBusiness === 'uniVerse' ? 'bg-gradient-to-br from-indigo-600 to-gray-900' : 'bg-gradient-to-br from-brand to-gray-900', 'p-6 rounded-xl shadow-lg border border-gray-800 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform']">
          <div class="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div class="flex justify-between items-start mb-4 relative z-10">
            <div class="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <DollarSign class="w-5 h-5 text-white/80" />
            </div>
            <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-white/10 text-white/90 rounded-full border border-white/20">
              <TrendingUp class="w-3 h-3" />
              +12.5%
            </span>
          </div>
          <div class="text-sm font-semibold text-white/70 uppercase tracking-wider mb-1 relative z-10">Total Revenue</div>
          <div class="text-4xl font-black relative z-10">{{ formatCurrency(dashboardStats?.totalRevenue || 0) }}</div>
          <div class="mt-4 text-sm text-white/70 relative z-10 flex justify-between items-center">
            <span>Monthly Run Rate</span>
            <span class="font-medium text-white">{{ formatCurrency(dashboardStats?.monthlyRevenue || 0) }}</span>
          </div>
        </div>

        <!-- Users Card -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group">
          <div class="flex justify-between items-start mb-4">
            <div class="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users class="w-5 h-5 text-blue-600" />
            </div>
             <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
              <TrendingUp class="w-3 h-3" />
              +8.2%
            </span>
          </div>
          <div class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Users</div>
          <div class="text-4xl font-black text-gray-900">{{ formatNumber(userStats?.totalUsers || 0) }}</div>
          <div class="mt-4 text-sm text-gray-500 flex justify-between items-center">
             <span>Pending Approvals</span>
             <span class="font-bold text-amber-500">{{ userStats?.pendingUsers || 0 }}</span>
          </div>
        </div>

        <!-- Subscriptions Card -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group">
          <div class="flex justify-between items-start mb-4">
            <div class="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard class="w-5 h-5 text-emerald-600" />
            </div>
             <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
              <TrendingUp class="w-3 h-3" />
              +4.1%
            </span>
          </div>
          <div class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Active Subscriptions</div>
          <div class="text-4xl font-black text-gray-900">{{ formatNumber(userStats?.activeSubscriptions || 0) }}</div>
          <div class="mt-4 text-sm text-gray-500 flex justify-between items-center">
             <span>New this month</span>
             <span class="font-bold text-gray-900">{{ dashboardStats?.monthlySignups || 0 }}</span>
          </div>
        </div>

        <!-- Activity Card -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group">
          <div class="flex justify-between items-start mb-4">
            <div class="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity class="w-5 h-5 text-orange-600" />
            </div>
             <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
              <Activity class="w-3 h-3" />
              Active
            </span>
          </div>
          <div class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{{ isCustomRange ? 'Page Views' : 'Today\'s Page Views' }}</div>
          <div class="text-4xl font-black text-gray-900">{{ formatNumber(dashboardStats?.todayPageViews || 0) }}</div>
          <div class="mt-4 text-sm text-gray-500 flex justify-between items-center">
             <span>{{ isCustomRange ? 'Logins' : 'Today\'s Logins' }}</span>
             <span class="font-bold text-gray-900">{{ dashboardStats?.todayLogins || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- CHARTS SECTION -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Main Revenue Chart (Span 2) -->
        <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Revenue Over Time</h2>
              <p class="text-sm text-gray-500">Daily revenue for the past 14 days</p>
            </div>
            <div class="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 font-medium text-gray-700">
              <BarChart3 class="w-4 h-4 text-indigo-500" />
              {{ formatCurrency(dashboardStats?.totalRevenue || 0) }} Total
            </div>
          </div>
          <div class="h-72">
            <UiChart type="bar" :data="revenueChartData" :options="revenueChartOptions" />
          </div>
        </div>

        <!-- Demographics Doughnut (Span 1) -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div class="mb-6">
            <h2 class="text-lg font-bold text-gray-900">Department Engagement</h2>
            <p class="text-sm text-gray-500">Active users by department</p>
          </div>
          <div class="h-64 mt-4">
            <UiChart type="doughnut" :data="departmentChartData" :options="doughnutOptions" />
          </div>
        </div>
        
      </div>
      
      <!-- CHARTS SECTION 2 & RECENT ACTIVITY -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Platform Traffic -->
        <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div class="mb-6">
            <h2 class="text-lg font-bold text-gray-900">Platform Traffic</h2>
            <p class="text-sm text-gray-500">Daily page views over the last 14 days</p>
          </div>
          <div class="h-72">
            <UiChart type="line" :data="trafficChartData" :options="lineOptions" />
          </div>
        </div>

        <!-- Recent Activity Feed -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-900">Recent Activity</h2>
            <p class="text-sm text-gray-500">Latest platform events</p>
          </div>
          <div class="flex-1 overflow-auto p-2" v-if="recentActivity.length">
            <div v-for="event in recentActivity.slice(0, 5)" :key="event._id" class="px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex gap-3">
              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MousePointer2 v-if="event.event === 'page_view'" class="w-4 h-4 text-gray-500" />
                <LogIn v-else-if="event.event === 'login'" class="w-4 h-4 text-blue-500" />
                <DollarSign v-else-if="event.event === 'payment_success'" class="w-4 h-4 text-green-500" />
                <Download class="w-4 h-4 text-indigo-500" v-else-if="event.event === 'download'" />
                <Activity class="w-4 h-4 text-gray-400" v-else />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 capitalize">{{ event.event.replace('_', ' ') }}</p>
                <p class="text-xs text-gray-500 mt-0.5" v-if="event.userId">User: {{ event.userId.firstName }} {{ event.userId.lastName }}</p>
                <p class="text-[10px] text-gray-400 mt-1 uppercase">{{ new Date(event.createdAt).toLocaleString() }}</p>
              </div>
            </div>
            
            <div class="px-4 pt-4 pb-2 text-center">
              <NuxtLink to="/analytics" class="text-sm font-medium text-brand hover:underline">View all activity &rarr;</NuxtLink>
            </div>
          </div>
          <div v-else class="flex-1 flex flex-col items-center justify-center p-6 text-gray-400">
             <Activity class="w-8 h-8 mb-2 opacity-50" />
             <p class="text-sm">No recent activity</p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta, useHead } from '#imports';
import { onMounted, computed, ref } from 'vue';
import { useGetUserStats } from '@/composables/modules/users/useGetUserStats';
import { useAnalytics } from '@/composables/modules/analytics/useAnalytics';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';
import { 
  Users, CreditCard, Activity, DollarSign, TrendingUp, Calendar, Download, 
  BarChart3, MousePointer2, LogIn 
} from 'lucide-vue-next';

import { useBusinessContext } from '@/composables/core/useBusinessContext';

definePageMeta({ layout: 'default' });
useSeoMeta({ title: 'Dashboard Overview | Ecosystem' });
useHead({ title: 'Dashboard Overview | Ecosystem' });

import { useDateRange } from '@/composables/core/useDateRange';
import { watch } from 'vue';

const { businessInfo } = useBusinessContext();
const { loading: loadingUsers, stats: userStats, getUserStats } = useGetUserStats();
const { loading: loadingAnalytics, dashboardStats, recentActivity, fetchDashboardStats, fetchRecentActivity } = useAnalytics();
const { dateRange } = useDateRange();

const isCustomRange = computed(() => !!(dateRange.value.start && dateRange.value.end));

watch(dateRange, async () => {
  await fetchDashboardStats();
}, { deep: true });

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount / 100);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

onMounted(async () => {
  await Promise.all([
    getUserStats(),
    fetchDashboardStats(),
    fetchRecentActivity()
  ]);
});

// --- CHART DATA PREPARATION ---

const revenueChartData = computed(() => {
  const rawData = dashboardStats.value?.dailyRevenue || [];
  return {
    labels: rawData.map((d: any) => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Daily Revenue (₦)',
      data: rawData.map((d: any) => d.amount / 100),
      backgroundColor: businessInfo.value.chartColor,
      borderColor: businessInfo.value.chartBorder,
      borderWidth: 1,
      borderRadius: 4,
    }]
  };
});

const revenueChartOptions = {
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0,0,0,0.03)',
        drawBorder: false,
      },
      ticks: {
        callback: (value: number) => '₦' + (value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value)
      }
    },
    x: {
      grid: { display: false, drawBorder: false }
    }
  }
};

const trafficChartData = computed(() => {
  const rawData = dashboardStats.value?.dailyPageViews || [];
  return {
    labels: rawData.map((d: any) => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Page Views',
      data: rawData.map((d: any) => d.views),
      borderColor: businessInfo.value.chartBorder,
      backgroundColor: businessInfo.value.chartColor.replace('0.8', '0.1'),
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#fff',
      pointBorderColor: businessInfo.value.chartBorder,
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  };
});

const lineOptions = {
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.03)' } },
    x: { grid: { display: false } }
  }
};

const departmentChartData = computed(() => {
  const deptData = dashboardStats.value?.departmentEngagement || {};
  const labels = Object.keys(deptData).map(k => k.replace('_', ' '));
  const data = Object.values(deptData);
  
  if (!labels.length) {
    labels.push('No Data');
    data.push(1);
  }

  return {
    labels,
    datasets: [{
      data,
      backgroundColor: [
        businessInfo.value.chartBorder,
        '#14b8a6', // Teal
        '#f59e0b', // Amber
        '#ec4899', // Pink
        '#8b5cf6', // Purple
        '#e2e8f0', // Slate (fallback)
      ],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };
});

const doughnutOptions = {
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        font: { size: 11 }
      }
    }
  },
  cutout: '75%',
};

</script>
