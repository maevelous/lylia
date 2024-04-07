const { cleanChannel } = require("../../utils/misc")
module.exports = {
  name: 'clean',
  emphemeral: false,
  description: "Clean the channel of all messages.",
  async execute({ client, inter }) {

    cleanChannel(inter)

  },
};
