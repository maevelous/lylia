const { EmbedBuilder } = require("discord.js");
const { updateQueue } = require("../../utils/queue");
const fs = require("fs");
const { getGuildConfig, updateCurrentSong } = require("../../utils/db");

module.exports = (queue) => {
  const emptyQueue = new EmbedBuilder()
    .setAuthor({ name: `No more songs in the queue! ❌` })
    .setColor("#2f3136");

  const config = getGuildConfig(queue.guild.id);
  updateCurrentSong({ guild_id: config.id, song: null });

  updateQueue(queue);

  // remove this comment if you want the bot to announce that the queue is empty
  // queue.metadata.send({ embeds: [emptyQueue] });
};
