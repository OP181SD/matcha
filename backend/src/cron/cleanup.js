import cron from 'node-cron';
import { modelDeleteExpiredUnverifiedUsers } from '../models/user/account.js'

export function startCleanupCron(fastify) {
  cron.schedule('*/30 * * * *', async () => {
    try {
      await modelDeleteExpiredUnverifiedUsers({ server: fastify });
    } catch (err) {
      console.error('[Cron] Erreur nettoyage comptes:', err);
    }
  });
}
