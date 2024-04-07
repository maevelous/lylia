// const { EmbedBuilder } = require("discord.js");
const { updateQueue } = require("../../utils/queue");
const fs = require("fs");

const setCurrentSong = (track) => {
  const settings = JSON.parse(fs.readFileSync("./data/data.json"));
  settings.current_song = track;
  fs.writeFileSync("./data/data.json", JSON.stringify(settings, null, "\t"));
};

module.exports = (queue, track) => {
  if (!client.config.app.loopMessage && queue.repeatMode !== 0) return;

  setCurrentSong(track);
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
