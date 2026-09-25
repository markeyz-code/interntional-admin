import { ref, reactive, watch } from 'vue';
import { useRuntimeConfig } from '#app';
import { useAuth } from '@/composables/core/useAuth';
import { debounce } from 'lodash-es';

export const useSubscriptions = () => {
  const config = useRuntimeConfig();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const subscriptions = ref<any[]>([]);
  const total = ref(0);
  const totalPages = ref(1);
  const { getToken } = useAuth();

  const filters = reactive({
    page: 1,
    limit: 10,
    search: '',
    startDate: '',
    endDate: ''
  });

  const fetchAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);

      const response = await fetch(`${config.public.apiBase}/subscriptions/all?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch subscriptions');
      const data = await response.json();
      if (data.data) {
        subscriptions.value = data.data;
        total.value = data.total;
        totalPages.value = data.totalPages;
      } else {
        subscriptions.value = data;
        total.value = data.length;
        totalPages.value = 1;
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const debouncedFetch = debounce(fetchAll, 300);

  watch(() => ({ ...filters }), (newVal, oldVal) => {
    if (newVal.search !== oldVal.search || newVal.startDate !== oldVal.startDate || newVal.endDate !== oldVal.endDate) {
      filters.page = 1;
    }
    debouncedFetch();
  }, { deep: true });

  const createPlan = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${config.public.apiBase}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
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
          'Authorization': `Bearer ${getToken()}`,
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
        headers: { 'Authorization': `Bearer ${getToken()}` },
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

  return { 
    loading, 
    error, 
    subscriptions, 
    filters,
    total,
    totalPages,
    fetchAll, 
    createPlan, 
    updatePlan, 
    deletePlan 
  };
};
