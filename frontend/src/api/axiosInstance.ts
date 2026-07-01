import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // PINAKA-IMPORTANTE: Pinapayagan nito ang browser na magpadala at tumanggap ng cookies
  // === CSRF PROTECTION HEADERS ===
  xsrfCookieName: 'csrftoken', // Pangalan ng cookie na ibibigay ni Django
  xsrfHeaderName: 'X-CSRFToken', // Header name na inaasahan ni Django
  headers: { 'Content-Type': 'application/json' },
});

// Cache para sa mga pending requests at timestamps
const pendingRequests = new Map();
const requestCooldown = 2000; 
const lastRequestTimes = new Map();

apiClient.interceptors.request.use((config) => {
  const url = config.url || '';
  const now = Date.now();

  // VIP PASS para sa auth check para hindi ito harangan ng deduplication kapag nag-refresh ka
  if (url.includes('users/auth/me/')) {
    return config;
  }

  // Deduplication logic para sa ibang requests
  if (pendingRequests.has(url)) {
    console.warn(`Request to ${url} is already pending. Skipping.`);
    return Promise.reject(new axios.Cancel('Duplicate request'));
  }

  // Throttling logic
  const lastTime = lastRequestTimes.get(url) || 0;
  if (now - lastTime < requestCooldown) {
    console.warn(`Please wait ${requestCooldown / 1000}s before trying ${url} again.`);
    return Promise.reject(new axios.Cancel('Rate limited'));
  }

  pendingRequests.set(url, true);
  lastRequestTimes.set(url, now);

  return config;
}, (error) => Promise.reject(error));

// Cleanup kapag tapos na ang request
apiClient.interceptors.response.use(
  (response) => {
    if (response.config && response.config.url) {
      pendingRequests.delete(response.config.url);
    }
    return response;
  },
  (error) => {
    if (error.config && error.config.url) {
      pendingRequests.delete(error.config.url);
    }
    return Promise.reject(error);
  }
);

export default apiClient;