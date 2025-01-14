const { QueryType, useMainPlayer, useQueue } = require("discord-player");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { updateQueue } = require("../../utils/queue");

module.exports = {
  name: "play",
  ephemeral: true,
  description: "play a song!",
  voiceChannel: true,
  options: [
    {
      name: "song",
      description: "the song you want to play",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async execute({ inter, client }) {
    const player = useMainPlayer();

    const song = inter.options.getString("song");
    const res = await player.search(song, {
      requestedBy: inter.member,
      searchEngine: QueryType.AUTO,
    });
    const NoResultsEmbed = new EmbedBuilder()
      .setAuthor({ name: `No results found... try again ? ❌` })
      .setColor("#2f3136");

    if (!res || !res.tracks.length)
      return inter.editReply({ embeds: [NoResultsEmbed] });

    const queue = player.nodes.create(inter.guild, {
      metadata: inter.channel,
      spotifyBridge: client.config.opt.spotifyBridge,
      volume: client.config.opt.volume,
      leaveOnEmpty: client.config.opt.leaveOnEmpty,
      leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
      leaveOnEnd: client.config.opt.leaveOnEnd,
      leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
    });

    try {
      if (!queue.connection) await queue.connect(inter.member.voice.channel);
    } catch {
      await player.deleteQueue(inter.guildId);

      const NoVoiceEmbed = new EmbedBuilder()
        .setAuthor({ name: `I can't join the voice channel... try again ? ❌` })
        .setColor("#2f3136");

      return inter.editReply({ embeds: [NoVoiceEmbed] });
    }

    /*
    const playEmbed = new EmbedBuilder()
      .setAuthor({
        name: `Loading your ${res.playlist ? "playlist" : "track"} to the queue... ✅`,
      })
      .setColor("#2f3136");
    inter.editReply({
      embeds: [playEmbed],
      fetchReply: true,
    });
    */

    // remove this if and add in the above if you want the bot to respond to you each time a song is added
    inter.deleteReply();

    res.playlist ? queue.addTrack(res.tracks) : queue.addTrack(res.tracks[0]);

    await updateQueue(queue);

    if (!queue.isPlaying()) await queue.node.play();
  },
};
