import { fastify } from '../../instance.js';

export const createNotification = async (userId, type, data) => {
  const client = await fastify.pg.connect();
  
  try {
    const { rows } = await client.query(`
      INSERT INTO notifications (user_id, type, data, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `, [userId, type, JSON.stringify(data)]);
    
    return rows[0];
  } catch (error) {
    console.error('Erreur lors de la création de notification:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getUserNotifications = async (userId, limit = 50) => {
  const client = await fastify.pg.connect();
  
  try {
    const { rows } = await client.query(`
      SELECT * FROM notifications 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `, [userId, limit]);
    
    return rows.map(row => ({
      ...row,
      data: row.data ? (typeof row.data === 'string' ? JSON.parse(row.data) : row.data) : null
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const markNotificationAsRead = async (notificationId, userId) => {
  const client = await fastify.pg.connect();
  
  try {
    await client.query(`
      UPDATE notifications 
      SET is_read = true, read_at = NOW() 
      WHERE id = $1 AND user_id = $2
    `, [notificationId, userId]);
  } catch (error) {
    console.error('Erreur lors du marquage de notification:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const deleteNotification = async (notificationId, userId) => {
  const client = await fastify.pg.connect();
  
  try {
    await client.query(`
      DELETE FROM notifications 
      WHERE id = $1 AND user_id = $2
    `, [notificationId, userId]);
  } catch (error) {
    console.error('Erreur lors de la suppression de notification:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getUnreadNotificationCount = async (userId) => {
  const client = await fastify.pg.connect();
  
  try {
    const { rows } = await client.query(`
      SELECT COUNT(*) as count 
      FROM notifications 
      WHERE user_id = $1 AND is_read = false
    `, [userId]);
    
    return parseInt(rows[0].count);
  } catch (error) {
    console.error('Erreur lors du comptage des notifications:', error);
    throw error;
  } finally {
    client.release();
  }
};