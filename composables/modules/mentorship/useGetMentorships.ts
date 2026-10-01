import { ref } from 'vue';
import { mentorshipApi } from '@/api_factory/modules/mentorship';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useBusinessContext } from '@/composables/core/useBusinessContext';

export const useGetMentorships = () => {
  const { activeBusiness } = useBusinessContext();
  const loading = ref(false);
  const requests = ref([]);
  const metadata = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const { showToast } = useCustomToast();

  const fetchRequests = async (page = 1) => {
    loading.value = true;
    try {
      const application = activeBusiness.value === 'uniVerse' ? 'universe' : 'interntional';
      const { data } = await mentorshipApi.getMentorships(application, page, metadata.value.limit);
      requests.value = data.data || [];
      metadata.value.page = data.page;
      metadata.value.total = data.total;
      metadata.value.totalPages = data.totalPages;
    } catch (error: any) {
      showToast({ title: 'Error', message: 'Failed to fetch mentorship requests', type: 'error' });
    } finally {
      loading.value = false;
    }
  };

  return { loading, requests, metadata, fetchRequests };
};
