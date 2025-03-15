import { ModelRegister, ModelDuplicate, ModelLogin, ModelHashedPassword } from '../models/User.js';
import { byCryptCompare, generateToken, verifyToken, SECRET_KEY } from '../../config/import.js';

export const AuthRegister = async (request, reply) => {

  const { username, email, password } = request.body;
  
  if (!username || !email || !password)
  {
      return reply.code(400).send({error: 'Tout les champs sont requis'});
  }

  try {
    const checkUsers = await ModelDuplicate(username,email);
    if (checkUsers.error_users)
    {
        return (reply.code(400).send({error_users: checkUsers.error_users}));
    }
    const users = await ModelRegister(username,email,password);
    return reply.status(201).send({ ok: 'Users ajouter'}, users);

  } catch (error) {
    return (reply.status(500).send({error: 'Une erreur est survenu '}));
  }
}

export const AuthLogin = async (request, reply) => {
  const { username, email, password } = request.body;

  const user = await ModelLogin(username, email);
  if (!user)
    return reply.code(404).send({ error: 'Utilisateur introuvable' });

  let isPasswordValid = await byCryptCompare(password, user.password);
  if (!isPasswordValid)
    return reply.code(404).send({ error: 'Mot de passe incorrect.' });


  const payload = { username, email };
  const token = generateToken(payload, SECRET_KEY, { expiresIn: '1h' });

  try {
    const isTokenValid = verifyToken(token, SECRET_KEY);
    console.log("Le token est valid",isTokenValid);
  } catch (error) {
    console.log('Token invalide ou expiré');
    return reply.code(401).send({ error: 'Token invalide ou expiré' });
  }

  return reply.code(200).send({
    message: 'Connexion réussie',
    user,
    token
  });
};
