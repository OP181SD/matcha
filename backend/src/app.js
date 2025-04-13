// src/app.js
import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { API_URL, DATABASE_URL, JWT_SECRET } from '../config/config.js';
import { authRoutes } from './routes/authRoutes.js';

const fastify = Fastify({
    logger: true,
});

fastify.register(fastifyPostgres, {
    connectionString: DATABASE_URL,
});

// Plugins et Routes 
fastify.register(fastifyCookie);
fastify.register(authRoutes);

fastify.register(fastifyJwt, {
    secret: JWT_SECRET,
    cookie: {
        cookieName: 'access_token',
        signed: false,
    },
});

fastify.decorate("authenticate", async function (request, reply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
    }
});

fastify.get('/connection_db', async (_, reply) => {
    try {
        const client = await fastify.pg.connect();
        client.release();
        reply.status(201).send({
            connexion_status: 'Connexion réussie',
        })
    } catch (error) {
        reply.status(500).send({
            message: 'Erreur de connexion à la base de données',
            error: error.message,
        })
    }
})


const start = async () => {
    try {
        fastify.listen({ port: 5001, host: '0.0.0.0' });
        console.log(`🚀 Server running at ${API_URL}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();