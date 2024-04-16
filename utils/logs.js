const { getGuildConfig } = require("../utils/db/config");
const { EmbedBuilder } = require("discord.js");
const { MOD_ACTION } = require("../enums");
const { colors } = require("../utils/entities");
const { insertAuditLog } = require("../utils/db/audit");

const getEmoji = function (action) {
  switch (action) {
    case MOD_ACTION.MUTE:
      return "🔇";
    case MOD_ACTION.UNMUTE:
      return "🔊";
    case MOD_ACTION.KICK:
      return "👢";
    case MOD_ACTION.BAN:
      return "🔨";
    case MOD_ACTION.UNBAN:
      return "🔓";
    case MOD_ACTION.WARN:
      return "!!";
    default:
      return " ";
  }
};

const newLogNotice = function (client, inter, options) {
  const config = getGuildConfig(inter.guildId);
  if (!config) return;

  const { audit_channel_id } = config;
  if (!audit_channel_id) return;

  const channel = client.channels.cache.get(audit_channel_id);
  if (!channel) return;

  const emoji = getEmoji(options.action);

  const notice = new EmbedBuilder()
    .setTitle(`[${emoji}] ${options.action} ${options.user.tag}`)
    .addFields(
      {
        name: "Moderator",
        value: `${options.author}`,
        inline: true,
      },
      {
        name: "Target",
        value: `${options.user}`,
        inline: true,
      },
      {
        name: "Reason",
        value: options.reason,
        inline: false,
      },
    )
    .setColor(colors.default)
    .setTimestamp();

  if (options.duration) {
    notice.addFields({
      name: "Duration",
      value: options.duration,
      inline: false,
    });
  }

  channel.send({ embeds: [notice] });

  insertAuditLog({
    guild_id: inter.guildId,
    user_id: options.user.id,
    author_id: options.author.id,
    action: options.action,
    timestamp: new Date().toISOString(),
    reason: options.reason,
  });
};

module.exports = {
  newLogNotice,
};
