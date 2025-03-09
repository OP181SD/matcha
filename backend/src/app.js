import { fastify } from '../config/import.js';
import { InsertUser, DupUsers, } from './models/User.js';

fastify.post('/register', async (request, reply) => {
  const { username, email, password } = request.body;

  if (!username || !email || !password) {
    return reply.code(400).send({ error: 'Tous les champs sont requis.' });
  }

  try {
    const checkUsers = await DupUsers(username, email);
    if (checkUsers.error_users)
      return reply.code(400).send({ error_users: checkUsers.error_users });

    const users = await InsertUser(username, email, password);
    return reply.status(201).send({ ok: 'Utilisateur ajouté', users });

  } catch (error) {
    reply.status(500).send({ error: 'Une erreur est survenue' });
  }
});


fastify.get('/', async () => {
  const client = await fastify.pg.connect();
  try {
    const { rows } = await client.query('SELECT * FROM users');
    console.log("Connected !");
    return rows;
  } finally {
    client.release();
  }
});

try {
  await fastify.listen({ port: 5001, host: '0.0.0.0' });
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}
