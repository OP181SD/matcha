import { ModelRegister, ModelDuplicate, ModelLogin, } from '../models/User.js';

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
  const { username, email } = request.body;  


  const users = await ModelLogin(username, email);

  if (users.error) {
    
    return reply.code(400).send({ error: users.error });
  } else {
  
    return reply.status(200).send({ message: "Utilisateur trouvé", username: users.username });
  }
};
