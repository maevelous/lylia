const fs = require("fs");
const sql = require("better-sqlite3");
const { audit, music, config } = require("./db/index");
const t = require("./db");

const {
  insertGuild,
  insertGuildFromMusicSetup,
  insertGuildFromModerationSetup,
  updateGuild,
  getGuildConfig,
  getAllGuilds,
} = config;
const { getCurrentSong, updateCurrentSong } = music;

const initSchemaStructure = function () {
  if (!db) return;

  db.prepare(
    `CREATE TABLE IF NOT EXISTS guild (
    id TEXT PRIMARY KEY,
    queue_message_id TEXT,
    queue_channel_id TEXT,
    queue_banner_id TEXT,
    role_muted_id TEXT,
    role_moderator_id TEXT,
    audit_channel_id TEXT
  )`,
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS current_song (
    guild_id TEXT PRIMARY KEY,
    song TEXT
  )`,
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT,
    user_id TEXT,
    author_id TEXT,
    action TEXT,
    timestamp TEXT,
    data TEXT
  )`,
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      xp INTEGER,
      username VARCHAR(100)
    )`,
  ).run();
};

const initDB = function () {
  if (!fs.existsSync("./data")) fs.mkdirSync("./data");
  if (!fs.existsSync("./data/db.sqlite"))
    fs.writeFileSync("./data/db.sqlite", "");

  const db = sql("./data/db.sqlite");
  db.pragma("journal_mode = WAL");

  global.db = db;
  initSchemaStructure();
};

module.exports = {
  /* Native */
  initSchemaStructure,
  initDB,

  /* Config */
  insertGuild,
  insertGuildFromMusicSetup,
  insertGuildFromModerationSetup,
  updateGuild,
  getGuildConfig,
  getAllGuilds,

  /* Music */
  updateCurrentSong,
  getCurrentSong,

  /* Audit */
};
