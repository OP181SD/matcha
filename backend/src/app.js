import { fastify } from '../config/import.js';
import { AuthToken } from './controllers/authControllers.js';
import authRoutes from './routes/authRoutes.js';
import fastifyCors from '@fastify/cors';
import fastifyCookie from 'fastify-cookie';
import profileRoutes from './routes/profileRoutes.js';
import fastifyJwt from '@fastify/jwt';

fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'votre_clé_secrète_par_défaut',
  cookie: {
    cookieName: 'token',
    signed: false
  }
});

fastify.decorate("authenticate", async function (request, reply) {
  try {
    // Utilise la méthode intégrée de fastify-jwt pour vérifier les cookies
    await request.jwtVerify({ 
      onlyCookie: true  // Force l'utilisation du cookie uniquement
    });
  } catch (err) {
    console.error("Erreur d'authentification:", err.message);
    reply.code(401).send({ 
      error: 'Session invalide ou expirée, veuillez vous reconnecter',
    });
  }
});


fastify.register(fastifyCookie, {
  secret: process.env.JWT_SECRET, 
  parseOptions: {} 
});

fastify.register(fastifyCors, {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

fastify.register(authRoutes);
fastify.register(profileRoutes);


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

fastify.get('/protected', { preHandler: [fastify.authenticate] }, async (request, reply) => {
  return reply.send({ message: 'Accès OK', user: request.user });
});

async function createTables() {
  try {
    await fastify.pg.query(`
      -- Création de la table users
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Création de la table profiles
      CREATE TABLE IF NOT EXISTS profiles (
          user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          gender VARCHAR(50),
          sexual_preferences VARCHAR(50),
          biography TEXT,
          fame_rating INTEGER DEFAULT 0,
          latitude DECIMAL(9,6),
          longitude DECIMAL(9,6),
          is_geolocation_active BOOLEAN DEFAULT TRUE,
          image_url TEXT NOT NULL,
          last_connection TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Tables vérifiées/créées avec succès!");
  } catch (error) {
    console.error("Erreur lors de la vérification/création des tables:", error);
    throw error;
  }
}

try {
  await fastify.listen({ port: 5001, host: '0.0.0.0' });
  console.log("Serveur démarré! sur http://localhost:5001");
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}