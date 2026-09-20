import { ref } from 'vue';
import { usersApi } from '@/api_factory/modules/users';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useGetActiveUsers = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false);
  const users = ref<any[]>([]);

  const fetchActiveUsers = async () => {
    loading.value = true;
    try {
      const { data } = await usersApi.getApprovedUsers();
      users.value = data;
    } catch (error: any) {
      showToast({ title: 'Error', message: 'Failed to fetch active users.', type: 'error' });
    } finally {
      loading.value = false;
    }
  };

  return { loading, users, fetchActiveUsers };
};
