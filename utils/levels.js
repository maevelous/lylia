const { EmbedBuilder } = require("discord.js");
const { colors } = require("../utils/entities");
const { getUserExp, updateUserExp } = require("../utils/db/levels");
const { emotes } = require("../utils/entities");

const expToLevels = function (exp) {
  return Math.floor(0.07 * Math.sqrt(exp)) + 1;
};

const grantExp = function (message) {
  const res = getUserExp(message.author.id);
  const exp = res?.xp ?? 0;
  const xp = Math.floor(Math.random() * 10) + 15;
  const newExp = exp + xp;

  updateUserExp(message.author.id, newExp);
  levelUpNotice(exp, newExp, { message, user: message.author });
};

const levelUpNotice = function (formerXp, currentXp, { message, user }) {
  const formerLevel = expToLevels(formerXp);
  const currentLevel = expToLevels(currentXp);

  if (currentLevel <= formerLevel) return;

  const embed = new EmbedBuilder()
    .setDescription(
      `<:level:${emotes.level}> | ${user} has leveled up to level ${currentLevel}!`,
    )
    .setColor(colors.default)
    .setTimestamp();

  message.channel.send({ embeds: [embed] });
};

module.exports = {
  expToLevels,
  levelUpNotice,
  grantExp,
};
