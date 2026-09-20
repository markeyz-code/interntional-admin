import { ref } from 'vue';
import { usersApi } from '@/api_factory/modules/users';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useRevokeUser = () => {
  const { showToast } = useCustomToast();
  const loading = ref<string | null>(null);

  const revokeUser = async (id: string, callback?: () => void) => {
    loading.value = id;
    try {
      await usersApi.revokeUser(id);
      showToast({ title: 'Access Revoked', message: 'User access has been successfully revoked.', type: 'success' });
      if (callback) callback();
    } catch (error: any) {
      showToast({ title: 'Action Failed', message: error.response?.data?.message || 'Failed to revoke user access.', type: 'error' });
    } finally {
      loading.value = null;
    }
  };

  return { loading, revokeUser };
};
