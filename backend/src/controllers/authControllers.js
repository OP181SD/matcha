import { ModelRegister, ModelDuplicate, ModelLogin, ModelUpdate } from '../models/User.js';
import { byCryptCompare, generateToken, verifyToken, SECRET_KEY } from '../../config/import.js';

export const AuthRegister = async (request, reply) => {

  const { username, email, password } = request.body;

  if (!username || !email || !password) {
    return reply.code(400).send({ error: 'Tout les champs sont requis' });
  }

  try {
    const checkUsers = await ModelDuplicate(username, email);
    if (checkUsers.error_users) {
      return (reply.code(400).send({ error_users: checkUsers.error_users }));
    }
    const users = await ModelRegister(username, email, password);
    return reply.code(201).send({ ok: 'Users ajouter' }, users);

  } catch (error) {
    return (reply.code(500).send({ error: 'Une erreur est survenu ' }));
  }
}

export const getToken = async (username, email) => {
  const payload = { username, email };
  return generateToken(payload, SECRET_KEY, {
    expiresIn: '30 seconds',
  });
};

export const AuthToken = async (request, reply) => {
  const authHeader = request.headers['authorization'];

  if (!authHeader) {
    return reply.code(401).send({ err_auth_login_auth_token: 'Token manquant' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token, SECRET_KEY);

    request.user = decoded;

    return reply.code(200).send({ message: 'Token valide', user: decoded });

  } catch (error) {
    return reply.code(401).send({ err_auth_login: 'Token invalide ou expiré' });
  }

};

export const AuthLogin = async (request, reply) => {
  const { identifier, password } = request.body;

  if (!identifier || !password) {
    return reply.code(400).send({ err_auth_login: 'Erreur : Identifiant ou mot de passe manquant.' });
  }

  const user = await ModelLogin(identifier);
  if (!user) {
    return reply.code(404).send({ err_auth_login: 'Utilisateur non trouvé.' });
  }

  let isPasswordValid = await byCryptCompare(password, user.password);
  if (!isPasswordValid) {
    return reply.code(401).send({ err_auth_login: 'Mot de passe incorrect.' });
  }

  const token = await getToken(user.username, user.email);
  return reply.code(200).send({
    message: 'Connexion réussie',
    user,
    token
  });
};


export const AuthUpdate = async (request, reply) => {
  const { username, id } = request.body;
  if (!username) {
    return (reply.code(400).send({ err_auth_update: 'Erreur champs a modifier manquant.' }));
  }
  const update = await ModelUpdate(username, id);
  if (!update) {
    return reply.code(404).send({ err_auth_login: 'Ce nom existe pas ' });
  }
}