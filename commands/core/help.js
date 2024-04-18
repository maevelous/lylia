const { EmbedBuilder } = require("discord.js");
const { colors } = require("../../utils/entities");

module.exports = {
  name: "help",
  ephemeral: false,
  description: "Lists all the commands this bot has!",
  showHelp: false,

  execute({ client, inter }) {
    const commands = client.commands.filter((x) => x.showHelp !== false);

    const embed = new EmbedBuilder()
      .setColor(colors.default)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
      })
      .addFields([
        {
          name: `Enabled - ${commands.size}`,
          value: commands.map((x) => `\`${x.name}\``).join(" | "),
        },
      ])
      .setTimestamp();

    inter.editReply({ embeds: [embed] });
  },
};
