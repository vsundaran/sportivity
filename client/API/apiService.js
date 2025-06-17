import axios from "axios";
import { Platform } from "react-native";
// import { getUniqueId } from 'react-native-device-info';
import { getToken } from "@/utils/token";

// Base URL configuration
const BASE_URL = Platform.select({
  ios: "https://sportivity-bhzk.onrender.com/api",
  android: "https://sportivity-bhzk.onrender.com/api",
  default: "https://sportivity-bhzk.onrender.com/api",
});

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Intercept and add token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["x-auth-token"] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
    }
  }
);

// API methods
const apiService = {
  get: (url, params = {}, config = {}) => {
    return apiClient.get(url, { ...config, params });
  },

  post: (url, data, config = {}) => {
    return apiClient.post(url, data, config);
  },

  put: (url, data, config = {}) => {
    return apiClient.put(url, data, config);
  },

  patch: (url, data, config = {}) => {
    return apiClient.patch(url, data, config);
  },

  delete: (url, config = {}) => {
    return apiClient.delete(url, config);
  },

  // For file uploads
  upload: (url, file, fieldName = "file", config = {}) => {
    const formData = new FormData();
    formData.append(fieldName, file);

    return apiClient.post(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default apiService;
