import { ref } from 'vue';
import { useRuntimeConfig, useCookie } from '#app';
import { useBusinessContext } from '@/composables/core/useBusinessContext';

export const useDashboardStats = () => {
  const config = useRuntimeConfig();
  const token = useCookie('auth_token');
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
      const [usersRes, paymentsRes] = await Promise.all([
        fetch(`${config.public.apiBase}/users/stats?business=${activeBusiness.value}`, {
          headers: { 'Authorization': `Bearer ${token.value}` }
        }),
        fetch(`${config.public.apiBase}/payments/stats?business=${activeBusiness.value}`, {
          headers: { 'Authorization': `Bearer ${token.value}` }
        })
      ]);

      if (usersRes.ok) userStats.value = await usersRes.json();
      if (paymentsRes.ok) paymentStats.value = await paymentsRes.json();
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, userStats, paymentStats, fetchStats };
};
