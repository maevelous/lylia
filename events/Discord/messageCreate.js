const { addSongToQueue } = require("../../utils/queue");
const { getGuildConfig } = require("../../utils/db");
const { useQueue } = require("discord-player");
const { grantExp } = require("../../utils/levels");

const handleMusicSuggestion = async function (message, queue) {
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

const messages = new Map();

module.exports = async (client, message) => {
  if (message.author.bot) return;

  const queue = useQueue(message.guild);

  const config = getGuildConfig(message.guild.id);
  if (!config || !config.queue_channel_id) return;

  const musicChannelId = config.queue_channel_id;
  const channelId = message.channel.id;

  const isMusicChannel = channelId === musicChannelId;

  if (isMusicChannel) handleMusicSuggestion(message, queue);

  const time = messages.get(message.author.id);
  // if (time && new Date().getTime() - time < 10_000) return;

  grantExp(message);
  messages.set(message.author.id, new Date().getTime());
};
