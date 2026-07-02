import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: { 'Content-Type': 'application/json' },
});

const pendingRequests = new Map();
const requestCooldown = 2000; 
const lastRequestTimes = new Map();

// --- EXPIRED TOKEN STATES ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

// === REQUEST INTERCEPTOR ===
apiClient.interceptors.request.use((config) => {
  const url = config.url || '';
  const now = Date.now();

  if (url.includes('users/auth/me/') || url.includes('/auth/token/refresh/')) {
    return config;
  }

  if (pendingRequests.has(url)) {
    return Promise.reject(new axios.Cancel('Duplicate request'));
  }

  const lastTime = lastRequestTimes.get(url) || 0;
  if (now - lastTime < requestCooldown) {
    return Promise.reject(new axios.Cancel('Rate limited'));
  }

  pendingRequests.set(url, true);
  lastRequestTimes.set(url, now);

  return config;
}, (error) => Promise.reject(error));


// === RESPONSE INTERCEPTOR (FIX PARA SA EXPIRED TOKEN) ===
apiClient.interceptors.response.use(
  (response) => {
    if (response.config && response.config.url) {
      pendingRequests.delete(response.config.url);
    }
    return response;
  },
  async (error) => {
    if (error.config && error.config.url) {
      pendingRequests.delete(error.config.url);
    }

    const originalRequest = error.config;

    // KAPAG EXPIRED ANG TOKEN (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // I-queue ang iba pang requests habang nagre-refresh
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(() => apiClient(originalRequest))
        .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Mag-request ng bagong cookie (GAMIT ANG PURE AXIOS)
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/token/refresh/`, {}, {
          withCredentials: true 
        });

        isRefreshing = false;
        processQueue(null);

        // I-retry ang original failed request
        return apiClient(originalRequest);

      } catch (refreshError) {
        // KAPAG EXPIRED NA RIN ANG REFRESH TOKEN
        isRefreshing = false;
        processQueue(refreshError);
        
        // WALANG window.location.href DITO. Ipapasa lang ang error sa AuthContext.
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;