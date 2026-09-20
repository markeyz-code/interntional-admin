import { ref } from 'vue';
import { usersApi } from '@/api_factory/modules/users';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useGetPendingUsers = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pendingUsers = ref<any[]>([]);

  const getPendingUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await usersApi.getPendingUsers();
      pendingUsers.value = data?.data || data || [];
      return pendingUsers.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load pending users.';
      showToast({ title: 'Error', message: error.value!, type: 'error' });
      return null;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, pendingUsers, getPendingUsers };
};
