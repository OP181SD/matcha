import { fastify } from './instance.js';
import fastifyPostgres from '@fastify/postgres';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import formbody from '@fastify/formbody';
import cors from '@fastify/cors';
import { DATABASE_URL, JWT_SECRET } from '../config/env.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import pictureRoutes from './routes/pictureRoutes.js';
import viewProfileRoutes from './routes/viewProfileRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

import registerAuth from './plugins/auth.js';

const APP_URL = process.env.APP_URL || 'http://localhost:8080';

fastify.register(cors, {
  origin: [APP_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

fastify.register(formbody);
fastify.register(fastifyCookie);
fastify.register(fastifyPostgres, { connectionString: DATABASE_URL });
fastify.register(fastifyJwt, {
  secret: JWT_SECRET,
  cookie: { cookieName: 'access_token', signed: false },
});

fastify.decorate('io', null);

await registerAuth(fastify);

await fastify.register(authRoutes, { prefix: '/api' });
await fastify.register(profileRoutes, { prefix: '/api' });
await fastify.register(pictureRoutes, { prefix: '/api' });
await fastify.register(viewProfileRoutes, { prefix: '/api' });
await fastify.register(notificationRoutes, { prefix: '/api' });
await fastify.register(messageRoutes, { prefix: '/api' });

export default fastify;
