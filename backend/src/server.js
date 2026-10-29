import fastify from './app.js';
import { initializeSocketServer } from './socket/initializeSocketServer.js';
import { startCleanupCron } from './cron/cleanup.js';

const start = async () => {
  try {
    startCleanupCron(fastify);
    await fastify.listen({ port: 5001, host: '0.0.0.0' });
    fastify.io = initializeSocketServer(fastify.server, fastify);

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
