const { EmbedBuilder } = require("discord.js");

const banNotice = async function (user, guild, reason) {
  const emoji = "🔨";

  const embed = new EmbedBuilder()
    .setTitle(`${emoji} | You have been banned!`)
    .setDescription(
      `You have been banned from ${guild.name} for the following reason: \n*${reason}*`,
    )
    .setColor("#ff0000")
    .setTimestamp();

  return user
    .send({ embeds: [embed] })
    .then(() => true)
    .catch(() => false);
};

const kickNotice = async function (user, guild, reason) {
  const emoji = "👢";

  const embed = new EmbedBuilder()
    .setTitle(`${emoji} | You have been kicked!`)
    .setDescription(
      `You have been kicked from ${guild.name} for the following reason: \n*${reason}*`,
    )
    .setColor("#ff8c00")
    .setTimestamp();

  return user
    .send({ embeds: [embed] })
    .then(() => true)
    .catch(() => false);
};

const muteNotice = async function (user, guild, reason) {
  const emoji = "🔇";

  const embed = new EmbedBuilder()
    .setTitle(`${emoji} | You have been muted!`)
    .setDescription(
      `You have been muted in ${guild.name} for the following reason: \n*${reason}*`,
    )
    .setColor("#0000ff")
    .setTimestamp();

  return user
    .send({ embeds: [embed] })
    .then(() => true)
    .catch(() => false);
};

const warnNotice = async function (user, guild, reason) {
  const emoji = "!!";

  const embed = new EmbedBuilder()
    .setTitle(`${emoji} | You have been warned!`)
    .setDescription(
      `You have been warned in ${guild.name} for the following reason: \n*${reason}*`,
    )
    .setColor("RED")
    .setTimestamp();

  return user
    .send(embed)
    .then(() => true)
    .catch(() => false);
};

module.exports = {
  banNotice,
  kickNotice,
  muteNotice,
  warnNotice,
};
