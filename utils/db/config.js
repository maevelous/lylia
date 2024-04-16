const insertGuild = function (payload) {
  if (!db) return;

  const stmt = db.prepare(`
    INSERT INTO guild 
      (id, queue_message_id, queue_channel_id, queue_banner_id)
    VALUES (?, ?, ?, ?) 
    ON CONFLICT(id) DO UPDATE SET
      queue_message_id = excluded.queue_message_id,
      queue_channel_id = excluded.queue_channel_id,
      queue_banner_id = excluded.queue_banner_id
    `);

  stmt.run(
    payload.id,
    payload.queue_message_id,
    payload.queue_channel_id,
    payload.queue_banner_id,
  );

  if (typeof payload.song !== "string")
    payload.song = JSON.stringify(payload.song);

  const stmt2 = db.prepare(
    `INSERT INTO current_song (guild_id, song) VALUES (?, ?) ON CONFLICT(guild_id) DO UPDATE SET song = excluded.song`,
  );
  stmt2.run(payload.id, payload.song);
};

const insertGuildFromMusicSetup = function (payload) {
  if (!db) return;

  const stmt = db.prepare(`
    INSERT INTO guild 
      (id, queue_message_id, queue_channel_id, queue_banner_id)
    VALUES (?, ?, ?, ?) 
    ON CONFLICT(id) DO UPDATE SET
      queue_message_id = excluded.queue_message_id,
      queue_channel_id = excluded.queue_channel_id,
      queue_banner_id = excluded.queue_banner_id
    `);

  stmt.run(
    payload.id,
    payload.queue_message_id,
    payload.queue_channel_id,
    payload.queue_banner_id,
  );

  if (typeof payload.song !== "string")
    payload.song = JSON.stringify(payload.song);

  const stmt2 = db.prepare(
    `INSERT INTO current_song (guild_id, song) VALUES (?, ?) ON CONFLICT(guild_id) DO UPDATE SET song = excluded.song`,
  );
  stmt2.run(payload.id, payload.song);
};

const insertGuildFromModerationSetup = function (payload) {
  if (!db) return;

  const stmt = db.prepare(`
    INSERT INTO guild 
      (id, role_muted_id, role_moderator_id, audit_channel_id)
    VALUES (?, ?, ?, ?) 
    ON CONFLICT(id) DO UPDATE SET
      role_muted_id = excluded.role_muted_id,
      role_moderator_id = excluded.role_moderator_id,
      audit_channel_id = excluded.audit_channel_id
    `);

  stmt.run(
    payload.id,
    payload.role_muted_id,
    payload.role_moderator_id,
    payload.audit_channel_id,
  );
};

const updateGuild = function (payload) {
  if (!db) return;

  const stmt = db.prepare(`
    UPDATE guild
    SET queue_message_id = ?, queue_channel_id = ?, queue_banner_id = ?
    WHERE id = ?`);

  stmt.run(
    payload.queue_message_id,
    payload.queue_channel_id,
    payload.queue_banner_id,
    payload.id,
  );
};

const getGuildConfig = function (id) {
  if (!db) return;

  const stmt = db.prepare(`SELECT * FROM guild WHERE id = ?`);
  return stmt.get(id);
};

const getAllGuilds = function () {
  if (!db) return;

  const stmt = db.prepare(`SELECT * FROM guild`);
  return stmt.all();
};

module.exports = {
  insertGuild,
  updateGuild,
  getGuildConfig,
  getAllGuilds,
  insertGuildFromMusicSetup,
  insertGuildFromModerationSetup,
};
