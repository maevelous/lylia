const getAuditLogForGuild = function (guildId) {
  if (!db) return;

  const stmt = db.prepare(`SELECT * FROM audit_log WHERE guild_id = ?`);
  return stmt.all(guildId);
};

const getAuditLogForUserInGuild = function (guildId, userId) {
  if (!db) return;

  const stmt = db.prepare(
    `SELECT * FROM audit_log WHERE guild_id = ? AND user_id = ?`,
  );
  return stmt.all(guildId, userId);
};

const getAuditLogForUser = function (userId) {
  if (!db) return;

  const stmt = db.prepare(`SELECT * FROM audit_log WHERE user_id = ?`);
  return stmt.all(userId);
};

const insertAuditLog = function (payload) {
  if (!db) return;

  const stmt = db.prepare(`
    INSERT INTO audit_log 
      (guild_id, user_id, author_id, action, timestamp, data)
    VALUES (?, ?, ?, ?, ?, ?)`);
  stmt.run(
    payload.guild_id,
    payload.user_id,
    payload.author_id,
    payload.action,
    payload.timestamp,
    payload.reason,
  );
};

module.exports = {
  getAuditLogForGuild,
  insertAuditLog,
  getAuditLogForUserInGuild,
  getAuditLogForUser,
};
