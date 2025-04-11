import { fastify, SECRET_KEY, verifyToken } from '../config/import.js';
import authRoutes from './routes/authRoutes.js';
import fastifyCors from '@fastify/cors';
import fastifyCookie from 'fastify-cookie';

fastify.register(fastifyCookie, {
    secret: 'your-secret-key',
    parseOptions: {}
});

fastify.register(fastifyCors, {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});

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


try {
    await fastify.listen({ port: 5001, host: '0.0.0.0' });
    console.log("Serveur démarré! sur http://localhost:5001");
} catch (error) {
    fastify.log.error(error);
    process.exit(1);
}