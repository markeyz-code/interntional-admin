import { GATEWAY_ENDPOINT_WITH_AUTH, cachedGet } from '../axios.config';

export const formsApi = {
  getForms: () => cachedGet('/forms'),
  getForm: (id: string) => cachedGet(`/forms/${id}`),
  createForm: (data: any) => GATEWAY_ENDPOINT_WITH_AUTH.post('/forms', data),
  updateForm: (id: string, data: any) => GATEWAY_ENDPOINT_WITH_AUTH.patch(`/forms/${id}`, data),
  deleteForm: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.delete(`/forms/${id}`),
  getSubmissions: (formId: string) => cachedGet(`/forms/${formId}/submissions`),
  getSubmissionCounts: () => cachedGet('/forms/stats/submission-counts'),
  updateSubmission: (subId: string, data: any) => GATEWAY_ENDPOINT_WITH_AUTH.patch(`/forms/submissions/${subId}`, data),
  deleteSubmission: (subId: string) => GATEWAY_ENDPOINT_WITH_AUTH.delete(`/forms/submissions/${subId}`),
};
