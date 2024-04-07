const { EmbedBuilder } = require('discord.js');
module.exports = async ({ client, inter, queue }) => {
  if (!queue || !queue.isPlaying()) return

  queue.delete();

  const StopEmbed = new EmbedBuilder()
    .setColor('#2f3136')
    .setAuthor({ name: `Music stopped into this server, see you next time ✅` })


  // return inter.editReply({ embeds: [StopEmbed], ephemeral: true });
  inter.deleteReply();
}
