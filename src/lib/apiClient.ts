import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define the queue item interface
interface QueueItem {
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
}

let failedQueue: QueueItem[] = [];
let isRefreshing = false;

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token || '');
    }
  });
  
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refreshToken');
    
    // If the error is not 401 or it's already retried, reject
    if (
      error.response?.status !== 401 || 
      originalRequest._retry || 
      error.response?.data?.code !== 'TOKEN_EXPIRED' ||
      !refreshToken
    ) {
      return Promise.reject(error);
    }
    
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
      .then(token => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      })
      .catch(err => {
        return Promise.reject(err);
      });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      // Call the refresh token endpoint
      const response = await api.post('/auth/refresh', { refreshToken });
      const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      // Update authorization header for the original request
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      
      // Process any queued requests
      processQueue(null, newToken);
      
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      
      // Clear tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Trigger logout event
      window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api; 