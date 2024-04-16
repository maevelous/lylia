const { COMMAND_OPTIONS } = require("../../enums");
const { setupMusicChannel, setupModeration } = require("../../utils/setup");

module.exports = {
  name: "setup",
  ephemeral: true,
  description: "Set up various modules in the server",
  showHelp: false,
  options: [
    {
      name: "music",
      description: "Set up the music module",
      type: COMMAND_OPTIONS.SUB_COMMAND,
    },
    {
      name: "moderation",
      description: "Set up the moderation module",
      type: COMMAND_OPTIONS.SUB_COMMAND,
    },
  ],

  async execute({ client, inter }) {
    const subcommand = inter.options.getSubcommand();

    switch (subcommand) {
      case "music":
        setupMusicChannel(client, inter);
        break;
      case "moderation":
        setupModeration(client, inter);
        break;
    }
  },
};
