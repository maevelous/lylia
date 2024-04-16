const { getGuildConfig } = require("../../utils/db/config");
const { newLogNotice } = require("../../utils/logs");
const { COMMAND_OPTIONS, MOD_ACTION } = require("../../enums");

module.exports = {
  name: "unmute",
  ephemeral: true,
  description: "Unmute a user",
  showHelp: false,
  options: [
    {
      name: "user",
      description: "The user to unmute",
      type: COMMAND_OPTIONS.USER,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the unmute",
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
    if (!config)
      return inter.editReply({
        content: "Error retrieving guild config",
      });

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

    if (!member.roles.cache.has(role.id))
      return inter.editReply({
        content: "User is not muted",
      });

    member.roles.remove(role.id);

    inter.editReply({
      content: `Successfully unmuted ${user.tag}.`,
    });

    const unmuteNotice = {
      action: MOD_ACTION.UNMUTE,
      user,
      author: inter.user,
      reason: reason ?? "No reason provided",
    };

    newLogNotice(client, inter, unmuteNotice);
  },
};
