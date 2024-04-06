const fs = require("fs");

const cleanChannel = async function(inter) {
  const settings = JSON.parse(fs.readFileSync("./data/data.json"));
  const musicChannelId = settings.channel_id;
  const channelId = inter.channelId;
  const channel = client.channels.cache.get(channelId);
  if (channelId !== musicChannelId) return;

  const messageIdToKeep = settings.message_id;

  // Fetch the last 100 messages in the channel
  const fetched = await channel.messages.fetch({ limit: 100 });

  // Filter out the message you want to keep
  const messagesToDelete = fetched.filter(m => m.id !== messageIdToKeep);

  // Delete the messages
  channel.bulkDelete(messagesToDelete, true).catch(console.error);
}

module.exports = { cleanChannel }
