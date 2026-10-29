import axios from 'axios';

async function postJson(url, body) {
  try {
    const res = await axios.post(url, body, { withCredentials: true });
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, data: err.response?.data || {} };
  }
}

export const loginRequest = (log, password) =>
  postJson('/api/login', { log: log.trim(), password });

export const registerRequest = (payload) => postJson('/api/register', payload);
