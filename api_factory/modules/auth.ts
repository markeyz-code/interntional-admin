import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const authApi = {
  login(data: { email: string; password: string }) {
    return GATEWAY_ENDPOINT.post('/auth/login', data);
  },
  me() {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/auth/me');
  },
};
