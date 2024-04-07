const fs = require("fs");
const { AttachmentBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const { updateQueue } = require("../../utils/queue");
const { insertGuild } = require("../../utils/db");
const { getEmbedControls } = require("../../utils/misc");

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
      .setTitle("Currently not playing")
      .setImage(`attachment://${assetName}`)
      .setColor("#2B2D31");

    const bannerMsg = await channel.send({
      files: [banner],
      fetchReply: true
    });

    const msg = await channel.send({
      content: "\uFEFF\n__**Queue**__:\nJoin a voice channel and send a song name in this channel or use the command to add it to the queue!",
      embeds: [embed],
      files: [asset],
      fetchReply: true,
      components: [getEmbedControls()]
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
      id: inter.guild.id,
      queue_channel_id: channel.id,
      queue_message_id: msg.id,
      queue_banner_id: bannerMsg.id,
      song: null
    };

    insertGuild(payload);
    updateQueue(queue);
  },
};

