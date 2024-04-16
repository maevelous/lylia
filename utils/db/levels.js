const getUserExp = function (userId) {
  if (!db) return;

  const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  return stmt.get(userId);
};

const updateUserExp = function (userId, exp) {
  if (!db) return;

  const stmt = db.prepare(
    `INSERT OR REPLACE INTO users (xp, id) VALUES (?, ?)`,
  );
  stmt.run(exp, userId);
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
