import axios from 'axios';

const api = axios.create({ withCredentials: true });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        await axios.post('/api/refresh-token', {}, { withCredentials: true });
      } catch {
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(error);
      }
      return api(original);
    }

    return Promise.reject(error);
  }
);

export default api;
