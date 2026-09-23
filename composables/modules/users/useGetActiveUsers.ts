import { ref, watch, reactive } from 'vue';
import { usersApi } from '@/api_factory/modules/users';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { debounce } from 'lodash-es';

export const useGetActiveUsers = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false);
  const users = ref<any[]>([]);
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

  const fetchActiveUsers = async () => {
    loading.value = true;
    try {
      const { data } = await usersApi.getApprovedUsers({
        page: filters.page,
        limit: filters.limit,
        search: filters.search || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        role: filters.role || undefined,
        status: filters.status || undefined
      });
      
      if (data.data) {
        // New paginated format
        users.value = data.data;
        total.value = data.total;
        totalPages.value = data.totalPages;
      } else {
        // Fallback for old format
        users.value = data;
        total.value = data.length;
        totalPages.value = 1;
      }
    } catch (error: any) {
      showToast({ title: 'Error', message: 'Failed to fetch active users.', type: 'error' });
    } finally {
      loading.value = false;
    }
  };

  const debouncedFetch = debounce(fetchActiveUsers, 300);

  watch(() => ({ ...filters }), (newVal, oldVal) => {
    // If search or dates change, reset to page 1
    if (newVal.search !== oldVal.search || newVal.startDate !== oldVal.startDate || newVal.endDate !== oldVal.endDate) {
      filters.page = 1;
    }
    debouncedFetch();
  }, { deep: true });

  return { loading, users, filters, total, totalPages, fetchActiveUsers };
};
