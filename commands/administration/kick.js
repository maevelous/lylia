const { newLogNotice } = require("../../utils/logs");
const { COMMAND_OPTIONS, MOD_ACTION } = require("../../enums");
const { kickNotice } = require("../../utils/modnotices");

module.exports = {
  name: "kick",
  ephemeral: true,
  description: "Kick a user",
  showHelp: false,
  options: [
    {
      name: "user",
      description: "The user to kick",
      type: COMMAND_OPTIONS.USER,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the kick",
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

    if (!member.kickable)
      return inter.editReply({
        content:
          "I cannot kick this user.\nThey may have a higher role than me or I do not have the required permissions.",
      });

    await kickNotice(user, inter.guild, reason ?? "No reason provided");

    const success = await member
      .kick()
      .then(() => true)
      .catch(() => false);
    if (!success)
      return inter.editReply({
        content: "Failed to kick user",
      });

    inter.editReply({
      content: `Kicked ${user.tag}.`,
    });

    const kickAuditEntry = {
      action: MOD_ACTION.KICK,
      user: user,
      author: inter.user,
      reason: reason ?? "No reason provided",
    };
    newLogNotice(client, inter, kickAuditEntry);
  },
};
