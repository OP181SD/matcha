import fastify from 'fastify';
import { modelRegister } from '../models/User.js';
import { ModelNextProfile } from '../models/User.js';


export const AuthRegister = async (request, reply) => {

  const { username, email, password } = request.body;

  try {

    const user = await modelRegister(username, email, password);

    console.log('Utilisateur enregistré:', user[0].id);

    const token = await reply.jwtSign({ id: user[0].id });

    reply.setCookie('id', user[0].id, {
      httpOnly: true,
      secure: false, 
      sameSite: 'Strict',
      path: '/',
    });

    reply.setCookie('accces_token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'Strict',
      path: '/',
    });

    reply.send({ message: 'Utilisateur enregistré avec succès', user });

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
    reply.status(500).send({ error: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
  }
};


export const AuthRegisterPartTwo = async (request, reply) => {
  const { firstname } = request.body;


  const userId = request.user?.id;

  if (!userId) {
    return reply.status(401).send({ error: 'Utilisateur non authentifié' });
  }

  if (!firstname) {
    return reply.status(400).send({ error: 'Le prénom est requis' });
  }

  try {

    const updatedUser = await ModelNextProfile(userId, firstname);

    if (updatedUser.status === 'success') {
      return reply.send({ message: 'Profil mis à jour avec succès', user: updatedUser.user });
    } else {
      return reply.status(404).send({ error: updatedUser.message });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return reply.status(500).send({ error: 'Erreur lors de la mise à jour du profil' });
  }
};



export const verifyJWT = async (request, reply) => {
  const token = request.cookies.accces_token;
    console.log('Token reçu:', token);

  if (!token) {
    return reply.status(401).send({ error: 'Token manquant ou invalide' });
  }

  try {

    await request.jwtVerify();

  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return reply.status(401).send({ error: 'Token invalide ou expiré' });
  }
};