const fs = require("fs");
const { addSongToQueue } = require("../../utils/queue");
const { getGuildConfig } = require("../../utils/db");
const { useQueue } = require("discord-player");

module.exports = async (client, message) => {
  const queue = useQueue(message.guild);

  const config = getGuildConfig(message.guild.id);
  if (!config || !config.queue_channel_id) return;

  const musicChannelId = config.queue_channel_id;
  const channelId = message.channel.id;

  const isMusicChannel = channelId === musicChannelId;
  const isBot = message.author.bot;
  if (!isMusicChannel || isBot) return;

  const songName = message.content;

  const botChannelId = queue?.connection?.joinConfig.channelId;
  const userChannelId = message.member.voice?.channel.id;

  if (botChannelId && userChannelId !== botChannelId) {
    return message.delete().catch(() => {});
  }

  addSongToQueue(songName, message).then(() => {
    message.delete().catch(() => {});
  });
};
