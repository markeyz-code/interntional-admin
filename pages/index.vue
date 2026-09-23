<template>
  <div class="space-y-8 pb-10">
    <!-- Header Area -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight mb-1">Dashboard Overview</h1>
        <p class="text-gray-500 font-medium">Welcome back! Here's what's happening today.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
          <Calendar class="w-4 h-4 text-brand" />
          <span class="text-sm font-bold text-gray-700">Last 30 Days</span>
        </div>
        <button @click="fetchStats" class="p-2.5 bg-brand text-white rounded-lg hover:bg-[#1f4e70] shadow-sm transition-all" :class="{'opacity-50 cursor-not-allowed': loading}">
          <RefreshCw class="w-4 h-4" :class="{'animate-spin': loading}" />
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <UsersIcon class="w-16 h-16 text-blue-500" />
        </div>
        <p class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Users</p>
        <h3 class="text-4xl font-black text-gray-900">{{ userStats.total.toLocaleString() }}</h3>
        <div class="mt-4 flex items-center gap-2 text-sm">
          <span class="px-2 py-1 bg-green-100 text-green-700 rounded-md font-bold flex items-center gap-1">
            <TrendingUp class="w-3 h-3" /> +12%
          </span>
          <span class="text-gray-400 font-medium">vs last month</span>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <DollarSign class="w-16 h-16 text-emerald-500" />
        </div>
        <p class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Revenue</p>
        <h3 class="text-4xl font-black text-gray-900">₦{{ (paymentStats.totalRevenue / 100).toLocaleString() }}</h3>
        <div class="mt-4 flex items-center gap-2 text-sm">
          <span class="px-2 py-1 bg-green-100 text-green-700 rounded-md font-bold flex items-center gap-1">
            <TrendingUp class="w-3 h-3" /> +8.4%
          </span>
          <span class="text-gray-400 font-medium">vs last month</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <CreditCard class="w-16 h-16 text-brand" />
        </div>
        <p class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Monthly Revenue</p>
        <h3 class="text-4xl font-black text-gray-900">₦{{ (paymentStats.monthlyRevenue / 100).toLocaleString() }}</h3>
        <div class="mt-4 flex items-center gap-2 text-sm">
          <span class="px-2 py-1 bg-brand/10 text-brand rounded-md font-bold flex items-center gap-1">
            Active
          </span>
          <span class="text-gray-400 font-medium">current period</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <UserPlus class="w-16 h-16 text-orange-500" />
        </div>
        <p class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Pending Approvals</p>
        <h3 class="text-4xl font-black text-gray-900">{{ userStats.pending.toLocaleString() }}</h3>
        <div class="mt-4 flex items-center gap-2 text-sm">
          <NuxtLink to="/users" class="text-brand hover:text-blue-800 font-bold hover:underline transition-all">
            Review applications &rarr;
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Charts Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] lg:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-gray-900">Revenue Over Time</h2>
          <select class="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-brand/20 font-medium text-gray-700">
            <option>This Year</option>
            <option>Last Year</option>
          </select>
        </div>
        <div class="h-72 w-full">
          <Line v-if="chartDataReady" :data="revenueChartData" :options="chartOptions" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <h2 class="text-lg font-bold text-gray-900 mb-6">User Distribution</h2>
        <div class="h-64 w-full flex items-center justify-center relative">
          <Doughnut v-if="chartDataReady" :data="userChartData" :options="doughnutOptions" />
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span class="text-3xl font-black text-gray-900">{{ userStats.total }}</span>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Users</span>
          </div>
        </div>
        <div class="mt-6 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-brand"></span>
              <span class="text-sm font-medium text-gray-600">Active</span>
            </div>
            <span class="text-sm font-bold text-gray-900">{{ userStats.active }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-orange-400"></span>
              <span class="text-sm font-medium text-gray-600">Pending</span>
            </div>
            <span class="text-sm font-bold text-gray-900">{{ userStats.pending }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-red-500"></span>
              <span class="text-sm font-medium text-gray-600">Suspended</span>
            </div>
            <span class="text-sm font-bold text-gray-900">{{ userStats.suspended }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Approvals Widget -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div>
          <h2 class="text-lg font-bold text-gray-900">Recent Applications</h2>
          <p class="text-sm text-gray-500 mt-1">Users waiting for approval.</p>
        </div>
        <NuxtLink to="/users" class="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm">
          View All
        </NuxtLink>
      </div>

      <div class="p-0">
        <!-- Loading state for users -->
        <div v-if="pendingUsersLoading && pendingUsers.length === 0" class="py-12 flex justify-center">
          <UiTableSpinner />
        </div>
        
        <table v-else-if="pendingUsers.length > 0" class="min-w-full divide-y divide-gray-100 text-sm text-left">
          <thead class="bg-white">
            <tr>
              <th scope="col" class="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[11px]">User</th>
              <th scope="col" class="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[11px]">Email</th>
              <th scope="col" class="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[11px]">Document</th>
              <th scope="col" class="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[11px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 bg-white">
            <tr v-for="user in pendingUsers.slice(0, 5)" :key="user._id" class="hover:bg-gray-50/80 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold border border-brand/20">
                    {{ user.firstName?.[0] }}{{ user.lastName?.[0] }}
                  </div>
                  <div class="font-bold text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <a :href="user.verificationFileUrl" target="_blank" class="px-3 py-1.5 bg-blue-50 text-brand rounded-md hover:bg-blue-100 text-xs font-bold transition-all inline-flex items-center gap-1.5">
                  <UserCheck class="w-3.5 h-3.5" /> View
                </a>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="confirmReject(user._id)" 
                    :disabled="approveLoading === user._id"
                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                    title="Reject"
                  >
                    <X class="w-4 h-4" />
                  </button>
                  <button 
                    @click="handleApprove(user._id)" 
                    :disabled="approveLoading === user._id"
                    class="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg disabled:opacity-50 transition-colors"
                    title="Approve"
                  >
                    <span v-if="approveLoading === user._id" class="flex"><RefreshCw class="w-4 h-4 animate-spin" /></span>
                    <span v-else class="flex"><Check class="w-4 h-4" /></span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty state for pending users -->
        <div v-else class="py-12">
          <UiEmptyState 
            title="All caught up!" 
            description="No pending applications waiting for review." 
            :icon="UsersIcon" 
          />
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <UiConfirmationModal
      :isOpen="isRejectModalOpen"
      title="Reject Applicant"
      message="Are you sure you want to reject this applicant?"
      confirmText="Reject"
      @confirm="handleReject"
      @cancel="closeRejectModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useSeoMeta } from '#imports';
import { Users as UsersIcon, UserCheck, RefreshCw, Calendar, TrendingUp, DollarSign, CreditCard, UserPlus, X, Check } from 'lucide-vue-next';
import { Line, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';

import { useDashboardStats } from '@/composables/modules/dashboard/useDashboardStats';
import { useGetPendingUsers } from '@/composables/modules/users/useGetPendingUsers';
import { useApproveUser } from '@/composables/modules/users/useApproveUser';
import { useBusinessContext } from '@/composables/core/useBusinessContext';
import UiEmptyState from '@/components/ui/EmptyState.vue';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';
import UiConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import { watch } from 'vue';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

useSeoMeta({ title: 'Dashboard | Admin' });

const { activeBusiness } = useBusinessContext();
const { loading, userStats, paymentStats, fetchStats } = useDashboardStats();
const { loading: pendingUsersLoading, pendingUsers, getPendingUsers } = useGetPendingUsers();
const { loading: approveLoading, approveUser, rejectUser } = useApproveUser();

const isRejectModalOpen = ref(false);
const selectedUserId = ref<string | null>(null);

const confirmReject = (id: string) => {
  selectedUserId.value = id;
  isRejectModalOpen.value = true;
};

const closeRejectModal = () => {
  isRejectModalOpen.value = false;
  selectedUserId.value = null;
};

const handleApprove = async (id: string) => {
  const result = await approveUser(id);
  if (result) {
    getPendingUsers();
    fetchStats();
  }
};

const handleReject = async () => {
  if (selectedUserId.value) {
    const result = await rejectUser(selectedUserId.value);
    if (result) {
      getPendingUsers();
      fetchStats();
    }
    closeRejectModal();
  }
};

onMounted(() => {
  fetchStats();
  getPendingUsers();
});

watch(activeBusiness, () => {
  fetchStats();
  getPendingUsers();
});

// Chart configurations
const chartDataReady = computed(() => !loading.value);

const revenueChartData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue (₦)',
      data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, paymentStats.value.monthlyRevenue / 100, 0, 0],
      borderColor: '#11293B',
      backgroundColor: 'rgba(17, 41, 59, 0.1)',
      borderWidth: 3,
      pointBackgroundColor: '#11293B',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#11293B',
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.4
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(17, 41, 59, 0.9)',
      padding: 12,
      titleFont: { size: 13, family: 'Inter' },
      bodyFont: { size: 14, family: 'Inter', weight: 'bold' },
      displayColors: false,
      callbacks: {
        label: function(context: any) {
          return '₦' + context.parsed.y.toLocaleString();
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.04)',
        drawBorder: false
      },
      ticks: {
        font: { family: 'Inter', size: 11 },
        color: '#9CA3AF',
        callback: function(value: any) {
          return '₦' + (value / 1000) + 'k';
        }
      }
    },
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        font: { family: 'Inter', size: 11 },
        color: '#9CA3AF'
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
};

const userChartData = computed(() => ({
  labels: ['Active', 'Pending', 'Suspended'],
  datasets: [
    {
      data: [
        userStats.value.active || 1, 
        userStats.value.pending || 0, 
        userStats.value.suspended || 0
      ],
      backgroundColor: ['#11293B', '#FB923C', '#EF4444'],
      hoverBackgroundColor: ['#1f4e70', '#fdba74', '#f87171'],
      borderWidth: 0,
      cutout: '75%',
    }
  ]
}));

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(17, 41, 59, 0.9)',
      padding: 12,
      bodyFont: { size: 14, family: 'Inter', weight: 'bold' },
      callbacks: {
        label: function(context: any) {
          const label = context.label || '';
          const value = context.parsed || 0;
          return `${label}: ${value}`;
        }
      }
    }
  },
  animation: {
    animateScale: true,
    animateRotate: true
  }
};
</script>

<style scoped>
/* Optional: Add custom animations or overrides */
</style>
