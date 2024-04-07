const { EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');

module.exports = {
  name: 'nowplaying',
  ephemeral: true,
  description: 'view what is playing!',
  voiceChannel: true,

  execute({ inter }) {
    const queue = useQueue(inter.guild);
    const player = useMainPlayer()

    if (!queue) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? ❌`, ephemeral: true });

    const track = queue.currentTrack;
    if (!track.duration) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? ❌`, ephemeral: true });
    const methods = ['disabled', 'track', 'queue'];

    const timestamp = track.duration;

    const trackDuration = timestamp.progress == 'Infinity' ? 'infinity (live)' : track.duration;

    const progress = queue.node.createProgressBar();


    const embed = new EmbedBuilder()
      .setAuthor({ name: track.title, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
      .setThumbnail(track.thumbnail)
      .setDescription(`Volume **${queue.node.volume}**%\nDuration **${trackDuration}**\nProgress ${progress}\nLoop mode **${methods[queue.repeatMode]}**\nRequested by ${track.requestedBy}`)
      .setColor('#2f3136')
      .setTimestamp()

    inter.editReply({ embeds: [embed] });
  },
};
