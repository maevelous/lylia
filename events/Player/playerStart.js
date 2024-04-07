// const { EmbedBuilder } = require("discord.js");
const { updateQueue } = require("../../utils/queue");
const fs = require("fs");
const { updateCurrentSong } = require("../../utils/db");

module.exports = (queue, track) => {
  if (!client.config.app.loopMessage && queue.repeatMode !== 0) return;

  updateCurrentSong({
    guild_id: queue.guild.id,
    song: JSON.stringify(track),
  });
  updateQueue(queue);

  // uncomment this if you want the bot to announce each new song
  /*
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `Started playing ${track.title} in ${queue.channel.name} 🎧`,
      iconURL: track.thumbnail,
    })
    .setColor("#2f3136");

  queue.metadata.send({ embeds: [embed] });
  */
};
