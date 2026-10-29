import { modelId } from "../../../models/profile/profileQueries.js";
import { isProfileComplete } from "../../../models/profile/isProfileComplete.js";
import { comparePassword } from "../../../utils/hash.js";
import { modelSetUserOnline, modelSetUserOffline } from '../../../models/user/presence.js';
import { modelFindUserByUsername } from '../../../models/user/account.js';
import { normUsername } from "../../../utils/normalize.js";
import { cookieOptions } from "../../../utils/cookies.js";

const validateLoginFields = async (request, reply) => {
  const { password } = request.body;

  const log = normUsername(request.body.log);

  if (!log || !password) {
    reply.code(400).send({ error: "Aucun paramètre d'identification fourni" });
    return false;
  }

  const user = await modelFindUserByUsername(request.server, log);

  if (!user) {
    reply.code(400).send({ error: "Identifiants incorrects" });
    return false;
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    reply.code(400).send({ error: "Identifiants incorrects" });
    return false;
  }

  if (!user.username || !user.email || !user.username.trim() || !user.email.trim()) {
    reply.code(400).send({ error: "Champs utilisateur obligatoires manquants" });
    return false;
  }

  request.foundUser = user;
  return true;
}

export const authLogin = async (request, reply) => {
  const isValidFields = await validateLoginFields(request, reply);
  if (!isValidFields) return;

  try {

    const user = request.foundUser;

    if (!user.is_verified) {
      return reply.code(200).send({
        success: false,
        error: 'Compte non validé. Veuillez vérifier votre e-mail.',
        userId: user.id,
        account_valid: false
      });
    }

    await modelSetUserOnline(request.server, user.id);

    const accessToken = request.server.signToken({ id: user.id });
    const refreshToken = request.server.refreshSignToken({ id: user.id });
    const profile_complete = await isProfileComplete(request.server.pg, user.id);

    reply
      .setCookie('access_token', accessToken, cookieOptions())
      .setCookie('refresh_token', refreshToken, cookieOptions())
      .code(200)
      .send({
        success: true,
        message: 'Connexion réussie',
        userId: user.id,
        account_valid: true,
        profile_complete
      });

  } catch (err) {
    request.log.error(err, 'Erreur dans authLogin :');
    reply.code(500).send({ error: 'Erreur serveur, veuillez réessayer plus tard.' });
  }
}

export const authLogout = async (request, reply) => {
  try {
    if (request.user?.id) {
      await modelSetUserOffline(request.server, request.user.id);
    }

    reply
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .code(200)
      .send({ success: true });
  } catch (error) {
    request.log.error(error, 'Erreur lors de la déconnexion :');
    reply.code(500).send({ error: 'Erreur lors de la déconnexion' });
  }
};

export const refreshToken = async (request, reply) => {
  const refreshToken = request.cookies.refresh_token;
  if (!refreshToken) {
    return reply.code(401).send({ error: 'Refresh token manquant' });
  }

  try {
    const decoded = await request.server.jwt.verify(refreshToken);

    const user = await modelId(request.server.pg, decoded.id);
    if (!user) {
      return reply.code(404).send({ error: 'Utilisateur non trouvé' });
    }

    const newAccessToken = request.server.signToken({ id: user.id });

    reply
      .setCookie('access_token', newAccessToken, cookieOptions())
      .send({ message: 'Access token renouvelé', token: newAccessToken });
  } catch (err) {
    request.log.error(err, 'Erreur dans la vérification du refresh token :');
    reply.code(401).send({ error: 'Refresh token invalide ou expiré' });
  }
}
