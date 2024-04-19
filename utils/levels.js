const { EmbedBuilder } = require("discord.js");
const { colors } = require("../utils/entities");
const { getUserExp, updateUserExp } = require("../utils/db/levels");
const { emotes } = require("../utils/entities");

const getMofifierChar = function (nums) {
  switch (nums.length) {
    case 2:
      return "k";
    case 3:
      return "m";
    case 4:
      return "b";
    case 5:
      return "t";
    default:
      return "";
  }
};

const numToParts = function (num) {
  const reversed = num.toString().split("").reverse().join("");

  const parts = reversed
    .match(/.{1,3}/g)
    .reverse()
    .map((part) => part.split("").reverse().join(""));

  return parts;
};

const roundPart = function (part) {
  if (part.length === 1) return part;

  if (+part[1] >= 5) return +part[0] + 1;

  return part[0];
};

const shortenNum = function (num, precision = false) {
  const parts = numToParts(num);
  const modifier = getMofifierChar(parts);

  const decimalPlace =
    parts.length === 1 || +parts[1][0] === 0 ? "" : `,${roundPart(parts[1])}`;

  return precision
    ? `${parts[0]}${decimalPlace}${modifier}`
    : parts[0] + modifier;
};

const expToLevels = function (exp) {
  return Math.floor(0.07 * Math.sqrt(exp)) + 1;
};

const grantExp = function (message) {
  const res = getUserExp(message.author.id);
  const exp = res?.xp ?? 0;
  const xp = Math.floor(Math.random() * 10) + 15;
  const newExp = exp + xp;

  updateUserExp(message.author, newExp);
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
  shortenNum,
};
