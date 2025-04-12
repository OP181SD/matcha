import { AuthRegister } from '../controllers/authControllers.js';
import { AuthRegisterPartTwo } from '../controllers/authControllers.js';

const registerRoute = (fastify) => {
  fastify.post('/register', AuthRegister);
};


const TokenDisplay = (fastify) => {
  fastify.get('/token', async (request, reply) => {
    const token = request.cookies.token;
    if (!token) {
      return reply.status(401).send({ error: 'Token non trouvé' });
    }
    return reply.send({ token });
  });
};

const profilRoute = (fastify) => {
  fastify.put('/profil', AuthRegisterPartTwo);
}

export default async function authRoutes(fastify) {
  registerRoute(fastify);
  TokenDisplay(fastify);
  profilRoute(fastify);
}