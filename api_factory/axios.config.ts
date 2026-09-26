import axios, { type AxiosResponse } from "axios";
import { useCustomToast } from '@/composables/core/useCustomToast'

const getBaseUrl = () => {
  return import.meta.env.VITE_BASE_URL as string;
};

const getToken = () => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('admin_token');
};

const logOut = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/login';
  }
};

const getActiveBusiness = () => {
  if (typeof document === 'undefined') return 'internTional';
  const match = document.cookie.match(new RegExp('(^| )active_business=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return 'internTional';
};

const $GATEWAY_ENDPOINT_WITHOUT_VERSION = getBaseUrl() as string;
const $GATEWAY_ENDPOINT = getBaseUrl() as string;
const $GATEWAY_ENDPOINT_V2 = getBaseUrl() + "/v2";
const $IMAGE_UPLOAD_ENDPOINT = getBaseUrl(); 

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

export const GATEWAY_ENDPOINT_V2 = axios.create({
  baseURL: $GATEWAY_ENDPOINT_V2
});

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const GATEWAY_ENDPOINT_WITHOUT_VERSION = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});
export const GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});
export const IMAGE_UPLOAD_ENDPOINT = axios.create({
  baseURL: $IMAGE_UPLOAD_ENDPOINT,
});
export interface CustomAxiosResponse extends AxiosResponse {
  value?: any;
  type?: string;
}

const instanceArray = [
  GATEWAY_ENDPOINT,
  GATEWAY_ENDPOINT_V2,
  GATEWAY_ENDPOINT_WITH_AUTH,
  GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA,
  GATEWAY_ENDPOINT_WITHOUT_VERSION,
  GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH,
];

instanceArray.forEach((instance) => {
  instance.interceptors.request.use((config: any) => {
    const token = getToken();
    const business = getActiveBusiness();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.headers) {
      config.headers['x-business'] = business;
    }
    
    return config;
  });

  instance.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      return response;
    },
    (err: any) => {
      const { showToast } = useCustomToast();
      if (typeof err.response === "undefined") {
        showToast({
          title: "Error",
          message: "kindly check your network connection",
          toastType: "error",
          duration: 3000
        });
        return Promise.reject({
          type: "ERROR",
          ...err,
        });
      }
      if (err.response.status === 401) {
        console.log(err.response.data?.error)
        logOut();
        showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
        return Promise.reject({
          type: "ERROR",
          ...err.response,
        });
      } else if (statusCodeStartsWith(err.response.status, 4)) {
        if (err.response.data?.message || err.response.data?.error) {
          showToast({
            title: "Error",
            message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
            toastType: "error",
            duration: 3000
          });
        }
        return Promise.reject({
          type: "ERROR",
          ...err.response,
        });
      } else if (err.response.status === 500) {
        showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
        return Promise.reject({
          type: "ERROR",
          ...err.response,
        });
      } else if (err.response.status === 409) {
        showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
        return Promise.reject({
          type: "ERROR",
          ...err.response,
        });
      }
      return Promise.reject(err);
    }
  );
});

const statusCodeStartsWith = (
  statusCode: number,
  startNumber: number
): boolean => {
  const statusCodeString = statusCode.toString();
  const startNumberString = startNumber.toString();

  return statusCodeString.startsWith(startNumberString);
};

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
