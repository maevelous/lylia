const fs = require("fs");
const { addSongToQueue } = require("../../utils/queue");
const { getGuildConfig } = require("../../utils/db");

module.exports = async (client, message) => {
  const config = getGuildConfig(message.guild.id);
  if (!config || !config.queue_channel_id) return;

  const musicChannelId = config.queue_channel_id;
  const channelId = message.channelId;

  const isMusicChannel = channelId === musicChannelId;
  const isBot = message.author.bot;
  if (!isMusicChannel || isBot) return;

  const songName = message.content;

  addSongToQueue(songName, message).then(() => {
    message.delete().catch(() => { });
  })
};

