const { newLogNotice } = require("../../utils/logs");
const { COMMAND_OPTIONS, MOD_ACTION } = require("../../enums");

module.exports = {
  name: "unban",
  ephemeral: true,
  description: "Unban a user",
  showHelp: false,
  options: [
    {
      name: "user",
      description: "The id of the user to unban",
      type: COMMAND_OPTIONS.USER,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the unban",
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
    const userId = inter.options.getUser("user");
    const user = await client.users.fetch(userId);

    const success = await inter.guild.members
      .unban(userId, reason)
      .then(() => true)
      .catch(() => false);
    if (!success)
      return inter.editReply({
        content: "Failed to unban user",
      });

    inter.editReply({
      content: `Sucessfully unbanned user ${user.tag}.`,
    });

    const unbanAuditEntry = {
      action: MOD_ACTION.UNBAN,
      user: user,
      author: inter.user,
      reason: reason ?? "No reason provided",
    };
    newLogNotice(client, inter, unbanAuditEntry);
  },
};
