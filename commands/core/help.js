const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  ephemeral: false,
  description: "All the commands this bot has!",
  showHelp: false,

  execute({ client, inter }) {
    const commands = client.commands.filter(x => x.showHelp !== false);

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
      .setDescription('100% made by maeve')
      .addFields([{ name: `Enabled - ${commands.size}`, value: commands.map(x => `\`${x.name}\``).join(' | ') }])
      .setTimestamp()
      .setFooter({ text: '100% MADE BY MAEVE NO CAP', iconURL: inter.member.avatarURL({ dynamic: true }) });

    inter.editReply({ embeds: [embed] });
  },
};
