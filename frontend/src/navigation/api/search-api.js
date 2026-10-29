import api from '../../utils/api.js';

export const searchProfiles = async (criteria = {}) => {
  const params = new URLSearchParams();
  if (criteria.ageMin) params.set('ageMin', criteria.ageMin);
  if (criteria.ageMax) params.set('ageMax', criteria.ageMax);
  if (criteria.popularityMin) params.set('popularityMin', criteria.popularityMin);
  if (criteria.popularityMax) params.set('popularityMax', criteria.popularityMax);
  if (criteria.distanceMax) params.set('distanceMax', criteria.distanceMax);
  if (criteria.tags?.length) params.set('tags', criteria.tags.join(','));
  if (criteria.sortBy) params.set('sortBy', criteria.sortBy);

  try {
    const { data } = await api.get(`/api/profiles/search?${params.toString()}`);
    return Array.isArray(data) ? data : [];
  } catch {
    throw new Error('Erreur lors de la recherche.');
  }
};

export const fetchAllTags = async () => {
  try {
    const { data } = await api.get('/api/tags/all');
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};
