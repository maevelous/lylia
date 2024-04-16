const getCurrentSong = function (guildId) {
  if (!db) return;

  const stmt = db.prepare(`SELECT * FROM current_song WHERE guild_id = ?`);
  return stmt.get(guildId);
};

const updateCurrentSong = function (payload) {
  if (!db) return;

  if (typeof payload.song !== "string")
    payload.song = JSON.stringify(payload.song);

  const stmt = db.prepare(
    `UPDATE current_song SET song = ? WHERE guild_id = ?`,
  );
  stmt.run(payload.song, payload.guild_id);
};

module.exports = { getCurrentSong, updateCurrentSong };
