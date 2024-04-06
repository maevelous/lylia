const { updateQueue } = require("../../utils/queue.js");
const fs = require("fs");

module.exports = (queue) => {
  /*
  const Disconnect = new EmbedBuilder()
    .setAuthor({
      name: `Disconnected from the voice channel, clearing the queue! ❌`,
    })
    .setColor("#2f3136");

  queue.metadata.send({ embeds: [Disconnect] });
  */

  const settings = JSON.parse(fs.readFileSync("./data/data.json"));
  settings.current_song = null;
  fs.writeFileSync("./data/data.json", JSON.stringify(settings, null, "\t"));

  updateQueue();
};
