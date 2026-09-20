import { GATEWAY_ENDPOINT_WITH_AUTH, cachedGet } from '../axios.config';

export const vaultApi = {
  /** Get all resources */
  getResources(params?: { category?: string; search?: string }) {
    return cachedGet('/resources', params);
  },

  /** Create a new resource (after file uploaded to Cloudinary) */
  createResource(data: {
    title: string;
    description?: string;
    category: string;
    type: string;
    fileUrl: string;
  }) {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/resources', data);
  },

  /** Delete a resource */
  deleteResource(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/resources/${id}`);
  },
};
