const { updateQueue } = require("../../utils/queue.js");
const { getGuildConfig, updateCurrentSong } = require("../../utils/db.js");

module.exports = (queue) => {
  /*
    const emptyChannel = new EmbedBuilder()
    .setAuthor({name: `Nobody is in the voice channel, leaving the voice channel!  ❌`})
    .setColor('#2f3136')

  queue.metadata.send({ embeds: [emptyChannel] });
  */
  const config = getGuildConfig(queue.guild.id);
  updateCurrentSong({ guild_id: config.id, song: null });

  updateQueue(queue);
};
