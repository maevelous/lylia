const { EmbedBuilder, ChannelType, cleanContent } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "setup",
  description: "Setup the music channel",
  showHelp: false,

  async execute({ client, inter }) {
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

    const embed = new EmbedBuilder()
      .setTitle("No song currently playing")
      .setImage(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROjaqjTO_3NAOAynkH5-V1CN-WRjjkNMhhuFvPOywl0A&s",
      )
      .setColor("Purple");

    const msg = await channel.send({
      embeds: [embed],
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

    inter.editReply({ embeds: [replyembed] });

    const payload = {
      channel_id: channel.id,
      message_id: msg.id,
      current_song: null,
    };
    fs.writeFileSync("./data/data.json", JSON.stringify(payload, null, "\t"));
  },
};
