import { ref } from 'vue';
import { usersApi } from '@/api_factory/modules/users';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useApproveUser = () => {
  const { showToast } = useCustomToast();
  const loading = ref<string | null>(null);

  const approveUser = async (id: string) => {
    loading.value = id;
    try {
      const { data } = await usersApi.approveUser(id);
      showToast({ title: 'User Approved', message: 'The 24-month intern subscription timer has started.', type: 'success' });
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to approve user.';
      showToast({ title: 'Error', message, type: 'error' });
      return null;
    } finally {
      loading.value = null;
    }
  };

  const rejectUser = async (id: string) => {
    loading.value = id;
    try {
      const { data } = await usersApi.rejectUser(id);
      showToast({ title: 'Application Rejected', message: 'The user has been notified.', type: 'info' });
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to reject user.';
      showToast({ title: 'Error', message, type: 'error' });
      return null;
    } finally {
      loading.value = null;
    }
  };

  return { loading, approveUser, rejectUser };
};
