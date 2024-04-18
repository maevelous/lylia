const getUserExp = function (userId) {
  if (!db) return;

  const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  return stmt.get(userId);
};

const updateUserExp = function (user, exp) {
  if (!db) return;

  const stmt = db.prepare(
    `INSERT OR REPLACE INTO users (id, username, xp) VALUES (?, ?, ?)`,
  );
  stmt.run(user.id, user.username, exp);
};

const getAllUsers = function () {
  if (!db) return;

  const stmt = db.prepare(`SELECT * FROM users`);
  return stmt.all();
};

module.exports = {
  getUserExp,
  updateUserExp,
  getAllUsers,
};
