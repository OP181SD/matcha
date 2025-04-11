import fastify from 'fastify';
import { AuthRegister, AuthLogin, AuthToken, AuthUpdate, AuthProfile } from '../controllers/authControllers.js';
import { checkAuthToken } from '../controllers/authControllers.js'; 

const registerRoute = (fastify) => {
  fastify.post('/register', AuthRegister);
};

const loginRoute = (fastify) => {
  fastify.post('/login', AuthLogin);
};

const tokenRoute = (fastify) => {
  fastify.post('/token', AuthToken);
};

const updateRoute = (fastify) => {
  fastify.put('/update', AuthUpdate);
};


const protectedRoute = (fastify) => {
  fastify.get('/protected', { preHandler: checkAuthToken }, async (request, reply) => {
    return reply.send({ message: 'Accès autorisé', user: request.user });
  });
};

const userProfileRoute = (fastify) => {
  fastify.get('/user-profile', { preHandler: checkAuthToken }, async (request, reply) => {
    return reply.send({ message: 'Profil utilisateur', user: request.user });
  });
};

const updateProfilRoute = (fastify) => {
  fastify.put('/profil', { preHandler: checkAuthToken }, async (request, reply) => {
    console.log('Dans la route /profil');
    return AuthProfile(request, reply);
  });
};


// Route de déconnexion
const logoutRoute = (fastify) => {
  fastify.get('/logout', async (request, reply) => {
    reply.clearCookie('access_token');
    return reply.send({ message: 'Déconnexion réussie' });
  });
};

export default async function authRoutes(fastify) {
  registerRoute(fastify);
  loginRoute(fastify);
  tokenRoute(fastify);
  updateRoute(fastify);
  protectedRoute(fastify);
  updateProfilRoute(fastify);
  userProfileRoute(fastify);
  logoutRoute(fastify);
}
