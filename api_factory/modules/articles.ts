import { GATEWAY_ENDPOINT_WITH_AUTH, cachedGet } from '../axios.config';

export const articlesApi = {
  getArticles: (params?: { status?: string, category?: string, search?: string }) => cachedGet('/articles', { params }),
  getArticle: (id: string) => cachedGet(`/articles/${id}`),
  createArticle: (data: any) => GATEWAY_ENDPOINT_WITH_AUTH.post('/articles', data),
  updateArticle: (id: string, data: any) => GATEWAY_ENDPOINT_WITH_AUTH.patch(`/articles/${id}`, data),
  deleteArticle: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.delete(`/articles/${id}`),
};
