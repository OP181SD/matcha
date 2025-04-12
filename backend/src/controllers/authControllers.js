import fastify from 'fastify';
import { ModelId, ModelNextProfile, modelRegister } from '../models/User.js';

export const AuthRegister = async (request, reply) => {

  const { username, email, password } = request.body;

  try {
    const user = await modelRegister(username, email, password);

    console.log('Utilisateur enregistré:', user[0].id); // Affichage ici
  
    reply.setCookie('id', user[0].id, {
      httpOnly: true,
      secure: false, // true si HTTPS
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
  const userId = request.cookies.id;
  const { firstname } = request.body;

  if (!userId) {
    return reply.status(401).send({ error: 'Utilisateur non authentifié !' });
  }

  if (!firstname) {
    return reply.status(400).send({ error: 'Le prénom est requis' });
  }

  try {
    const updatedUser = await ModelNextProfile(userId, firstname);

    if (updatedUser.status === 'success') {
      // ✅ Générer le JWT avec fastify-jwt
      const token = await reply.jwtSign({ id: userId });

      // ✅ Stocker le JWT dans un cookie HTTP-only
      reply.setCookie('token', token, {
        httpOnly: true,
        secure: false, // true si HTTPS
        sameSite: 'Strict',
        path: '/',
      });

      return reply.send({ message: 'Profil mis à jour avec succès', user: updatedUser.user });
    } else {
      return reply.status(404).send({ error: updatedUser.message });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return reply.status(500).send({ error: 'Erreur lors de la mise à jour du profil' });
  }
};


export const DisplayToken = async (request, reply) => {

  const token = request.cookies.token;

  if (!token) {
    return reply.status(401).send({ error: 'Token non trouvé' });
  }
  
  try {
    const decoded = await request.jwtVerify();
    return reply.send({ message: 'Token valide', decoded });
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return reply.status(401).send({ error: 'Token invalide' });
  }
  // const token = request.cookies.token;
}