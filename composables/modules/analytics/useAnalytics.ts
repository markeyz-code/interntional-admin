import { ref } from 'vue';
import { useRuntimeConfig } from '#app';
import { useAuth } from '@/composables/core/useAuth';

export const useAnalytics = () => {
  const config = useRuntimeConfig();
  const { getToken } = useAuth();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const dashboardStats = ref<any>(null);
  const recentActivity = ref<any[]>([]);
  const departmentEngagement = ref<any[]>([]);

  const fetchDashboardStats = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${config.public.apiBase}/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      dashboardStats.value = await response.json();
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch(`${config.public.apiBase}/analytics/activity`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch activity');
      recentActivity.value = await response.json();
    } catch (err: any) {
      error.value = err.message;
    }
  };

  const fetchDepartmentEngagement = async () => {
    try {
      const response = await fetch(`${config.public.apiBase}/analytics/departments`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch department engagement');
      departmentEngagement.value = await response.json();
    } catch (err: any) {
      error.value = err.message;
    }
  };

  const trackEvent = async (event: string, page?: string, metadata?: any) => {
    try {
      await fetch(`${config.public.apiBase}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, page, metadata }),
      });
    } catch {
      // Silent fail for tracking
    }
  };

  return {
    loading,
    error,
    dashboardStats,
    recentActivity,
    departmentEngagement,
    fetchDashboardStats,
    fetchRecentActivity,
    fetchDepartmentEngagement,
    trackEvent,
  };
};
