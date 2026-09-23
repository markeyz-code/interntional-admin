import { ref, reactive, watch } from 'vue';
import { jobsApi } from '@/api_factory/modules/jobs';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { debounce } from 'lodash-es';

export const useManageJobs = () => {
  const { showToast } = useCustomToast();
  
  const loading = ref(false);
  const deleting = ref<string | null>(null);
  const creating = ref(false);
  const jobs = ref<any[]>([]);
  const total = ref(0);
  const totalPages = ref(1);

  const filters = reactive({
    page: 1,
    limit: 10,
    search: '',
    startDate: '',
    endDate: ''
  });

  const fetchJobs = async () => {
    loading.value = true;
    try {
      const { data } = await jobsApi.getJobs({
        page: filters.page,
        limit: filters.limit,
        search: filters.search || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      });
      if (data.data) {
        jobs.value = data.data;
        total.value = data.total;
        totalPages.value = data.totalPages;
      } else {
        jobs.value = data;
        total.value = data.length;
        totalPages.value = 1;
      }
    } catch (err: any) {
      showToast({ title: 'Error', message: 'Failed to fetch jobs.', type: 'error' });
    } finally {
      loading.value = false;
    }
  };

  const debouncedFetch = debounce(fetchJobs, 300);

  watch(() => ({ ...filters }), (newVal, oldVal) => {
    if (newVal.search !== oldVal.search || newVal.startDate !== oldVal.startDate || newVal.endDate !== oldVal.endDate) {
      filters.page = 1;
    }
    debouncedFetch();
  }, { deep: true });

  const createJob = async (payload: {
    title: string;
    company: string;
    location: string;
    description: string;
    link: string;
  }) => {
    creating.value = true;
    try {
      await jobsApi.createJob(payload);
      showToast({ title: 'Success', message: 'Job posted successfully.', type: 'success' });
      await fetchJobs();
      return true;
    } catch (err: any) {
      showToast({ title: 'Failed', message: err.message || 'Failed to post job.', type: 'error' });
      return false;
    } finally {
      creating.value = false;
    }
  };

  const deleteJob = async (id: string) => {
    deleting.value = id;
    try {
      await jobsApi.deleteJob(id);
      jobs.value = jobs.value.filter(j => j._id !== id);
      showToast({ title: 'Deleted', message: 'Job posting removed.', type: 'success' });
      return true;
    } catch (err: any) {
      showToast({ title: 'Error', message: 'Failed to delete job.', type: 'error' });
      return false;
    } finally {
      deleting.value = null;
    }
  };

  return { 
    loading, 
    creating, 
    deleting, 
    jobs, 
    filters,
    total,
    totalPages,
    fetchJobs, 
    createJob, 
    deleteJob 
  };
};
