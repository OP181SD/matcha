import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import formbody from '@fastify/formbody';
import cors from '@fastify/cors';
import { API_URL, DATABASE_URL, JWT_SECRET } from '../config/config.js';
import { authRoutes } from './routes/authRoutes.js';
import {modelId } from './models/User.js'
// Création de l'instance Fastify
export const fastify = Fastify({ logger: true });

// 🔌 Plugins
fastify.register(fastifyPostgres, {
    connectionString: DATABASE_URL,
});

fastify.register(cors, {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});


fastify.register(formbody);
fastify.register(fastifyCookie); 

console.log("🗝️ JWT Secret utilisé :", JWT_SECRET);
fastify.register(fastifyJwt, {
    secret: JWT_SECRET,
    cookie: {
        cookieName: 'access_token',
        signed: false,
    },
});

// 🛠️ Helpers
fastify.decorate('signToken', function (payload) {
    return this.jwt.sign(payload, { expiresIn: '1h' });
});

fastify.decorate('verifyToken', async function (token) {
    try {
        const decoded = await this.jwt.verify(token);
        return decoded;
    } catch (err) {
        this.log.error("❌ Erreur dans verifyToken :", err.message);
        throw err;
    }
});

// 🔒 Middleware d'authentification
fastify.decorate("authenticate", async function (request, reply) {
    console.log("🍪 Cookies reçus :", request.cookies);
    const token = request.cookies.access_token;
    console.log("🔍 Token brut reçu :", token);

    if (!token) {
        console.log("❌ Aucun token trouvé");
        return reply.code(401).send({ error: 'Token manquant' });
    }

    try {
        const decoded = await request.jwtVerify();
        console.log("✅ Token décodé :", decoded);
    } catch (err) {
        console.log("🚫 Erreur de vérification du token :", err.message);
        reply.code(401).send({ error: 'Unauthorized' });
    }
});

// 📦 Routes
fastify.register(authRoutes);


fastify.get('/auth/me', { preHandler: fastify.authenticate }, async (request, reply) => {
    const decoded = request.user;  
    
    try {
        const user = await modelId(request.server.pg, decoded.id);  
        
        if (!user) {
            return reply.code(404).send({ error: 'Utilisateur non trouvé' });
        }

        reply.send({ user });
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', err);
        reply.code(500).send({ error: 'Erreur interne du serveur' });
    }
});

fastify.get('/connection_db', async (_, reply) => {
    try {
        const client = await fastify.pg.connect();
        client.release();
        reply.status(201).send({ connexion_status: 'Connexion réussie' });
    } catch (error) {
        reply.status(500).send({
            message: 'Erreur de connexion à la base de données !',
            error: error.message,
        });
    }
});

// 🚀 Démarrage du serveur
const start = async () => {
    try {
        await fastify.listen({ port: 5001, host: '0.0.0.0' });
        console.log(`🚀 Server running at ${API_URL}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
