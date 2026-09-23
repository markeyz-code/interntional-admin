import { ref, reactive, watch } from 'vue';
import { useRuntimeConfig } from '#app';
import { useCookie } from '#app';
import { debounce } from 'lodash-es';

export const useGetEnquiries = () => {
  const config = useRuntimeConfig();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const enquiries = ref<any[]>([]);
  const total = ref(0);
  const totalPages = ref(1);
  const token = useCookie('auth_token');

  const filters = reactive({
    page: 1,
    limit: 10,
    search: '',
    startDate: '',
    endDate: ''
  });

  const fetchEnquiries = async () => {
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

      const response = await fetch(`${config.public.apiBase}/enquiries?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch enquiries');
      }

      const data = await response.json();
      if (data.data) {
        enquiries.value = data.data;
        total.value = data.total;
        totalPages.value = data.totalPages;
      } else {
        enquiries.value = data;
        total.value = data.length;
        totalPages.value = 1;
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
    } finally {
      loading.value = false;
    }
  };

  const debouncedFetch = debounce(fetchEnquiries, 300);

  watch(() => ({ ...filters }), (newVal, oldVal) => {
    if (newVal.search !== oldVal.search || newVal.startDate !== oldVal.startDate || newVal.endDate !== oldVal.endDate) {
      filters.page = 1;
    }
    debouncedFetch();
  }, { deep: true });

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`${config.public.apiBase}/enquiries/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });

      if (response.ok) {
        const index = enquiries.value.findIndex(e => e._id === id);
        if (index !== -1) {
          enquiries.value[index].status = 'read';
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return {
    loading,
    error,
    enquiries,
    filters,
    total,
    totalPages,
    fetchEnquiries,
    markAsRead
  };
};
