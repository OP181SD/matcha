import { ModelRegister, ModelDuplicate, ModelLogin, ModelHashedPassword } from '../models/User.js';
import { byCryptCompare } from '../../config/import.js';

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

  if (!user) {
    return reply.code(401).send({ error_auth_login: "Utilisateur non trouvé" });
  }

 

  if (username === user.username && email === user.email && await byCryptCompare(password, user.password)) {
    console.log("OK");
  }
  else
  {
      console.log("Error");
  }
};