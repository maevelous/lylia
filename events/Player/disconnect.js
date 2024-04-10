const { updateQueue } = require("../../utils/queue.js");
const { getGuildConfig, updateCurrentSong } = require("../../utils/db.js");

module.exports = (queue) => {
  /*
  const Disconnect = new EmbedBuilder()
    .setAuthor({
      name: `Disconnected from the voice channel, clearing the queue! ❌`,
    })
    .setColor("#2f3136");

  queue.metadata.send({ embeds: [Disconnect] });
  */
  const config = getGuildConfig(queue.guild.id);
  updateCurrentSong({ guild_id: config.id, song: null });

  updateQueue(queue);
};
