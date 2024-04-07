const fs = require("fs");
const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { QueryType, useMainPlayer } = require("discord-player");
const { emotes } = require("./entities");
const { getGuildConfig, updateGuild, getCurrentSong } = require("./db");
const { getEmbedControls } = require("./misc");

const updateQueue = async function(queue) {
  if (!queue || !queue.tracks) return;
  const config = getGuildConfig(queue.guild.id);

  const attachmentDir = "./assets/embed";
  const assets = fs.readdirSync(attachmentDir);

  const channel = client.channels.cache.get(config.queue_channel_id);
  await channel.messages.fetch(config.queue_message_id).catch(() => null);
  const msg = channel.messages.cache.get(config.queue_message_id);

  let queueLength = 0; // I'm lazy, queue.tracks is a collection and I don't want to work with it
  const queueString = queue.tracks
    .map((track, i) => {
      queueLength++;
      if (queueLength > 10) return "";

      return `${i + 1}. [${track.author} - ${track.title}](${track.url}) - [${track.requestedBy}]`;
    })
    .join("\n");

  const currentSong = JSON.parse(getCurrentSong(queue.guild.id)?.song ?? "")
  let currentSongString = currentSong
    ? `[${currentSong.author} - ${currentSong.title}](${currentSong.url}) - [<@${currentSong.requestedBy}>]`
    : "";

  const description = `${currentSongString}`;

  const asset = new AttachmentBuilder(`${attachmentDir}/${assets[Math.floor(Math.random() * assets.length)]}`)
  const assetName = asset.attachment.split("/")[3]

  const embed = new EmbedBuilder()
    .setTitle(!currentSong ? "Currently not playing" : "Now playing")
    .setColor(msg.embeds[0].color)
    .setImage(`attachment://${assetName}`)
    .setFooter({ text: `Total songs in queue: ${queueLength} | Volume: ${queue.node.volume}%` })
  if (description) embed.setDescription(description)

  const buttonRow = getEmbedControls(queue.node.isPaused() ? "paused" : "playing");

  const msgPayload = {
    embeds: [embed],
    content: "\uFEFF\n__**Queue**__:\n" + (queueLength > 0 ? `${queueString}` : "Join a voice channel and send a song name in this channel or use the command to add it to the queue!"),
    files: [asset],
    components: [buttonRow]
  };

  msg.edit(msgPayload);
};

const updateComponents = async function(queue, guildId) {
  const config = getGuildConfig(guildId);
  if (!config || !config.queue_channel_id) return;

  const channel = client.channels.cache.get(config.queue_channel_id);
  await channel.messages.fetch(config.queue_message_id).catch(() => null);
  const msg = channel.messages.cache.get(config.queue_message_id);

  const buttonRow = getEmbedControls(queue.node.isPaused() ? "paused" : "playing");

  msg.edit({
    components: [buttonRow],
    content: msg.content,
    embeds: msg.embeds,
    files: msg.attachments
  })
}

const addSongToQueue = async function(song, message) {
  const player = useMainPlayer();

  const res = await player.search(song, {
    requestedBy: message.member,
    searchEngine: QueryType.AUTO,
  }).catch(() => null);
  if (!res || !res.tracks.length) return

  const queue = player.nodes.create(message.guild, {
    metadata: message.channel,
    spotifyBridge: client.config.opt.spotifyBridge,
    volume: client.config.opt.volume,
    leaveOnEmpty: client.config.opt.leaveOnEmpty,
    leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
    leaveOnEnd: client.config.opt.leaveOnEnd,
    leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
  });

  try {
    if (!queue.connection) await queue.connect(message.member.voice.channel);
  } catch {
    await player.deleteQueue(message.guildId);

    return;
  }

  // remove this if and add in the above if you want the bot to respond to you each time a song is added
  message.delete()

  res.playlist ? queue.addTrack(res.tracks) : queue.addTrack(res.tracks[0]);

  await updateQueue(queue);

  if (!queue.node.isPlaying()) await queue.node.play();
}

module.exports = { updateQueue, updateComponents, addSongToQueue };
