import { modelId } from '../../../models/profile/profileQueries.js';
import { isProfileComplete } from '../../../models/profile/isProfileComplete.js';
import { modelDeleteAccount } from '../../../models/user/account.js';

export const checkAuth = async (request, reply) => {
  try {
    reply.send({ status: 'connected', user: request.user });
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
};

export const getMe = async (request, reply) => {
  if (!request.user) return { authenticated: false };
  try {
    const user = await modelId(request.server.pg, request.user.id);
    if (!user) return { authenticated: false };
    const profile_complete = await isProfileComplete(request.server.pg, request.user.id);
    return { authenticated: true, user, profile_complete };
  } catch {
    return { authenticated: false };
  }
};

export const deleteAccount = async (request, reply) => {
  const deleted = await modelDeleteAccount(request.server.pg, request.user.id);
  if (!deleted) return reply.code(404).send({ error: 'Compte introuvable.' });
  return reply
    .clearCookie('access_token', { path: '/' })
    .clearCookie('refresh_token', { path: '/' })
    .send({ success: true });
};
