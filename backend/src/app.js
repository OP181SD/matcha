import { fastify } from '../config/import.js';
import authRoutes  from './routes/authRoutes.js';


fastify.register(authRoutes);



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