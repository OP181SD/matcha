export const socketAuthMiddleware = (fastify) => {
  return (socket, next) => {
    try {
      const rawCookie = socket.request.headers.cookie || '';
      const cookies = fastify.parseCookie(rawCookie);
      const token = cookies.access_token;

      if (!token) {
        console.warn(" [Erreur] Token manquant");
        return next(new Error('Token manquant'));
      }
      const decoded = fastify.jwt.verify(token);
      socket.user = decoded;
      next();
    } catch (err) {
      console.error("[Erreur d’authentification WebSocket]", err.message);
      return next(new Error('Token invalide'));
    }
  };
};