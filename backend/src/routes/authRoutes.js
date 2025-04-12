import { AuthRegister, AuthRegisterPartTwo, verifyJWT } from '../controllers/authControllers.js';

const registerRoute = (fastify) => {
  fastify.post('/register', AuthRegister);
};

const dashboardRoute = (fastify) => {
  fastify.get('/dashboard', { preHandler: verifyJWT }, async (request, reply) => {

    return reply.send({ message: 'Bienvenue dans votre dashboard!' });
  });
};

const profileRoute = (fastify) => {
  fastify.put('/profil', { preHandler: verifyJWT }, AuthRegisterPartTwo);
};

export default async function authRoutes(fastify) {

  registerRoute(fastify);
  dashboardRoute(fastify);
  profileRoute(fastify);
}
