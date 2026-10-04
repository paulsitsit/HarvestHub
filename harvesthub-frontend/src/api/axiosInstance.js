import axios from 'axios';
import { API_URL } from '../utils/constants.js';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      'harvesthub_token'
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    console.log(
      'API REQUEST:',
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API ERROR:', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      response: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      const currentPath =
        window.location.pathname;

      localStorage.removeItem(
        'harvesthub_token'
      );

      localStorage.removeItem(
        'harvesthub_user'
      );

      const isAuthPage =
        currentPath === '/login' ||
        currentPath === '/register' ||
        currentPath === '/admin/login';

      if (!isAuthPage) {
        window.dispatchEvent(
          new CustomEvent(
            'harvesthub:unauthorized'
          )
        );
      }
    }

    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (
  error,
  fallback = 'Something went wrong'
) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.msg ||
    error?.message ||
    fallback
  );
};

export default axiosInstance;