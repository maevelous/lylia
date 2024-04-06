const fs = require("fs");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

const back = new ButtonBuilder()
  .setLabel("Back")
  .setCustomId(JSON.stringify({ ffb: "back" }))
  .setStyle("Primary");

const skip = new ButtonBuilder()
  .setLabel("Skip")
  .setCustomId(JSON.stringify({ ffb: "skip" }))
  .setStyle("Primary");

const resumepause = new ButtonBuilder()
  .setLabel("Resume & Pause")
  .setCustomId(JSON.stringify({ ffb: "resume&pause" }))
  .setStyle("Danger");

const loop = new ButtonBuilder()
  .setLabel("Loop")
  .setCustomId(JSON.stringify({ ffb: "loop" }))
  .setStyle("Secondary");

const lyrics = new ButtonBuilder()
  .setLabel("lyrics")
  .setCustomId(JSON.stringify({ ffb: "lyrics" }))
  .setStyle("Secondary");

const buttonRow = new ActionRowBuilder().addComponents(
  back,
  loop,
  resumepause,
  lyrics,
  skip,
);

const updateQueue = async function (queue) {
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
  if (currentSong && queueLength > 0) currentSongString += "\n\uFEFF\n\uFEFF";

  const description = `${currentSongString}${queueLength > 0 ? "**Queue**:\n" + queueString : ""}`;

  const embed = new EmbedBuilder()
    .setTitle(
      queueLength === 0 && !currentSong ? "No songs in queue" : "Now playing",
    )
    .setColor(msg.embeds[0].color)
    .setImage(msg.embeds[0].image.url)
    .setFooter({ text: `Total songs in queue: ${queueLength}` });
  if (description.length > 0) embed.setDescription(description);

  msg.edit({ embeds: [embed], components: currentSong ? [buttonRow] : [] });
};

module.exports = { updateQueue };
