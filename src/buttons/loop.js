const { QueueRepeatMode } = require('discord-player');
const { updateQueue } = require('../../utils/queue');

module.exports = async ({ inter, queue }) => {

  const methods = ['disabled', 'track', 'queue'];

  if (!queue || !queue.isPlaying()) return inter.deferUpdate();

  const repeatMode = queue.repeatMode

  if (repeatMode === 0) queue.setRepeatMode(QueueRepeatMode.TRACK)

  if (repeatMode === 1) queue.setRepeatMode(QueueRepeatMode.QUEUE)

  if (repeatMode === 2) queue.setRepeatMode(QueueRepeatMode.OFF)

  updateQueue(queue);

  return inter.reply({
    content: `loop made has been set to **${methods[queue.repeatMode]}**.✅`,
    ephemeral: true
  })
}
