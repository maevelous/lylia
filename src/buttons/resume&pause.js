const { updateComponents } = require('../../utils/queue');

module.exports = async ({ inter, queue }) => {
  if (!queue || !queue.isPlaying()) return inter.editReply({ content: `No music currently playing... try again ? ❌`, ephemeral: true });

  const resumed = queue.node.resume();
  if (!resumed) {
    queue.node.pause();
  }

  updateComponents(queue)
}
