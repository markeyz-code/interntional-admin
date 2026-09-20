<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Analytics</h1>
        <p class="text-sm text-gray-500 mt-1">Track visits, interactions, engagement, and platform performance.</p>
      </div>
      <button @click="refreshAll" class="px-4 py-2 text-sm font-medium bg-brand text-white rounded hover:bg-[#1f4e70] transition-colors">
        Refresh Data
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <UiTableSpinner />
      <p class="text-gray-500 mt-4">Loading analytics...</p>
    </div>

    <template v-else-if="dashboardStats">
      <!-- Top KPIs -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <div class="flex items-center gap-3 mb-2">
            <Eye class="w-5 h-5 text-brand" />
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today's Page Views</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ dashboardStats.todayPageViews.toLocaleString() }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <div class="flex items-center gap-3 mb-2">
            <LogIn class="w-5 h-5 text-green-600" />
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today's Logins</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ dashboardStats.todayLogins.toLocaleString() }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <div class="flex items-center gap-3 mb-2">
            <Download class="w-5 h-5 text-purple-600" />
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Weekly Downloads</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ dashboardStats.weeklyDownloads.toLocaleString() }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <div class="flex items-center gap-3 mb-2">
            <Briefcase class="w-5 h-5 text-orange-600" />
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Weekly Job Clicks</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ dashboardStats.weeklyJobClicks.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Secondary KPIs -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <div class="flex items-center gap-3 mb-2">
            <UserPlus class="w-5 h-5 text-blue-600" />
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly Signups</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ dashboardStats.monthlySignups.toLocaleString() }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <div class="flex items-center gap-3 mb-2">
            <CreditCard class="w-5 h-5 text-green-600" />
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly Payments</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ dashboardStats.monthlyPayments.toLocaleString() }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <div class="flex items-center gap-3 mb-2">
            <Activity class="w-5 h-5 text-red-600" />
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Events</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ dashboardStats.totalEvents.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Page Views Chart (CSS bars) -->
      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Page Views — Last 14 Days</h2>
        <div class="flex items-end gap-2 h-48" v-if="dashboardStats.dailyPageViews && dashboardStats.dailyPageViews.length">
          <div
            v-for="day in dashboardStats.dailyPageViews"
            :key="day.date"
            class="flex-1 flex flex-col items-center justify-end gap-1"
          >
            <span class="text-xs font-bold text-gray-900">{{ day.views }}</span>
            <div
              class="w-full bg-brand rounded-t"
              :style="{ height: getBarHeight(day.views) + 'px', minHeight: '4px' }"
            ></div>
            <span class="text-[10px] text-gray-400 mt-1">{{ formatDate(day.date) }}</span>
          </div>
        </div>
        <div v-else class="text-center text-gray-400 py-12">
          <BarChart3 class="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No page view data yet. Events will appear as users interact with the platform.</p>
        </div>
      </div>

      <!-- Event Breakdown + Department Engagement -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Event Breakdown -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Event Breakdown (30 days)</h2>
          <div class="space-y-3" v-if="Object.keys(dashboardStats.eventBreakdown || {}).length">
            <div v-for="(count, event) in dashboardStats.eventBreakdown" :key="event" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" :class="getEventColor(event as string)"></div>
                <span class="text-sm text-gray-700 font-medium capitalize">{{ (event as string).replace(/_/g, ' ') }}</span>
              </div>
              <span class="text-sm font-bold text-gray-900">{{ count }}</span>
            </div>
          </div>
          <p v-else class="text-center text-gray-400 py-6">No events recorded yet</p>
        </div>

        <!-- Department Engagement -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Department Engagement (30 days)</h2>
          <div class="space-y-3" v-if="Object.keys(dashboardStats.departmentEngagement || {}).length">
            <div v-for="(count, dept) in dashboardStats.departmentEngagement" :key="dept">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-gray-700 font-medium capitalize">{{ (dept as string).replace(/_/g, ' ') }}</span>
                <span class="text-sm font-bold text-gray-900">{{ count }}</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-brand rounded-full transition-all" :style="{ width: getDeptBarWidth(count as number) + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-center text-gray-400 py-6">No department data yet</p>
        </div>
      </div>

      <!-- Recent Activity Feed -->
      <div class="bg-white border border-gray-200 rounded-xl">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">Recent Activity</h2>
          <p class="text-sm text-gray-500 mt-1">Last 50 events across the platform</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left" v-if="recentActivity.length">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Time</th>
                <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Event</th>
                <th class="p-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Page</th>
                <th class="p-4 text-xs font-semibold text-gray-500 uppercase">Department</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in recentActivity" :key="item._id" class="hover:bg-gray-50">
                <td class="p-4 text-xs text-gray-500 whitespace-nowrap">{{ formatTime(item.createdAt) }}</td>
                <td class="p-4">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="getEventBadgeClass(item.event)">
                    {{ item.event?.replace(/_/g, ' ') }}
                  </span>
                </td>
                <td class="p-4 text-sm text-gray-700">
                  {{ item.userId?.firstName || 'Anonymous' }} {{ item.userId?.lastName || '' }}
                </td>
                <td class="p-4 text-sm text-gray-500 font-mono text-xs">{{ item.page || '—' }}</td>
                <td class="p-4 text-sm text-gray-500 capitalize">{{ item.department?.replace(/_/g, ' ') || '—' }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else class="p-12 text-center text-gray-400">
            <Activity class="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No activity recorded yet</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useSeoMeta } from '#imports';
import { Eye, LogIn, Download, Briefcase, UserPlus, CreditCard, Activity, BarChart3 } from 'lucide-vue-next';
import { useAnalytics } from '@/composables/modules/analytics/useAnalytics';
import UiTableSpinner from '@/components/ui/TableSpinner.vue';

useSeoMeta({ title: 'Analytics | Admin Dashboard' });

const { loading, dashboardStats, recentActivity, fetchDashboardStats, fetchRecentActivity } = useAnalytics();

const refreshAll = async () => {
  await Promise.all([fetchDashboardStats(), fetchRecentActivity()]);
};

const maxPageViews = computed(() => {
  if (!dashboardStats.value?.dailyPageViews) return 1;
  return Math.max(...dashboardStats.value.dailyPageViews.map((d: any) => d.views), 1);
});

const maxDeptCount = computed(() => {
  if (!dashboardStats.value?.departmentEngagement) return 1;
  return Math.max(...Object.values(dashboardStats.value.departmentEngagement as Record<string, number>), 1);
});

const getBarHeight = (views: number) => {
  return Math.round((views / maxPageViews.value) * 160);
};

const getDeptBarWidth = (count: number) => {
  return Math.round((count / maxDeptCount.value) * 100);
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString();
};

const getEventColor = (event: string) => {
  const colors: Record<string, string> = {
    page_view: 'bg-blue-500',
    login: 'bg-green-500',
    download: 'bg-purple-500',
    job_click: 'bg-orange-500',
    enquiry_submit: 'bg-yellow-500',
    signup: 'bg-cyan-500',
    payment_init: 'bg-pink-500',
    payment_success: 'bg-emerald-500',
    document_upload: 'bg-indigo-500',
    vault_access: 'bg-red-500',
    mentor_connect: 'bg-teal-500',
  };
  return colors[event] || 'bg-gray-400';
};

const getEventBadgeClass = (event: string) => {
  const classes: Record<string, string> = {
    page_view: 'bg-blue-100 text-blue-700',
    login: 'bg-green-100 text-green-700',
    download: 'bg-purple-100 text-purple-700',
    job_click: 'bg-orange-100 text-orange-700',
    enquiry_submit: 'bg-yellow-100 text-yellow-700',
    signup: 'bg-cyan-100 text-cyan-700',
    payment_init: 'bg-pink-100 text-pink-700',
    payment_success: 'bg-emerald-100 text-emerald-700',
    document_upload: 'bg-indigo-100 text-indigo-700',
    vault_access: 'bg-red-100 text-red-700',
    mentor_connect: 'bg-teal-100 text-teal-700',
  };
  return classes[event] || 'bg-gray-100 text-gray-700';
};

onMounted(() => { refreshAll(); });
</script>
