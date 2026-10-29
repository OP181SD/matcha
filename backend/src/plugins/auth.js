

export default async (fastify) => {
  fastify.decorate('signToken', payload => fastify.jwt.sign(payload, { expiresIn: '8h' }));
  fastify.decorate('refreshSignToken', payload => fastify.jwt.sign(payload, { expiresIn: '30d' }));

  fastify.decorate('verifyToken', async token => {
    try { return fastify.jwt.verify(token); }
    catch (err) { fastify.log.error("Erreur verifyToken :", err.message); throw err; }
  });

  fastify.decorate('authenticate', async (request, reply) => {
    const token = request.cookies.access_token;
    if (!token) return reply.code(401).send({ error: 'Token manquant' });

    try {
      await request.jwtVerify();
      if (request.user?.id) {
        await fastify.pg.query('UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = $1', [request.user.id]);
      }
    } catch (err) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  fastify.decorate('optionalAuth', async (request, reply) => {
    const token = request.cookies.access_token;
    if (!token) return;

    try {
      await request.jwtVerify();
      if (request.user?.id) {
        await fastify.pg.query('UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = $1', [request.user.id]);
      }
    } catch (err) {
      fastify.log.info("Token invalide (optionnel) :", err.message);
    }
  });
};
