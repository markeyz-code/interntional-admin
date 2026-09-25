import { GATEWAY_ENDPOINT_WITH_AUTH, cachedGet } from '../axios.config';

export const universeApi = {
  // Universities
  getUniversities: () => cachedGet('/universe/universities'),
  createUniversity: (data: any) => GATEWAY_ENDPOINT_WITH_AUTH.post('/universe/universities', data),
  updateUniversity: (id: string, data: any) => GATEWAY_ENDPOINT_WITH_AUTH.patch(`/universe/universities/${id}`, data),
  deleteUniversity: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.delete(`/universe/universities/${id}`),

  // Programmes
  getProgrammes: () => cachedGet('/universe/programmes'),
  createProgramme: (data: any) => GATEWAY_ENDPOINT_WITH_AUTH.post('/universe/programmes', data),
  updateProgramme: (id: string, data: any) => GATEWAY_ENDPOINT_WITH_AUTH.patch(`/universe/programmes/${id}`, data),
  deleteProgramme: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.delete(`/universe/programmes/${id}`),

  // Students
  getStudents: () => cachedGet('/universe/students'),
  createStudent: (data: any) => GATEWAY_ENDPOINT_WITH_AUTH.post('/universe/students', data),
  updateStudent: (id: string, data: any) => GATEWAY_ENDPOINT_WITH_AUTH.patch(`/universe/students/${id}`, data),
  deleteStudent: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.delete(`/universe/students/${id}`),
};
