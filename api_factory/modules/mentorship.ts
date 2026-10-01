import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const mentorshipApi = {
  getMentorships(application?: string, page = 1, limit = 10) {
    const params: any = { page, limit };
    if (application) params.application = application;
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/mentorship', { params });
  },
  updateMentorshipStatus(id: string, payload: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/mentorship/${id}/status`, payload);
  },
  deleteMentorship(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/mentorship/${id}`);
  },
  getMentors() {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/mentorship/mentors/all');
  },
  createMentor(payload: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/mentorship/mentors', payload);
  },
  deleteMentor(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/mentorship/mentors/${id}`);
  },
  updateMentor(id: string, payload: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/mentorship/mentors/${id}`, payload);
  },
  getCategories() {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/mentorship/categories/all');
  },
  createCategory(payload: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/mentorship/categories', payload);
  },
  deleteCategory(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/mentorship/categories/${id}`);
  }
};
