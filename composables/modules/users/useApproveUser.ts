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
      if (data?.approvalEmailSent === false) {
        showToast({
          title: 'Approved — email not sent',
          message: 'The account was approved, but the approval email could not be delivered. Use “Resend Approval Email” on the user page.',
          type: 'error',
        });
      } else {
        showToast({ title: 'User Approved', message: 'Applicant approved. An approval email has been sent.', type: 'success' });
      }
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
      if (data?.rejectionEmailSent === false) {
        showToast({
          title: 'Rejected — email not sent',
          message: 'The application was rejected, but the notification email could not be delivered.',
          type: 'error',
        });
      } else {
        showToast({ title: 'Application Rejected', message: 'The user has been notified.', type: 'info' });
      }
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
