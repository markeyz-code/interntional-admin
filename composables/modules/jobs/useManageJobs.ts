import { ref } from 'vue';
import { jobsApi } from '@/api_factory/modules/jobs';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useManageJobs = () => {
  const { showToast } = useCustomToast();
  
  const loading = ref(false);
  const deleting = ref<string | null>(null);
  const creating = ref(false);
  const jobs = ref<any[]>([]);

  const fetchJobs = async () => {
    loading.value = true;
    try {
      const { data } = await jobsApi.getJobs();
      jobs.value = data;
    } catch (err: any) {
      showToast({ title: 'Error', message: 'Failed to fetch jobs.', type: 'error' });
    } finally {
      loading.value = false;
    }
  };

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

  return { loading, creating, deleting, jobs, fetchJobs, createJob, deleteJob };
};
