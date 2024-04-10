const { updateQueue } = require("../../utils/queue.js");
const { getGuildConfig, updateCurrentSong } = require("../../utils/db.js");

module.exports = (queue) => {
  /*
    const ErrorEmbed = new EmbedBuilder()
    .setAuthor({name: `Bot had an unexpected error, please check the console imminently!`})
    .setColor('#EE4B2B')

    queue.metadata.send({ embeds: [ErrorEmbed] })
  */

  const config = getGuildConfig(queue.guild.id);
  updateCurrentSong({ guild_id: config.id, song: null });

  updateQueue();
};
