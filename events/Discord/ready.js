const { updateQueue } = require("../../utils/queue");
const { useMainPlayer } = require("discord-player");
const fs = require("fs");

module.exports = async (client) => {
  console.log(`Logged to the client ${client.user.username}\nlets play some music!`);
  client.user.setActivity(client.config.app.playing);

  const player = useMainPlayer();

  const settings = JSON.parse(fs.readFileSync("./data/data.json"));
  settings.current_song = null;

  const channelId = settings.channel_id;
  const channel = await client.channels.fetch(channelId);
  const guild = await client.guilds.fetch(client.config.app.guild);

  const queue = player.nodes.create(guild, {
    metadata: channel,
    spotifyBridge: client.config.opt.spotifyBridge,
    volume: client.config.opt.volume,
    leaveOnEmpty: client.config.opt.leaveOnEmpty,
    leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
    leaveOnEnd: client.config.opt.leaveOnEnd,
    leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
  });

  fs.writeFileSync("./data/data.json", JSON.stringify(settings, null, "\t"))

  updateQueue(queue);
};
