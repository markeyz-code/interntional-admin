import { ref } from 'vue';
import { useRuntimeConfig } from '#app';
import { useCookie } from '#app';

export const useSubscriptions = () => {
  const config = useRuntimeConfig();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const subscriptions = ref<any[]>([]);
  const token = useCookie('auth_token');

  const fetchAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${config.public.apiBase}/subscriptions/all`, {
        headers: { 'Authorization': `Bearer ${token.value}` },
      });
      if (!response.ok) throw new Error('Failed to fetch subscriptions');
      subscriptions.value = await response.json();
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const createPlan = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${config.public.apiBase}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create plan');
      await fetchAll();
      return true;
    } catch (err: any) {
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updatePlan = async (id: string, data: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${config.public.apiBase}/subscriptions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update plan');
      await fetchAll();
      return true;
    } catch (err: any) {
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deletePlan = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${config.public.apiBase}/subscriptions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token.value}` },
      });
      if (!response.ok) throw new Error('Failed to delete plan');
      await fetchAll();
      return true;
    } catch (err: any) {
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, subscriptions, fetchAll, createPlan, updatePlan, deletePlan };
};
