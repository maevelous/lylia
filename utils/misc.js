const { getGuildConfig } = require("./db.js");
const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { emotes } = require("./entities.js");

const getEmbedControls = function(state = "paused") {
  const back = new ButtonBuilder()
    .setEmoji(emotes.back)
    .setCustomId(JSON.stringify({ ffb: "back" }))
    .setStyle("Secondary");

  const skip = new ButtonBuilder()
    .setEmoji(emotes.skip)
    .setCustomId(JSON.stringify({ ffb: "skip" }))
    .setStyle("Secondary");

  const resumepause = new ButtonBuilder()
    .setEmoji(state === "playing" ? emotes.pause : emotes.play)
    .setCustomId(JSON.stringify({ ffb: "resume&pause" }))
    .setStyle(state === "playing" ? "Danger" : "Primary");

  const loop = new ButtonBuilder()
    .setEmoji(emotes.loop)
    .setCustomId(JSON.stringify({ ffb: "loop" }))
    .setStyle("Secondary");

  const shuffle = new ButtonBuilder()
    .setEmoji(emotes.shuffle)
    .setCustomId(JSON.stringify({ ffb: "shuffle" }))
    .setStyle("Secondary");

  return new ActionRowBuilder().addComponents(back, loop, resumepause, shuffle, skip);
}

const cleanChannel = async function(inter) {
  const config = getGuildConfig(inter.guildId);

  const musicChannelId = config.queue_channel_id;
  const channelId = inter.channelId;
  const channel = client.channels.cache.get(channelId);
  if (channelId !== musicChannelId) return;

  const messagesToKeep = [config.queue_message_id, config.queue_banner_id]

  // Fetch the last 100 messages in the channel
  const fetched = await channel.messages.fetch({ limit: 100 });

  // Filter out the message you want to keep
  const messagesToDelete = fetched.filter(m => !messagesToKeep.includes(m.id));

  // Delete the messages
  channel.bulkDelete(messagesToDelete, true).catch(console.error);
}


module.exports = { cleanChannel, getEmbedControls };
