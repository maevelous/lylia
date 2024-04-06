const fs = require("fs");
const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { QueryType, useMainPlayer } = require("discord-player");


const back = new ButtonBuilder()
  .setEmoji("1226211287982411928")
  .setCustomId(JSON.stringify({ ffb: "back" }))
  .setStyle("Secondary");

const skip = new ButtonBuilder()
  .setEmoji("1226211286736441426")
  .setCustomId(JSON.stringify({ ffb: "skip" }))
  .setStyle("Secondary");

const resumepause = new ButtonBuilder()
  .setEmoji("1226211290549190708")
  .setCustomId(JSON.stringify({ ffb: "resume&pause" }))
  .setStyle("Danger");

const loop = new ButtonBuilder()
  .setEmoji("1226211289332711555")
  .setCustomId(JSON.stringify({ ffb: "loop" }))
  .setStyle("Secondary");

const lyrics = new ButtonBuilder()
  .setEmoji("1226208367479881778")
  .setCustomId(JSON.stringify({ ffb: "lyrics" }))
  .setStyle("Secondary");



const updateQueue = async function(queue) {
  const attachmentDir = "./assets";
  const assets = fs.readdirSync(attachmentDir);

  const settings = JSON.parse(fs.readFileSync("./data/data.json"));
  const channel = queue.metadata;
  await channel.messages.fetch(settings.message_id).catch(() => null);
  const msg = channel.messages.cache.get(settings.message_id);

  let queueLength = 0; // I'm lazy, queue.tracks is a collection and I don't want to work with it
  const queueString = queue.tracks
    .map((track, i) => {
      queueLength++;
      if (queueLength > 10) return "";

      return `${i + 1}. [${track.author} - ${track.title}](${track.url}) - [${track.requestedBy}]`;
    })
    .join("\n");

  const currentSong = settings.current_song;
  let currentSongString = currentSong
    ? `[${currentSong.author} - ${currentSong.title}](${currentSong.url}) - [<@${currentSong.requestedBy}>]`
    : "";

  const description = `${currentSongString}`;

  const asset = new AttachmentBuilder(`${attachmentDir}/${assets[Math.floor(Math.random() * assets.length)]}`)
  const assetName = asset.attachment.split("/")[2]

  const embed = new EmbedBuilder()
    .setTitle(!currentSong ? "No songs in queue" : "Now playing")
    .setColor(msg.embeds[0].color)
    .setImage(`attachment://${assetName}`)
    .setFooter({ text: `Total songs in queue: ${queueLength}` })
  if (description) embed.setDescription(description)

  if (queue.node.isPaused()) resumepause.setEmoji("1226209614966554676");
  else resumepause.setEmoji("1226211290549190708");

  const buttonRow = new ActionRowBuilder().addComponents(
    back,
    loop,
    resumepause,
    lyrics,
    skip,
  );

  const msgPayload = {
    embeds: [embed],
    content: queueLength > 0 ? `**Queue**:\n${queueString}` : "",
    files: [asset],
    components: currentSong ? [buttonRow] : []
  };

  msg.edit(msgPayload);
};

const updateComponents = async function(queue, message) {
  const settings = JSON.parse(fs.readFileSync("./data/data.json"));
  const channel = queue.metadata;
  await channel.messages.fetch(settings.message_id).catch(() => null);
  const msg = channel.messages.cache.get(settings.message_id);

  if (queue.node.isPaused()) {
    resumepause.setEmoji("1226209614966554676");
    resumepause.setStyle("Primary")
  } else {
    resumepause.setEmoji("1226211290549190708");
    resumepause.setStyle("Danger")
  }

  const buttonRow = new ActionRowBuilder().addComponents(
    back,
    loop,
    resumepause,
    lyrics,
    skip,
  );

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
