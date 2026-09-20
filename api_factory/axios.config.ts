import axios from 'axios';

const getBaseUrl = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://api.interntional.medlabconvo.com/api/v1'
    : 'http://localhost:3001/api/v1';
};

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  timeout: 15000,
});

// Auth-protected endpoint – auto-injects Bearer token
export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  timeout: 15000,
});

// Lightweight in-memory cache for GET requests
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 60000; // 60 seconds

export const cachedGet = async (url: string, params?: any) => {
  const key = `${url}?${params ? new URLSearchParams(params).toString() : ''}`;
  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return { data: cached.data }; // Return cached response
  }
  const response = await GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params });
  cache.set(key, { data: response.data, expiry: Date.now() + CACHE_TTL });
  return response;
};

// Automatically clear cache on mutations
GATEWAY_ENDPOINT_WITH_AUTH.interceptors.request.use((config) => {
  if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
    cache.clear();
  }
  return config;
});

const getToken = () => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('admin_token');
};

GATEWAY_ENDPOINT_WITH_AUTH.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

GATEWAY_ENDPOINT_WITH_AUTH.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
