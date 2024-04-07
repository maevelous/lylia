const fs = require("fs")
const sql = require('better-sqlite3');

const insertGuild = function(payload) {
  if (!db) return;

  const stmt = db.prepare(`
    INSERT INTO guild 
      (id, queue_message_id, queue_channel_id, queue_banner_id)
    VALUES (?, ?, ?, ?) 
    ON CONFLICT(id) DO UPDATE SET
      queue_message_id = excluded.queue_message_id,
      queue_channel_id = excluded.queue_channel_id,
      queue_banner_id = excluded.queue_banner_id
    `
  );

  stmt.run(payload.id, payload.queue_message_id, payload.queue_channel_id, payload.queue_banner_id);

  if (typeof payload.song !== 'string') payload.song = JSON.stringify(payload.song);

  const stmt2 = db.prepare(`INSERT INTO current_song (guild_id, song) VALUES (?, ?) ON CONFLICT(guild_id) DO UPDATE SET song = excluded.song`);
  stmt2.run(payload.id, payload.song);
}

const updateGuild = function(payload) {
  if (!db) return;

  const stmt = db.prepare(`
    UPDATE guild
    SET queue_message_id = ?, queue_channel_id = ?, queue_banner_id = ?
    WHERE id = ?`
  );

  stmt.run(payload.queue_message_id, payload.queue_channel_id, payload.queue_banner_id, payload.id);
}

const getCurrentSong = function(guildId) {
  if (!db) return;

  const stmt = db.prepare(`SELECT * FROM current_song WHERE guild_id = ?`);
  return stmt.get(guildId);
}

const updateCurrentSong = function(payload) {
  if (!db) return;

  if (typeof payload.song !== 'string') payload.song = JSON.stringify(payload.song);

  const stmt = db.prepare(`UPDATE current_song SET song = ? WHERE guild_id = ?`);
  stmt.run(payload.song, payload.guild_id);
}

const getGuildConfig = function(id) {
  if (!db) return;

  const stmt = db.prepare(`SELECT * FROM guild WHERE id = ?`);
  return stmt.get(id);
}

const getAllGuilds = function() {
  if (!db) return;

  const stmt = db.prepare(`SELECT * FROM guild`);
  return stmt.all();
}

const initSchemaStructure = function() {
  if (!db) return;

  db.prepare(`CREATE TABLE IF NOT EXISTS guild (
    id TEXT PRIMARY KEY,
    queue_message_id TEXT,
    queue_channel_id TEXT,
    queue_banner_id TEXT
  )`).run();

  db.prepare(`CREATE TABLE IF NOT EXISTS current_song (
    guild_id TEXT PRIMARY KEY,
    song TEXT
  )`).run();
}

const initDB = function() {
  if (!fs.existsSync('./data')) fs.mkdirSync('./data');
  if (!fs.existsSync('./data/db.sqlite')) fs.writeFileSync('./data/db.sqlite', '');

  const db = sql('./data/db.sqlite');
  db.pragma('journal_mode = WAL')

  global.db = db;
  initSchemaStructure();
}

module.exports = { initSchemaStructure, initDB, insertGuild, updateGuild, getGuildConfig, getAllGuilds, updateCurrentSong, getCurrentSong };
