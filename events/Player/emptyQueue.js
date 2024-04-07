const { EmbedBuilder } = require("discord.js");
const { updateQueue } = require("../../utils/queue");
const fs = require("fs");

module.exports = (queue) => {
  const emptyQueue = new EmbedBuilder()
    .setAuthor({ name: `No more songs in the queue! ❌` })
    .setColor("#2f3136");

  const settings = JSON.parse(fs.readFileSync("./data/data.json"));
  settings.current_song = null;
  fs.writeFileSync("./data/data.json", JSON.stringify(settings, null, "\t"));

  updateQueue(queue);

  // remove this comment if you want the bot to announce that the queue is empty
  // queue.metadata.send({ embeds: [emptyQueue] });
};
