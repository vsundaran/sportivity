import axios from 'axios';
import { Platform } from 'react-native';
// import { getUniqueId } from 'react-native-device-info';

// Base URL configuration
const BASE_URL = Platform.select({
  ios: 'https://sportivity-bhzk.onrender.com/api',
  android: 'https://sportivity-bhzk.onrender.com/api',
  default: 'https://sportivity-bhzk.onrender.com/api',
});

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async config => {
    // Get token from storage or Redux store
    // const token = store.getState().auth.token; // example for Redux
    // or const token = await AsyncStorage.getItem('userToken');
    
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    // Add device ID to headers
    // const deviceId = await getUniqueId();
    // config.headers['X-Device-Id'] = deviceId;
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    // Any status code within 2xx will trigger this
    return response.data;
  },
  async error => {
    // Any status codes outside 2xx will trigger this
    const originalRequest = error.config;
    
    // Handle token refresh if 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        
        // Store new tokens
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        
        // Update authorization header
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed - logout user
        // store.dispatch(logoutUser());
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      const errorMessage = error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something happened in setting up the request
      return Promise.reject(error);
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
  upload: (url, file, fieldName = 'file', config = {}) => {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    return apiClient.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default apiService;