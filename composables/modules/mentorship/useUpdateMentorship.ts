import { ref } from 'vue';
import { mentorshipApi } from '@/api_factory/modules/mentorship';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useUpdateMentorship = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false);

  const updateStatus = async (id: string, payload: any) => {
    loading.value = true;
    try {
      await mentorshipApi.updateMentorshipStatus(id, payload);
      showToast({ title: 'Success', message: 'Mentorship request updated successfully', type: 'success' });
      return true;
    } catch (error: any) {
      showToast({ title: 'Error', message: 'Failed to update mentorship request', type: 'error' });
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteRequest = async (id: string) => {
    loading.value = true;
    try {
      await mentorshipApi.deleteMentorship(id);
      showToast({ title: 'Success', message: 'Mentorship request deleted successfully', type: 'success' });
      return true;
    } catch (error: any) {
      showToast({ title: 'Error', message: 'Failed to delete mentorship request', type: 'error' });
      return false;
    } finally {
      loading.value = false;
    }
  };

  return { loading, updateStatus, deleteRequest };
};
