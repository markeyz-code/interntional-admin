import { GATEWAY_ENDPOINT_WITH_AUTH, cachedGet } from '../axios.config';

export const jobsApi = {
  /** Get all jobs */
  getJobs() {
    return cachedGet('/jobs');
  },

  /** Create a job (Admin) */
  createJob(data: {
    title: string;
    company: string;
    location: string;
    description: string;
    link: string;
  }) {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/jobs', data);
  },

  /** Delete a job (Admin) */
  deleteJob(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/jobs/${id}`);
  },
};
