const fs = require("fs");
const { addSongToQueue } = require("../../utils/queue");

module.exports = async (client, message) => {
  const settings = JSON.parse(fs.readFileSync("./data/data.json"));
  const musicChannelId = settings.channel_id;
  const channelId = message.channelId;

  const isMusicChannel = channelId === musicChannelId;
  const isBot = message.author.bot;
  if (!isMusicChannel || isBot) return;

  const songName = message.content;

  addSongToQueue(songName, message).then(() => {
    message.delete().catch(() => { });
  })
};

