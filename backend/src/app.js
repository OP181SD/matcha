import { fastify } from '../config/import.js';
import { AuthToken } from './controllers/authControllers.js';
import authRoutes  from './routes/authRoutes.js';


fastify.register(authRoutes);

console.log("Démarrage du serveur...");

fastify.get('/', async () => {
  const client = await fastify.pg.connect();
  try {
    const { rows } = await client.query('SELECT * FROM users');
    console.log("Connected !!!");
    return rows;
  } finally {
    client.release();
  }
});


// fastify.get('/protected', {
//   preHandler: AuthToken, 
// }, async (request, reply) => {
//   return reply.code(200).send({
//     message: 'Vous avez accès aux données protégées',
//     user: request.user
//   });
// });


try {
  await fastify.listen({ port: 5001, host: '0.0.0.0' });

  console.log("Serveur démarré! sur http://localhost:5001");
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}

