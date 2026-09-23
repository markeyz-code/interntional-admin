import { ref } from 'vue';
import { useRuntimeConfig } from '#app';
import { useAuth } from '@/composables/core/useAuth';

export const useGetUserStats = () => {
  const config = useRuntimeConfig();
  const { getToken } = useAuth();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const stats = ref<any>(null);

  const getUserStats = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${config.public.apiBase}/users/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch user stats');
      stats.value = await response.json();
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    stats,
    getUserStats,
  };
};
