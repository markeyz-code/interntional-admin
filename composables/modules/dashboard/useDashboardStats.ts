import { ref } from 'vue';
import { useRuntimeConfig } from '#app';
import { useAuth } from '@/composables/core/useAuth';
import { useBusinessContext } from '@/composables/core/useBusinessContext';
import { useDateRange } from '@/composables/core/useDateRange';

export const useDashboardStats = () => {
  const config = useRuntimeConfig();
  const { getToken } = useAuth();
  const { activeBusiness } = useBusinessContext();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const userStats = ref({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0
  });

  const paymentStats = ref({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalPayments: 0,
    successfulPayments: 0,
    failedPayments: 0
  });

  const fetchStats = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { dateRange } = useDateRange();
      const start = dateRange.value.start ? new Date(dateRange.value.start).toISOString() : '';
      const end = dateRange.value.end ? new Date(dateRange.value.end).toISOString() : '';

      const [usersRes, paymentsRes] = await Promise.all([
        fetch(`${config.public.apiBase}/users/stats?business=${activeBusiness.value}&startDate=${start}&endDate=${end}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        }),
        fetch(`${config.public.apiBase}/payments/stats?business=${activeBusiness.value}&startDate=${start}&endDate=${end}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        })
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        userStats.value = {
          total: data.totalUsers || 0,
          active: data.approvedUsers || 0,
          pending: data.pendingUsers || 0,
          suspended: data.rejectedUsers || 0
        };
      }
      if (paymentsRes.ok) paymentStats.value = await paymentsRes.json();
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, userStats, paymentStats, fetchStats };
};
