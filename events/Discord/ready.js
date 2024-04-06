const { updateQueue } = require("../../utils/queue");
const { useMainPlayer } = require("discord-player");
const fs = require("fs");

module.exports = async (client) => {
  console.log(`Logged to the client ${client.user.username}\nlets play some music!`);
  client.user.setActivity(client.config.app.playing);

  const player = useMainPlayer();

  const file = fs.existsSync("./data/data.json")
    ? fs.readFileSync("./data/data.json")
    : "{}";

  let settings = JSON.parse(file);
  if (Object.keys(settings).length === 0) {
    settings = {
      channel_id: null,
      message_id: null,
      current_song: null,
    }

    fs.mkdirSync("./data");
    fs.writeFileSync("./data/data.json", JSON.stringify(settings, null, "\t"));
  }

  // these fields can be null even if the file existed
  if (settings.channel_id === null || settings.message_id === null) return

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
