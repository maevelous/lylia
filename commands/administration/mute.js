const { getGuildConfig } = require("../../utils/db/config");
const { newLogNotice } = require("../../utils/logs");
const { COMMAND_OPTIONS, MOD_ACTION } = require("../../enums");
const { muteNotice } = require("../../utils/modnotices");

module.exports = {
  name: "mute",
  ephemeral: true,
  description: "Mute a user",
  showHelp: false,
  options: [
    {
      name: "user",
      description: "The user to mute",
      type: COMMAND_OPTIONS.USER,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the mute",
      type: COMMAND_OPTIONS.STRING,
      required: false,
    },
  ],

  async execute({ client, inter }) {
    if (!inter.member.permissions.has("ADMINISTRATOR"))
      return inter.editReply({
        content: "Insufficient permissions",
      });

    const reason = inter.options.getString("reason");
    const user = inter.options.getUser("user");
    const member = await inter.guild.members.fetch(user.id);
    const config = getGuildConfig(inter.guildId);
    const { role_muted_id } = config;

    if (!role_muted_id)
      return inter.editReply({
        content:
          "Muted role not set and could not find pre-existing role.\nPlease run the setup command to set up the required roles.",
      });

    const role = inter.guild.roles.cache.get(role_muted_id);
    if (!role)
      return inter.editReply({
        content: "Error retrieving muted role",
      });

    if (member.roles.cache.has(role.id))
      return inter.editReply({
        content: "User is already muted",
      });

    muteNotice(user, inter.guild, reason ?? "No reason provided");

    member.roles.add(role.id);
    inter.editReply({
      content: `Muted ${user.tag} indefinitely.`,
    });

    const muteAuditEntry = {
      action: MOD_ACTION.MUTE,
      user: user,
      author: inter.user,
      reason: reason ?? "No reason provided",
    };
    newLogNotice(client, inter, muteAuditEntry);
  },
};
