import api from '../../utils/api.js';

export const fetchProfileById = async (id) => {
  try {
    const { data } = await api.get(`/api/profile/${id}`);
    const pictures = (data.pictures || []).map(pic => (typeof pic === 'string' ? pic : pic.url));
    return { ...data, pictures };
  } catch (err) {
    if (err.response?.status === 403) throw new Error("Utilisateur introuvable.");
    throw new Error('Erreur de chargement du profil.');
  }
};

export const checkLikeStatus = async (id) => {
  try {
    const { data } = await api.get(`/api/check-like/${id}`);
    return data.liked || false;
  } catch {
    throw new Error('Erreur lors de la vérification du like.');
  }
};

export const toggleLike = async (id, liked) => {
  const endpoint = liked ? 'unlike' : 'like';
  try {
    const { data } = await api.post(`/api/${endpoint}`, { likedId: parseInt(id) });
    return data;
  } catch {
    throw new Error('Erreur lors du like/unlike.');
  }
};

export const reportProfile = async (id, reason) => {
  try {
    const { data } = await api.post('/api/reports', { reportedId: id, reason });
    return data;
  } catch {
    throw new Error('Erreur lors du signalement.');
  }
};

export const blockProfile = async (id) => {
  try {
    const { data } = await api.post('/api/block-user', { blockedId: parseInt(id) });
    return data;
  } catch {
    throw new Error('Erreur lors du blocage.');
  }
};
