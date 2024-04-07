const fs = require("fs");
const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const { QueryType, useQueue, useMainPlayer } = require("discord-player");
const { updateQueue } = require("../../utils/queue");

module.exports = {
  name: "setup",
  ephemeral: true,
  description: "Setup the music channel",
  showHelp: false,

  async execute({ client, inter }) {
    const queue = useQueue(inter.guild);

    const channelExists = inter.guild.channels.cache.some(
      (ch) => ch.name === "lylia-music",
    );
    if (channelExists)
      return inter.editReply({
        content: "A music channel already exists in this server",
      });

    const channel = await inter.guild.channels
      .create({
        name: "lylia-music",
        type: ChannelType.GuildText,
      })
      .catch(() => null);
    if (channel === null) return inter.editReply({ content: "Unknown Error" });

    const assets = fs.readdirSync("./assets/embed");
    const asset = new AttachmentBuilder(`./assets/embed/${assets[Math.floor(Math.random() * assets.length)]}`)
    const assetName = asset.attachment.split("/")[3]
    const banner = new AttachmentBuilder(`./assets/banner.png`);

    const embed = new EmbedBuilder()
      .setTitle("No song currently playing")
      .setImage(`attachment://${assetName}`)
      .setColor("#2B2D31");

    const bannerMsg = await channel.send({
      files: [banner],
      fetchReply: true
    });

    const msg = await channel.send({
      embeds: [embed],
      files: [asset],
      fetchReply: true,
    });

    const replyembed = new EmbedBuilder()
      .setTitle("Song request channel has been created!")
      .setDescription(
        `Created channel: <#${channel.id}>\n` +
        `_You can rename and move this channel if you want to_\n` +
        `Most of my music commands will only work in <#${channel.id}> from now on`,
      )
      .setColor("Purple");

    inter.editReply({
      embeds: [replyembed]
    });

    const payload = {
      channel_id: channel.id,
      message_id: msg.id,
      banner_id: bannerMsg.id,
      current_song: null,
    };
    fs.writeFileSync("./data/data.json", JSON.stringify(payload, null, "\t"));
    updateQueue(queue);
  },
};

