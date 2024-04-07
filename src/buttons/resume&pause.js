const { updateComponents } = require('../../utils/queue');

module.exports = async ({ inter, queue }) => {
  if (!queue || !queue.isPlaying()) return inter.deferUpdate();

  const resumed = queue.node.resume();
  if (!resumed) {
    queue.node.pause();
  }

  updateComponents(queue, inter.guildId)
  inter.deferUpdate();
}
