const { updateQueue } = require("../../utils/queue");
const { useMainPlayer } = require("discord-player");
const { getAllGuilds, updateCurrentSong } = require("../../utils/db");

module.exports = async (client) => {
  console.log(`Logged to the client ${client.user.username}\nlets play some music!`);
  client.user.setActivity(client.config.app.playing);

  const guilds = getAllGuilds();

  const player = useMainPlayer();
  for (const guild of guilds) {
    const channel = client.channels.cache.get(guild.queue_channel_id);
    if (!channel) continue;

    updateCurrentSong({
      guild_id: guild.id,
      song: null,
    });

    const queue = player.nodes.create(guild.id, {
      metadata: channel,
      spotifyBridge: client.config.opt.spotifyBridge,
      volume: client.config.opt.volume,
      leaveOnEmpty: client.config.opt.leaveOnEmpty,
      leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
      leaveOnEnd: client.config.opt.leaveOnEnd,
      leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
    });

    updateQueue(queue);
  }
};
