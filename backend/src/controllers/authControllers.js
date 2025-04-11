import { ModelRegister, ModelDuplicate, ModelLogin, ModelUpdate, ModelNextProfile } from '../models/User.js';
export const AuthRegister = async (request, reply) => {

  const { username, email, password, confirmPassword } = request.body;

  if (!username || !email || !password || !confirmPassword)
    return reply.code(400).send({ error: 'Tout les champs sont requis' });

  if (password !== confirmPassword)
    return reply.status(400).send({ message: 'Les mots de passe ne corresspond pas ' });

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
