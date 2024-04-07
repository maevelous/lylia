const { cleanChannel } = require("../../utils/misc")

module.exports = {
  name: 'clean',
  emphemeral: true,
  description: "Clean the channel of all messages.",
  async execute({ client, inter }) {
    if (!inter.member.permissions.has("ADMINISTRATOR"))
      return inter.editReply({
        content: "You do not have the required permissions to run this command.",
      });

    cleanChannel(inter)

  },
};
