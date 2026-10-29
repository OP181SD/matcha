import { fastify } from "../../instance.js";
import { decryptMessage, encryptMessage, isEncrypted } from "../../utils/messageCrypto.js";


export const modelCreateMessage = async ({ channelId, senderId, content }) => {
  const encryptedContent = encryptMessage(content);

  const result = await fastify.pg.query(
    `INSERT INTO messages (channel_id, sender_id, content, created_at, is_read)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP, false)
     RETURNING id, channel_id, sender_id, content, created_at, is_read, read_at;`,
    [channelId, senderId, encryptedContent]
  );

  return {
    ...result.rows[0],
    content, 
  };
};

export const modelGetMessagesByChannel = async (channelId, count) => {
  const result = await fastify.pg.query(
    `SELECT id, channel_id, sender_id, content, created_at, is_read, read_at
     FROM messages
     WHERE channel_id = $1
     ORDER BY created_at ASC
     LIMIT $2;`,
    [channelId, count ?? 50]
  );

  return result.rows.map(msg => ({
    ...msg,
    content: isEncrypted(msg.content) ? decryptMessage(msg.content) : msg.content
  }));
};

export const modelGetChannelsByUser = async (userId) => {
    const result = await fastify.pg.query(
        `SELECT id FROM channel WHERE user_id_1 = $1 OR user_id_2 = $1`,
        [userId]
    );
    return result.rows.map(row => row.id);
};

export const markMessagesAsRead = async (pg, channelId, userId) => {
  return pg.query(
    `
    UPDATE messages
    SET is_read = TRUE, read_at = NOW()
    WHERE channel_id = $1
      AND sender_id != $2
      AND is_read = FALSE
    `,
    [channelId, userId]
  );
};

export const getUnreadMessagesCount = async (pg, userId) => {
  const { rows } = await pg.query(
    `
    SELECT COUNT(*) AS count
    FROM messages m
    JOIN channel c ON c.id = m.channel_id
    WHERE (c.user_id_1 = $1 OR c.user_id_2 = $1)
      AND m.sender_id != $1
      AND m.is_read = false
    `,
    [userId]
  );

  return parseInt(rows[0].count, 10);
};

export const getLastMessage = async (pg, channelId) => {
  const { rows } = await pg.query(
    `
    SELECT id, channel_id, sender_id, content, created_at, is_read, read_at
    FROM messages
    WHERE channel_id = $1
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [channelId]
  );

  return rows[0] || null;
};
