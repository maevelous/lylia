const maxVol = client.config.opt.maxVol;
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");
const { updateQueue } = require("../../utils/queue");

module.exports = {
  name: "volume",
  ephemeral: true,
  description: "adjust",
  voiceChannel: true,
  options: [
    {
      name: "volume",
      description: "the volume to change to",
      type: ApplicationCommandOptionType.Number,
      required: true,
      minValue: 1,
      maxValue: maxVol,
    },
  ],

  execute({ inter }) {
    const player = useMainPlayer();

    const queue = useQueue(inter.guild);

    if (!queue)
      return inter.editReply({
        content: `No music currently playing ${inter.member}... try again ? ❌`,
        ephemeral: true,
      });
    const vol = inter.options.getNumber("volume");

    if (queue.node.volume === vol)
      return inter.editReply({
        content: `The volume you want to change is already the current one ${inter.member}... try again ? ❌`,
        ephemeral: true,
      });

    const success = queue.node.setVolume(vol);
    updateQueue(queue);

    return inter.editReply({
      content: success
        ? `The volume has been modified to ${vol}/${maxVol}% 🔊`
        : `Something went wrong ${inter.member}... try again ? ❌`,
    });
  },
};
