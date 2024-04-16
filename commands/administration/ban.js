const { newLogNotice } = require("../../utils/logs");
const { COMMAND_OPTIONS, MOD_ACTION } = require("../../enums");
const { banNotice } = require("../../utils/modnotices");

module.exports = {
  name: "ban",
  ephemeral: true,
  description: "Ban a user",
  showHelp: false,
  options: [
    {
      name: "user",
      description: "The user to ban",
      type: COMMAND_OPTIONS.USER,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the ban",
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
    const member = await inter.guild.members.fetch(user.id).catch(() => null);
    if (!member)
      return inter.editReply({
        content: "User not found",
      });

    if (!member.bannable)
      return inter.editReply({
        content:
          "I cannot ban this user.\nThey may have a higher role than me or I do not have the required permissions.",
      });

    banNotice(user, inter.guild, reason ?? "No reason provided");

    const success = await member
      .ban()
      .then(() => true)
      .catch(() => false);
    if (!success)
      return inter.editReply({
        content: "Failed to ban user",
      });

    inter.editReply({
      content: `Banned ${user.tag}.`,
    });

    const banAuditEntry = {
      action: MOD_ACTION.BAN,
      user: user,
      author: inter.user,
      reason: reason ?? "No reason provided",
    };
    newLogNotice(client, inter, banAuditEntry);
  },
};
