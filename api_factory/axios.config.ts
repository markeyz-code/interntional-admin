import axios from 'axios';

const getBaseUrl = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://api.interntional.medlabconvo.com/api/v1'
    : 'http://localhost:4000/api/v1';
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

export const cachedGet = async (url: string, config?: any) => {
  // Extract and clean params to remove undefined values before stringifying
  let paramsStr = '';
  if (config?.params) {
    const cleanParams = Object.fromEntries(
      Object.entries(config.params).filter(([_, v]) => v != null)
    );
    paramsStr = new URLSearchParams(cleanParams as any).toString();
  }
  const key = `${url}?${paramsStr}`;
  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return { data: cached.data }; // Return cached response
  }
  const response = await GATEWAY_ENDPOINT_WITH_AUTH.get(url, config);
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

const getActiveBusiness = () => {
  if (typeof document === 'undefined') return 'internTional';
  const match = document.cookie.match(new RegExp('(^| )active_business=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return 'internTional';
};

GATEWAY_ENDPOINT_WITH_AUTH.interceptors.request.use(
  (config) => {
    const token = getToken();
    const business = getActiveBusiness();
    
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (config.headers) {
      config.headers['x-business'] = business;
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
