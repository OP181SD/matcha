import { fastify } from '../config/import.js';
import authRoutes  from './routes/authRoutes.js';

// Enregistrer les routes d'abord
fastify.register(authRoutes);

console.log("Démarrage du serveur...");

// Route de test pour vérifier la connexion à la base de données
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


try {
  // Démarrer le serveur après avoir enregistré les routes
  await fastify.listen({ port: 5001, host: '0.0.0.0' });

  // Une fois le serveur démarré, tu peux logguer "Connected !!!"
  console.log("Serveur démarré sur http://localhost:5001");
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}

