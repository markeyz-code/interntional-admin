import { ref, reactive, watch } from 'vue';
import { usersApi } from '@/api_factory/modules/users';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { debounce } from 'lodash-es';

export const useGetPendingUsers = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pendingUsers = ref<any[]>([]);
  const total = ref(0);
  const totalPages = ref(1);

  const filters = reactive({
    page: 1,
    limit: 10,
    search: '',
    startDate: '',
    endDate: '',
    role: '',
    status: ''
  });

  const getPendingUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await usersApi.getPendingUsers({
        page: filters.page,
        limit: filters.limit,
        search: filters.search || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        role: filters.role || undefined
      });
      
      if (data.data) {
        pendingUsers.value = data.data;
        total.value = data.total;
        totalPages.value = data.totalPages;
      } else {
        pendingUsers.value = data;
        total.value = data.length;
        totalPages.value = 1;
      }
      return pendingUsers.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load pending users.';
      showToast({ title: 'Error', message: error.value!, type: 'error' });
      return null;
    } finally {
      loading.value = false;
    }
  };

  const debouncedFetch = debounce(getPendingUsers, 300);

  watch(() => ({ ...filters }), (newVal, oldVal) => {
    if (newVal.search !== oldVal.search || newVal.startDate !== oldVal.startDate || newVal.endDate !== oldVal.endDate) {
      filters.page = 1;
    }
    debouncedFetch();
  }, { deep: true });

  return { loading, error, pendingUsers, filters, total, totalPages, getPendingUsers };
};
