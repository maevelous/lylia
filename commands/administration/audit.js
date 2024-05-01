const { getAuditLogForUserInGuild } = require("../../utils/db/audit");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const { MOD_ACTION } = require("../../enums");
const { COMMAND_OPTIONS } = require("../../enums");

module.exports = {
  name: "audit",
  ephemeral: true,
  description: "Retrieve audit logs for user",
  showHelp: false,
  options: [
    {
      name: "user",
      description: "The user to audit",
      type: COMMAND_OPTIONS.USER,
      required: true,
    },
  ],

  async execute({ client, inter }) {
    if (!inter.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return inter.editReply({
        content: "Insufficient permissions",
      });

    const user = inter.options.getUser("user");
    const member = await inter.guild.members.fetch(user.id).catch(() => null);
    if (!member)
      return inter.editReply({
        content: "User not found",
      });

    const auditLog = getAuditLogForUserInGuild(inter.guild.id, user.id);
    if (!auditLog.length || auditLog.length === 0)
      return inter.editReply({
        content: "No audit logs found",
      });

    const embed = new EmbedBuilder()
      .setTitle(`Audit logs for ${user.tag}`)
      .setColor("#5865F2")
      .setTimestamp();

    auditLog.forEach((log) => {
      const author = client.users.cache.get(log.author_id);
      const timestamp = new Date(log.timestamp);
      const relativeDiscordTimestamp = `<t:${Math.floor(timestamp.getTime() / 1000)}:R>`;

      console.log(log);

      embed.addFields({
        name: `${log.action} by ${author.tag} ${relativeDiscordTimestamp}`,
        value: `*-${log.data ?? "No reason provided"}*`,
      });
    });

    inter.editReply({
      embeds: [embed],
    });
  },
};
