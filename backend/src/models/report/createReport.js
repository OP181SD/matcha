export const createReport = async (
  client,
  reporterId,
  reportedId,
  reason
) => {
  return client.query(
    `
    INSERT INTO reports (reporter_id, reported_id, reason)
    VALUES ($1, $2, $3)
    `,
    [reporterId, reportedId, reason]
  );
};
