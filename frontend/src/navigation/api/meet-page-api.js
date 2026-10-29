import api from '../../utils/api.js';

export const fetchProfiles = async (sortBy = 'distance') => {
  try {
    const { data } = await api.get(`/api/profiles/available?sortBy=${sortBy}`);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
};

export const fetchFilters = async () => {
  try {
    const { data } = await api.get('/api/filters');
    return data.filters || {};
  } catch (err) {
    return {};
  }
};

export const saveFilters = async (filtersToSave) => {
  try {
    await api.post('/api/filters', filtersToSave);
  } catch (err) {
  }
};

export const likeProfile = async (likedId) => {
  try {
    const { data } = await api.post('/api/like', { likedId });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Erreur lors du like.");
  }
};

export const dislikeProfile = async (dislikedId) => {
  try {
    const { data } = await api.post('/api/dislike', { dislikedId });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Erreur lors du dislike.");
  }
};
